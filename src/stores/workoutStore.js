import { defineStore } from "pinia";

const STORAGE_KEY = "fitness_app_data";
const VERSION = "1.0";

export const useWorkoutStore = defineStore("workout", {
  state: () => ({
    // User info
    user: null,
    userName: "Smoldier",

    // Workout data
    userData: {
      completedDays: [],
      weights: {},
      personalBests: {},
      startDate: null,
    },

    // UI state
    selectedDay: null,
    selectedExercise: null,
    currentDay: 0,
    loading: false,
    error: null,
  }),

  getters: {
    currentWorkoutType: (state) => {
      const types = ["Push", "Pull", "Legs"];
      return state.selectedDay !== null ? types[state.selectedDay % 3] : "";
    },

    isCurrentDayCompleted: (state) => {
      return state.userData.completedDays.includes(state.currentDay);
    },

    completionPercentage: (state) => {
      const totalDays = 84; // 12 weeks
      return Math.round(
        (state.userData.completedDays.length / totalDays) * 100,
      );
    },

    totalWorkoutsCompleted: (state) => {
      return state.userData.completedDays.length;
    },

    currentStreak: (state) => {
      const completed = state.userData.completedDays;
      if (completed.length === 0) return 0;

      let streak = 0;
      for (let i = state.currentDay; i >= 0; i--) {
        if (completed.includes(i)) {
          streak++;
        } else {
          break;
        }
      }
      return streak;
    },

    getPersonalBest: (state) => (exerciseName) => {
      return state.userData.personalBests?.[exerciseName] || null;
    },

    getWeightsForDay: (state) => (day) => {
      return state.userData.weights?.[`day-${day}`] || {};
    },
  },

  actions: {
    // Selection actions
    selectDay(day) {
      this.selectedDay = day;
      this.currentDay = day;
    },

    selectExercise(name) {
      this.selectedExercise = name;
    },

    closeExercise() {
      this.selectedExercise = null;
    },

    // Weight tracking
    async saveDayWeights(day, weights) {
      this.loading = true;
      this.error = null;

      try {
        // Validate weights
        if (!this.validateWeights(weights)) {
          throw new Error("Invalid weight values");
        }

        // Store weights
        this.userData.weights[`day-${day}`] = weights;

        // Update personal bests
        this.updatePersonalBests(weights);

        // Save to localStorage
        await this.persistData();
      } catch (err) {
        this.error = err.message;
        console.error("Error saving weights:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Mark workout complete
    async markDayComplete(day) {
      this.loading = true;
      this.error = null;

      try {
        if (!this.userData.completedDays.includes(day)) {
          this.userData.completedDays.push(day);
          this.userData.completedDays.sort((a, b) => a - b);
        }

        // Set start date if first workout
        if (
          !this.userData.startDate &&
          this.userData.completedDays.length === 1
        ) {
          this.userData.startDate = new Date().toISOString();
        }

        await this.persistData();
      } catch (err) {
        this.error = err.message;
        console.error("Error marking day complete:", err);
        throw err;
      } finally {
        this.loading = false;
      }
    },

    // Utility methods
    validateWeights(weights) {
      return Object.values(weights).every(
        (weight) => weight === undefined || weight === "" || weight >= 0,
      );
    },

    updatePersonalBests(weights) {
      Object.entries(weights).forEach(([exercise, weight]) => {
        if (weight && weight > 0) {
          const current = this.userData.personalBests[exercise] || 0;
          if (weight > current) {
            this.userData.personalBests[exercise] = weight;
          }
        }
      });
    },

    // Persistence
    async persistData() {
      try {
        const data = {
          version: VERSION,
          timestamp: new Date().toISOString(),
          userData: this.userData,
          userName: this.userName,
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch (err) {
        this.error = "Failed to save data";
        console.error("Persistence error:", err);
      }
    },

    async loadData() {
      try {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
          const data = JSON.parse(stored);

          // Version check for future migrations
          if (data.version === VERSION) {
            this.userData = data.userData;
            this.userName = data.userName || "Smoldier";
          }
        }
      } catch (err) {
        this.error = "Failed to load data";
        console.error("Load data error:", err);
      }
    },

    // Data management
    resetProgress() {
      this.userData = {
        completedDays: [],
        weights: {},
        personalBests: {},
        startDate: null,
      };
      this.selectedDay = null;
      this.selectedExercise = null;
      localStorage.removeItem(STORAGE_KEY);
    },

    exportData() {
      const data = {
        version: VERSION,
        exportDate: new Date().toISOString(),
        userData: this.userData,
        userName: this.userName,
      };
      return JSON.stringify(data, null, 2);
    },

    async importData(jsonData) {
      try {
        const data = JSON.parse(jsonData);

        // Validate structure
        if (!data.userData || !data.version) {
          throw new Error("Invalid data format");
        }

        this.userData = data.userData;
        this.userName = data.userName || "Smoldier";
        await this.persistData();
      } catch (err) {
        this.error = "Failed to import data";
        console.error("Import error:", err);
        throw err;
      }
    },

    // Error handling
    clearError() {
      this.error = null;
    },
  },
});
