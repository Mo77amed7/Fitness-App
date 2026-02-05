<template>
  <section v-if="programData">
    <div class="card">
      <div class="header-top">
        <button type="button" class="back-btn" @click="goBack" aria-label="Go back">
          <i class="fa-solid fa-arrow-left"></i>
        </button>
        <p style="display: inline-block">Day {{ formatDay(selectedProgram) }}</p>
        <i style="float: right" :class="getWorkoutIcon()"></i>
      </div>
      <h1>{{ getWorkoutType() }} Workout</h1>
    </div>
    <div v-if="notification.message" :class="['notification', notification.type]">
      {{ notification.message }}
      <button type="button" @click="notification.message = ''" aria-label="Close notification">
        <i class="fa-solid fa-xmark"></i>
      </button>
    </div>

    <div class="workout-progress-section">
      <div class="progress-info">
        <span class="progress-label">Exercises Completed</span>
        <span class="progress-count">{{ completedCount }}/{{ totalExercises }}</span>
      </div>
      <div class="progress-bar-container">
        <div class="progress-bar">
          <div class="progress-fill" :style="{ width: progressPercentage + '%' }"></div>
        </div>
      </div>
      <div class="progress-percentage">{{ progressPercentage }}%</div>
    </div>

    <table class="warmup">
      <caption class="table-caption">🔥 Warmup</caption>
      <thead>
        <tr>
          <th>Warmup</th>
          <th>Sets</th>
          <th>Reps</th>
          <th>Weights</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(warm, index) in programData.warmup" :key="index" :class="{ completed: isExerciseCompleted(warm.name) }">
          <td class="exercise-cell">
            <input type="checkbox" :checked="isExerciseCompleted(warm.name)" @change="toggleExerciseComplete(warm.name)" />
            <p>{{ warm.name }}</p>
            <button @click="showExercise(warm.name)" type="button" aria-label="Exercise details">
              <i class="fa-regular fa-circle-question"></i>
            </button>
          </td>
          <td>{{ warm.sets }}</td>
          <td>{{ warm.reps }}</td>
          <td class="weight-cell">
            <div class="weight-input-group">
              <input type="number" placeholder="-- kg" :aria-label="`Weight for ${warm.name}`" v-model.number="sessionWeights[warm.name]" min="0" step="0.5" />
              <button v-if="getPreviousWeight(warm.name)" type="button" class="prev-weight-btn" @click="usePreviousWeight(warm.name)" :title="`Previous: ${getPreviousWeight(warm.name)} kg`">
                ↺ {{ getPreviousWeight(warm.name) }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <table class="workout">
      <caption class="table-caption">💪 Main Workout</caption>
      <thead>
        <tr>
          <th>Exercise</th>
          <th>Sets</th>
          <th>Reps</th>
          <th>Weights</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(work, index) in programData.workout" :key="index" :class="{ completed: isExerciseCompleted(work.name) }">
          <td class="exercise-cell">
            <input type="checkbox" :checked="isExerciseCompleted(work.name)" @change="toggleExerciseComplete(work.name)" />
            <div class="exercise-info">
              <p>{{ work.name }}</p>
              <div class="exercise-details">
                <button @click="showExercise(work.name)" type="button" aria-label="Exercise details">
                  <i class="fa-regular fa-circle-question"></i>
                </button>
                <span v-if="getPersonalBest(work.name)" class="pb-badge">PR: {{ getPersonalBest(work.name) }} kg</span>
              </div>
            </div>
          </td>
          <td>{{ work.sets }}</td>
          <td>{{ work.reps }}</td>
          <td class="weight-cell">
            <div class="weight-input-group">
              <input type="number" placeholder="-- kg" :aria-label="`Weight for ${work.name}`" v-model.number="sessionWeights[work.name]" min="0" step="0.5" />
              <div v-if="sessionWeights[work.name]" class="weight-stats">
                <span v-if="calculateOneRepMax(sessionWeights[work.name], work.reps)" class="orm-stat">Est. 1RM: {{ calculateOneRepMax(sessionWeights[work.name], work.reps) }} kg</span>
              </div>
              <button v-if="getPreviousWeight(work.name)" type="button" class="prev-weight-btn" @click="usePreviousWeight(work.name)" :title="`Previous: ${getPreviousWeight(work.name)} kg`">
                ↺ {{ getPreviousWeight(work.name) }}
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
    <portal @close-des="closeDes" v-if="selectedDesName">
      <h1>{{ selectedDesName }}</h1>
      <div>
        <small>Description</small>
        <p>
          {{ selectedDesP }}
        </p>
      </div>
    </portal>
    <div class="actions card">
      <button type="button" @click="handleSave" :disabled="store.loading">
        {{ store.loading ? "Saving..." : "Save Progress"
        }}<i class="fa-solid fa-floppy-disk"></i>
      </button>
      <button type="button" @click="handleComplete">
        Complete<i class="fa-solid fa-check"></i>
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { workoutProgram, exerciseDescriptions } from "@/utils/index";
import { useWorkoutStore } from "@/stores/workoutStore";
import portal from "@/components/ui/Portal.vue";

const store = useWorkoutStore();
const route = useRoute();
const router = useRouter();

// Constants
const WORKOUT_TYPES = ["Push", "Pull", "Legs"];
const ICONS = [
  "fa-solid fa-dumbbell",
  "fa-solid fa-weight-hanging",
  "fa-solid fa-bolt"
];
const STORAGE_KEY_PREFIX = "day";
const NOTIFICATION_DURATION = 3000;

const selectedProgram = Number(route.params.day ?? 0);
const programData = computed(() => workoutProgram[selectedProgram]);

const allExercises = computed(() => {
  if (!programData.value) return [];
  return [...(programData.value.warmup || []), ...(programData.value.workout || [])];
});

const totalExercises = computed(() => allExercises.value.length);

const completedCount = computed(() => completedExercises.value.size);

const progressPercentage = computed(() => {
  if (totalExercises.value === 0) return 0;
  return Math.round((completedCount.value / totalExercises.value) * 100);
});

const personalBests = computed(() => store.userData?.personalBests || {});

const previousSessionWeights = computed(() => {
  if (selectedProgram === 0) return {};
  return store.userData?.weights?.[`${STORAGE_KEY_PREFIX}-${selectedProgram - 1}`] || {};
});

const sessionWeights = ref({});
const selectedDesName = ref(null);
const selectedDesP = ref("");
const notification = ref({ message: "", type: "success" });
const completedExercises = ref(new Set());

onMounted(() => {
  if (store.userData?.weights) {
    const savedWeights = store.userData.weights[`${STORAGE_KEY_PREFIX}-${selectedProgram}`];
    if (savedWeights) {
      sessionWeights.value = { ...savedWeights };
    }
  }
});

// Helper methods
function formatDay(index) {
  return String(Number(index) + 1).padStart(2, "0");
}

function getWorkoutIcon() {
  return ICONS[selectedProgram % 3];
}

function getWorkoutType() {
  return WORKOUT_TYPES[selectedProgram % 3];
}

function showExercise(exercise) {
  selectedDesName.value = exercise;
  selectedDesP.value = exerciseDescriptions[exercise];
}

function closeDes() {
  selectedDesName.value = null;
}

function goBack() {
  router.push("/dashboard");
}

function getPersonalBest(exerciseName) {
  return personalBests.value[exerciseName] || null;
}

function getPreviousWeight(exerciseName) {
  return previousSessionWeights.value[exerciseName] || null;
}

function usePreviousWeight(exerciseName) {
  const prevWeight = getPreviousWeight(exerciseName);
  if (prevWeight) {
    sessionWeights.value[exerciseName] = prevWeight;
    showNotification(`Loaded previous weight: ${prevWeight} kg`, "success");
  }
}

function calculateOneRepMax(weight, reps) {
  if (!weight || !reps || weight <= 0 || reps <= 0) return null;
  // Epley formula: 1RM = weight * (1 + reps/30)
  return Math.round(weight * (1 + reps / 30) * 10) / 10;
}

function toggleExerciseComplete(exerciseName) {
  if (completedExercises.value.has(exerciseName)) {
    completedExercises.value.delete(exerciseName);
  } else {
    completedExercises.value.add(exerciseName);
  }
}

function isExerciseCompleted(exerciseName) {
  return completedExercises.value.has(exerciseName);
}

function showNotification(message, type = "success") {
  notification.value = { message, type };
  setTimeout(() => {
    notification.value.message = "";
  }, NOTIFICATION_DURATION);
}

function validateWeights() {
  return Object.values(sessionWeights.value).every(
    (weight) => weight === undefined || weight === "" || weight >= 0
  );
}

async function handleSave() {
  if (!validateWeights()) {
    showNotification("Please enter valid weight values", "error");
    return;
  }

  try {
    await store.saveDayWeights(selectedProgram, sessionWeights.value);
    showNotification("Progress saved successfully!", "success");
  } catch (error) {
    console.error("Error saving weights:", error);
    showNotification("Error saving progress. Please try again.", "error");
  }
}

async function handleComplete() {
  try {
    await handleSave();
    await store.markDayComplete(selectedProgram);
    showNotification("Workout completed!", "success");
    setTimeout(() => {
      router.push("/dashboard");
    }, 800);
  } catch (error) {
    console.error("Error completing workout:", error);
    showNotification("Error completing workout. Please try again.", "error");
  }
}
</script>

<style scoped>
section {
  padding: 10px;
}

.workout-progress-section {
  background: linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%);
  border-left: 5px solid #3b82f6;
  padding: 1.5rem;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
}

.progress-info {
  display: flex;
  justify-content: space-between;
  margin-bottom: 1rem;
  align-items: center;
}

.progress-label {
  color: #1e40af;
  font-weight: 600;
}

.progress-count {
  font-size: 1.25rem;
  font-weight: bold;
  color: #3b82f6;
}

.progress-bar-container {
  background-color: #e0e7ff;
  border-radius: 9999px;
  overflow: hidden;
  height: 12px;
  margin-bottom: 0.75rem;
}

.progress-bar {
  width: 100%;
  height: 100%;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #3b82f6 0%, #1e40af 100%);
  transition: width 0.4s ease-out;
  border-radius: 9999px;
}

.progress-percentage {
  text-align: center;
  color: #3b82f6;
  font-weight: bold;
  font-size: 0.95rem;
}

.table-caption {
  font-size: 1.1rem;
  font-weight: 600;
  color: #1f2937;
  padding: 0.75rem 0;
  caption-side: top;
}

.header-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

.back-btn {
  background: none;
  border: none;
  color: #3b82f6;
  font-size: 1.5rem;
  cursor: pointer;
  padding: 0;
  margin-right: 10px;
}

.back-btn:hover {
  color: #1e40af;
}

.notification {
  margin: 15px 10px;
  padding: 12px 15px;
  border-radius: 0.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  animation: slideIn 0.3s ease-out;
}

.notification.success {
  background-color: #d1fae5;
  color: #065f46;
  border-left: 4px solid #10b981;
}

.notification.error {
  background-color: #fee2e2;
  color: #7f1d1d;
  border-left: 4px solid #ef4444;
}

.notification button {
  background: none;
  border: none;
  color: inherit;
  cursor: pointer;
  font-size: 1rem;
  padding: 0;
  margin-left: 10px;
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

table {
  width: 100%;
  margin: 20px auto;
  background-color: white;
}

thead {
  background-color: white;
}

table button {
  background-color: transparent;
  box-shadow: none;
  border: none;
  opacity: 0;
  padding: 0px;
}

table tr.completed {
  background-color: #f0fdf4;
}

table tr.completed td {
  opacity: 0.7;
}

table tr:hover td,
tbody tr:nth-child(even):hover td {
  background-color: transparent;
}

table p {
  display: inline-block;
  margin-right: 5px;
  margin: 0;
}

.exercise-cell {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.exercise-cell input[type="checkbox"] {
  width: 18px;
  height: 18px;
  cursor: pointer;
  accent-color: #3b82f6;
}

.exercise-info {
  flex: 1;
}

.exercise-details {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-top: 0.25rem;
}

.pb-badge {
  background-color: #fef3c7;
  color: #92400e;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 600;
}

.weight-cell {
  min-width: 140px;
}

.weight-input-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

table input[type="number"] {
  width: 100%;
  padding: 5px;
  border: 1px solid #d1d5db;
  border-radius: 4px;
  font-size: 0.95rem;
}

table input[type="number"]:focus {
  outline: none;
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
}

.prev-weight-btn {
  background-color: #f3f4f6;
  border: 1px solid #d1d5db !important;
  color: #374151 !important;
  padding: 4px 8px !important;
  border-radius: 0.375rem !important;
  font-size: 0.8rem !important;
  cursor: pointer !important;
  opacity: 1 !important;
  transition: all 0.2s ease;
}

.prev-weight-btn:hover {
  background-color: #e5e7eb;
  border-color: #9ca3af !important;
}

.weight-stats {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-top: 0.25rem;
}

.orm-stat {
  background-color: #dbeafe;
  color: #0369a1;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-weight: 500;
}

.workout tr:hover button,
.warmup tr:hover button {
  opacity: 1;
}

.actions {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  margin-bottom: 15px;
}

.actions button {
  width: 45%;
}

.actions button i {
  margin-left: 5px;
}
</style>
