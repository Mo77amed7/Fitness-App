<template>
  <div class="grid">
    <button
      v-for="workoutId in workoutKeys"
      :key="workoutId"
      class="card"
      :class="{ completed: isCompletedDay(workoutId), disabled: isLockedDay(workoutId) }"
      @click="goWorkout(workoutId)"
      :disabled="isLockedDay(workoutId)"
      :aria-label="`${getWorkoutType(workoutId)} workout - Day ${formatDay(workoutId)}`"
    >
      <div class="card-header">
        <p>Day {{ formatDay(workoutId) }}</p>
      </div>
      <i :class="getWorkoutIcon(workoutId)"></i>
      <h3>{{ getWorkoutType(workoutId) }}</h3>
    </button>
  </div>
</template>

<script setup>
import { useWorkoutStore } from "@/stores/workoutStore";
import { useRouter } from "vue-router";
import { workoutProgram } from "../../utils/index";
import { computed } from "vue";

const router = useRouter();
const store = useWorkoutStore();

// Constants
const WORKOUT_TYPES = ["Push", "Pull", "Legs"];
const ICONS = [
  "fa-solid fa-dumbbell",
  "fa-solid fa-weight-hanging",
  "fa-solid fa-bolt"
];

// Computed properties
const workoutKeys = computed(() => Object.keys(workoutProgram));

// Helper methods
function formatDay(index) {
  return String(Number(index) + 1).padStart(2, "0");
}

function getWorkoutIcon(workoutId) {
  return ICONS[workoutId % 3];
}

function getWorkoutType(workoutId) {
  return WORKOUT_TYPES[workoutId % 3];
}

function isCompletedDay(workoutId) {
  return store.completedDays?.includes(Number(workoutId));
}

function isLockedDay(workoutId) {
  return workoutId > store.currentDay;
}

function goWorkout(day) {
  if (!isLockedDay(day)) {
    store.selectDay(day);
    router.push("/workout");
  }
}
</script>

<style scoped>
.grid {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;
}
@media (min-width: 640px) {
  .grid {
    grid-template-columns: repeat(4, minmax(0, 1fr));
  }
}
.card {
  border: none;
  border-radius: 0.5rem;
  padding: 1rem;
  width: 100%;
  text-align: left;
  cursor: pointer;
  transition: all 0.3s ease;
}
.card:hover:not(:disabled) {
  background-color: #f3f4f6;
  transform: translateY(-2px);
}
.card:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.card.completed {
  background-color: #d1fae5;
  border-left: 4px solid #10b981;
}
.card p {
  font-size: 0.875rem;
  color: #6b7280;
  margin: 0;
}
.card h3 {
  margin: 0.5rem 0 0 0;
  font-size: 1.25rem;
}
.card i {
  color: #3b82f6;
  margin-right: 0.5rem;
}
</style>
