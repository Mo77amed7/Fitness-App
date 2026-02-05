<template>
  <section>
    <div>
      <div class="header-controls">
        <div>
          <h2>{{ greeting }}, {{ userName }}</h2>
          <p v-if="motivationalMessage" class="motivational">
            {{ motivationalMessage }}
          </p>
        </div>
        <button
          type="button"
          class="settings-btn"
          @click="showSettings = !showSettings"
          aria-label="Open settings"
        >
          <i class="fa-solid fa-gear"></i>
        </button>
      </div>

      <div v-if="showSettings" class="settings-menu">
        <button type="button" class="settings-item" @click="exportProgress">
          <i class="fa-solid fa-download"></i>
          <span>Export Progress</span>
        </button>
        <label class="settings-item">
          <i class="fa-solid fa-upload"></i>
          <span>Import Progress</span>
          <input
            type="file"
            @change="importProgress"
            accept=".json"
            style="display: none"
          />
        </label>
        <button
          type="button"
          class="settings-item danger"
          @click="resetProgress"
        >
          <i class="fa-solid fa-trash"></i>
          <span>Reset All Data</span>
        </button>
        <button
          type="button"
          class="settings-item"
          @click="showSettings = false"
        >
          <i class="fa-solid fa-xmark"></i>
          <span>Close</span>
        </button>
      </div>

      <div v-if="isLoading" class="loading-indicator">
        <i class="fa-solid fa-spinner"></i> Loading your progress...
      </div>

      <div v-if="!isLoading && totalCompleted > 0" class="progress-section">
        <div class="progress-info">
          <div class="progress-left">
            <h4>Overall Progress</h4>
            <p class="progress-text">{{ totalCompleted }}/84 days completed</p>
            <p
              class="progress-time"
              v-if="estimatedCompletion !== 'Program Complete!'"
            >
              Est. completion: {{ estimatedCompletion }}
            </p>
            <p v-else class="completion-message">
              🎉 You completed the program!
            </p>
          </div>
          <div class="progress-percentage">{{ completionPercentage }}%</div>
        </div>
        <div class="progress-bar-container">
          <div class="progress-bar">
            <div
              class="progress-fill"
              :style="{ width: completionPercentage + '%' }"
            ></div>
          </div>
        </div>
      </div>

      <div
        v-if="!isLoading && achievements.length > 0"
        class="achievements-section"
      >
        <h4>Achievements</h4>
        <div class="achievements">
          <div
            v-for="(achievement, index) in achievements"
            :key="index"
            class="achievement-badge"
          >
            <span class="badge-icon">{{ achievement.icon }}</span>
            <span class="badge-label">{{ achievement.label }}</span>
          </div>
        </div>
      </div>

      <div v-if="!isLoading && hasPersonalBests" class="personal-bests-section">
        <h4>Personal Records</h4>
        <div class="personal-bests-grid">
          <div
            v-for="(weight, exercise) in personalBests"
            :key="exercise"
            class="pb-item"
          >
            <p class="pb-exercise">{{ exercise }}</p>
            <p class="pb-weight">{{ weight }} kg</p>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <div class="stat-card">
          <p class="stat-value">{{ currentStreak }}</p>
          <p class="stat-label">Current Streak</p>
        </div>
        <div class="stat-card">
          <p class="stat-value">{{ weekProgress }}</p>
          <p class="stat-label">This Week</p>
        </div>
        <div class="stat-card">
          <p class="stat-value">{{ lastWorkoutDate }}</p>
          <p class="stat-label">Last Workout</p>
        </div>
        <div class="stat-card">
          <p class="stat-value">{{ nextWorkoutDay }}</p>
          <p class="stat-label">Next Day</p>
        </div>
      </div>

      <div class="tip">
        <div class="tip-header">
          <h3>Daily Tip</h3>
          <button
            type="button"
            class="refresh-btn"
            @click="refreshTip"
            :disabled="isRefreshing"
            aria-label="Get new tip"
          >
            <i
              :class="{
                'fa-solid fa-rotate-right': true,
                rotating: isRefreshing,
              }"
            ></i>
          </button>
        </div>
        <p>{{ tip }}</p>
      </div>

      <button
        type="button"
        class="start-workout-btn"
        :disabled="isCurrentDayCompleted"
        :class="{ completed: isCurrentDayCompleted }"
        @click="startWorkout"
      >
        <i
          :class="
            isCurrentDayCompleted ? 'fa-solid fa-check' : 'fa-solid fa-dumbbell'
          "
        ></i>
        {{
          isCurrentDayCompleted ? "Today's Workout Complete!" : "Start Workout"
        }}
      </button>
    </div>
  </section>
  <section>
    <Grid />
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { gymHealthFacts } from "@/utils/index";
import { useWorkoutStore } from "@/stores/workoutStore";
import Grid from "@/components/ui/Grid.vue";

const router = useRouter();
const store = useWorkoutStore();

// Constants
const TIP_CACHE_KEY = "dailyTip";
const TIME_BASED_EMOJIS = {
  morning: "🌅",
  afternoon: "☀️",
  evening: "🌙",
};

// Refs
const tip = ref("");
const isRefreshing = ref(false);
const userName = ref("Smoldier");
const isLoading = ref(true);
const showSettings = ref(false);

// Computed properties
const greeting = computed(() => {
  const hour = new Date().getHours();
  if (hour < 12) return "Good Morning";
  if (hour < 18) return "Good Afternoon";
  return "Good Evening";
});

const totalCompleted = computed(() => {
  return store.userData?.completedDays?.length || 0;
});

const currentStreak = computed(() => {
  const completed = store.userData?.completedDays || [];
  if (completed.length === 0) return 0;

  let streak = 0;
  let currentDay = store.currentDay || 0;

  for (let i = currentDay; i >= 0; i--) {
    if (completed.includes(i)) {
      streak++;
    } else {
      break;
    }
  }
  return streak;
});

const weekProgress = computed(() => {
  const completed = store.userData?.completedDays || [];
  const currentDay = store.currentDay || 0;
  const weekStart = Math.floor(currentDay / 7) * 7;
  const weekDays = [
    weekStart,
    weekStart + 1,
    weekStart + 2,
    weekStart + 3,
    weekStart + 4,
    weekStart + 5,
    weekStart + 6,
  ];
  const completedThisWeek = weekDays.filter((day) =>
    completed.includes(day),
  ).length;
  return `${completedThisWeek}/7`;
});

const nextWorkoutDay = computed(() => {
  const currentDay = store.currentDay ?? 0;
  return `Day ${String(currentDay + 2).padStart(2, "0")}`;
});

const isCurrentDayCompleted = computed(() => {
  const currentDay = store.currentDay || 0;
  return store.userData?.completedDays?.includes(currentDay);
});

const motivationalMessage = computed(() => {
  const streak = currentStreak.value;
  if (streak > 20) return "🔥 Absolutely Legendary! Keep Rocking!";
  if (streak > 15) return "🔥 Amazing streak! You're unstoppable!";
  if (streak > 10) return "💪 Outstanding consistency! Keep going!";
  if (streak > 5) return "🎯 Great start! Build that streak!";
  if (streak > 0) return "✨ Every rep counts! Stay consistent!";
  return "🎯 Time to build your streak!";
});

const completionPercentage = computed(() => {
  const total = 84; // 12 weeks
  return Math.round((totalCompleted.value / total) * 100);
});

const lastWorkoutDate = computed(() => {
  if (
    !store.userData?.completedDays ||
    store.userData.completedDays.length === 0
  ) {
    return "No workouts yet";
  }
  const lastDay = Math.max(...store.userData.completedDays);
  const dayIndex = store.userData.completedDays.indexOf(lastDay);
  return dayIndex >= 0
    ? `Day ${String(lastDay + 1).padStart(2, "0")}`
    : "No workouts yet";
});

const estimatedCompletion = computed(() => {
  const remaining = 84 - totalCompleted.value;
  if (remaining <= 0) return "Program Complete!";
  const daysPerWeek = 3;
  const weeksNeeded = Math.ceil(remaining / daysPerWeek);
  const completionDate = new Date();
  completionDate.setDate(completionDate.getDate() + weeksNeeded * 7);
  return completionDate.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
});

const achievements = computed(() => {
  const badges = [];
  if (currentStreak.value >= 7)
    badges.push({ label: "Week 1", icon: "🔥", streak: 7 });
  if (currentStreak.value >= 14)
    badges.push({ label: "2 Weeks", icon: "💪", streak: 14 });
  if (currentStreak.value >= 30)
    badges.push({ label: "1 Month", icon: "⭐", streak: 30 });
  if (totalCompleted.value >= 30)
    badges.push({ label: "1 Month Total", icon: "🏆", days: 30 });
  if (totalCompleted.value >= 60)
    badges.push({ label: "2 Months Total", icon: "👑", days: 60 });
  return badges;
});

const personalBests = computed(() => {
  return store.userData?.personalBests || {};
});

const hasPersonalBests = computed(() => {
  return Object.keys(personalBests.value).length > 0;
});

// Methods
function getTipFromCache() {
  const cachedTip = sessionStorage.getItem(TIP_CACHE_KEY);
  return cachedTip || getRandomTip();
}

function getRandomTip() {
  return gymHealthFacts[Math.floor(Math.random() * gymHealthFacts.length)];
}

function refreshTip() {
  isRefreshing.value = true;
  setTimeout(() => {
    tip.value = getRandomTip();
    sessionStorage.setItem(TIP_CACHE_KEY, tip.value);
    isRefreshing.value = false;
  }, 300);
}

function startWorkout() {
  if (!isCurrentDayCompleted.value) {
    router.push("/workout");
  }
}

function exportProgress() {
  try {
    const data = store.exportData();
    const blob = new Blob([data], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `fitness-progress-${new Date().toISOString().split("T")[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error("Export failed:", err);
    alert("Failed to export progress");
  }
}

function resetProgress() {
  if (
    window.confirm(
      "Are you sure you want to reset all progress? This cannot be undone.",
    )
  ) {
    store.resetProgress();
    window.location.reload();
  }
}

function importProgress(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = async (e) => {
    try {
      const jsonData = e.target?.result;
      if (typeof jsonData !== "string") throw new Error("Invalid file");

      await store.importData(jsonData);
      alert("Progress imported successfully!");
      window.location.reload();
    } catch (err) {
      console.error("Import failed:", err);
      alert("Failed to import progress. Please check the file format.");
    }
  };
  reader.readAsText(file);
}

onMounted(async () => {
  // Load persisted data from localStorage
  await store.loadData();

  tip.value = getTipFromCache();
  if (store.userName) {
    userName.value = store.userName;
  }

  isLoading.value = false;
});
</script>

<style scoped>
section {
  padding: 1rem;
}

.header-controls {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.settings-btn {
  background-color: #e5e7eb;
  border: none;
  border-radius: 0.5rem;
  padding: 0.75rem;
  cursor: pointer;
  font-size: 1.25rem;
  color: #1f2937;
  transition: all 0.3s ease;
}

.settings-btn:hover {
  background-color: #d1d5db;
  transform: scale(1.05);
}

.settings-menu {
  background-color: white;
  border: 1px solid #e5e7eb;
  border-radius: 0.5rem;
  padding: 0.5rem;
  margin-bottom: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  animation: slideDown 0.3s ease-out;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.settings-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  border: none;
  background: none;
  cursor: pointer;
  color: #374151;
  font-size: 0.95rem;
  border-radius: 0.375rem;
  transition: all 0.2s ease;
  text-align: left;
}

.settings-item:hover {
  background-color: #f3f4f6;
  color: #1f2937;
}

.settings-item.danger {
  color: #dc2626;
}

.settings-item.danger:hover {
  background-color: #fee2e2;
}

.loading-indicator {
  background-color: #dbeafe;
  color: #0369a1;
  padding: 1rem;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  animation: pulse 1.5s ease-in-out infinite;
}

.loading-indicator i {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

h2 {
  font-size: 1.75rem;
  margin-bottom: 0.5rem;
  color: #1f2937;
}

.motivational {
  font-size: 0.95rem;
  color: #6b7280;
  margin-bottom: 1.5rem;
  font-style: italic;
}

.progress-section {
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border-left: 5px solid #3b82f6;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.progress-left {
  flex: 1;
}

.progress-left h4 {
  margin: 0 0 0.5rem 0;
  color: #1e40af;
  font-size: 1rem;
}

.progress-text {
  margin: 0 0 0.5rem 0;
  color: #1f2937;
  font-weight: 600;
}

.progress-time,
.completion-message {
  margin: 0;
  color: #6b7280;
  font-size: 0.9rem;
}

.completion-message {
  color: #059669;
  font-weight: 600;
}

.progress-percentage {
  font-size: 2.5rem;
  font-weight: bold;
  color: #3b82f6;
  text-align: center;
  min-width: 80px;
}

.progress-bar-container {
  background-color: #e0e7ff;
  border-radius: 9999px;
  overflow: hidden;
  height: 12px;
}

.progress-bar {
  width: 100%;
  height: 100%;
  position: relative;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
  transition: width 0.6s ease-out;
  border-radius: 9999px;
}

.achievements-section,
.personal-bests-section {
  background-color: #fef3c7;
  border-left: 5px solid #f59e0b;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.achievements-section h4,
.personal-bests-section h4 {
  margin: 0 0 1rem 0;
  color: #92400e;
  font-size: 1rem;
}

.achievements {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.achievement-badge {
  background: white;
  border: 2px solid #f59e0b;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #92400e;
  box-shadow: 0 2px 4px rgba(245, 158, 11, 0.2);
}

.badge-icon {
  font-size: 1.25rem;
}

.badge-label {
  font-size: 0.9rem;
}

.personal-bests-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 1rem;
}

.pb-item {
  background: white;
  padding: 1rem;
  border-radius: 0.5rem;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.pb-exercise {
  margin: 0 0 0.5rem 0;
  color: #6b7280;
  font-size: 0.9rem;
  font-weight: 500;
}

.pb-weight {
  margin: 0;
  color: #059669;
  font-size: 1.5rem;
  font-weight: bold;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  margin-bottom: 1.5rem;
}

@media (min-width: 768px) {
  .stats-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

.stat-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 1rem;
  border-radius: 0.75rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 12px rgba(0, 0, 0, 0.15);
}

.stat-value {
  font-size: 1.75rem;
  font-weight: bold;
  margin: 0 0 0.25rem 0;
}

.stat-label {
  font-size: 0.875rem;
  margin: 0;
  opacity: 0.9;
}

.tip {
  background-color: #f0f9ff;
  border-left: 4px solid #3b82f6;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1.5rem 0;
}

.tip-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.75rem;
}

.tip h3 {
  margin: 0;
  color: #1e40af;
}

.tip p {
  margin: 0;
  color: #1f2937;
  line-height: 1.6;
}

.refresh-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.5rem;
  border-radius: 0.375rem;
  transition: all 0.3s ease;
}

.refresh-btn:hover:not(:disabled) {
  background-color: #dbeafe;
  transform: scale(1.1);
}

.refresh-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.refresh-btn i.rotating {
  animation: spin 0.6s linear;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

.start-workout-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background-color: #26539b;
  color: white;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 1rem;
}

.start-workout-btn:hover:not(:disabled) {
  background-color: #2563eb;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
}

.start-workout-btn:disabled {
  background-color: #10b981;
  cursor: default;
}

.start-workout-btn.completed {
  background-color: #10b981;
}

.start-workout-btn.completed:hover {
  background-color: #059669;
  transform: none;
}

.start-workout-btn i {
  font-size: 1.1rem;
}
</style>
