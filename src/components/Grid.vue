<template>
  <div class="grid">
      <button
        v-for="(workout, workoutId) in Object.keys(workoutProgram)"
        :key="workoutId"
        class="card"
      >
        <p>Day {{ workoutId < 9 ? "0" + (workoutId + 1) : workoutId + 1 }}</p>
        <i class="fa-solid fa-dumbbell" v-if="workoutId % 3 == 0"></i>
        <i class="fa-solid fa-weight-hanging" v-if="workoutId % 3 == 1"></i>
        <i class="fa-solid fa-bolt" v-if="workoutId % 3 == 2"></i>
        <h3>{{ workoutTypes[workoutId % 3] }}</h3>
      </button>

  </div>
</template>

<script setup>
import { workoutProgram } from "../utils/index";
console.log(workoutProgram);
const workoutTypes = ["Push", "Pull", "Legs"];
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
}
.card:hover {
  background-color: #f3f4f6;
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
