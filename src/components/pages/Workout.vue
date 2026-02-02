<template>
  <section>
    <div class="card">
      <p style="display: inline-block">
        Day
        {{
          selectedProgram < 9
            ? "0" + (selectedProgram + 1)
            : selectedProgram + 1
        }}
      </p>
      <i
        style="float: right"
        class="fa-solid fa-dumbbell"
        v-if="selectedProgram % 3 == 0"
      ></i>
      <i
        style="float: right"
        class="fa-solid fa-weight-hanging"
        v-if="selectedProgram % 3 == 1"
      ></i>
      <i
        style="float: right"
        class="fa-solid fa-bolt"
        v-if="selectedProgram % 3 == 2"
      ></i>
      <h1>Push Workout</h1>
    </div>
    <table class="warmup">
      <thead>
        <tr>
          <th>Warmup</th>
          <th>Sets</th>
          <th>Reps</th>
          <th>Weights</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(warm, index) in warmup" :key="index">
          <td>
            <p>{{ warm.name }}</p>
            <button
              @click="showExercise(warm.name)"
              type="button"
              aria-label="Exercise details"
            >
              <i class="fa-regular fa-circle-question"></i>
            </button>
          </td>
          <td>{{ warm.sets }}</td>
          <td>{{ warm.reps }}</td>
          <td>
            <input
              type="text"
              placeholder="14kg"
              :aria-label="`Weight for ${warm.name}`"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <table class="workout">
      <thead>
        <tr>
          <th>Workout</th>
          <th>Sets</th>
          <th>Reps</th>
          <th>Weights</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(work, index) in workout" :key="index">
          <td>
            <p>{{ work.name }}</p>
            <button
              @click="showExercise(work.name)"
              type="button"
              aria-label="Exercise details"
            >
              <i class="fa-regular fa-circle-question"></i>
            </button>
          </td>
          <td>{{ work.sets }}</td>
          <td>{{ work.reps }}</td>
          <td>
            <input
              type="text"
              placeholder="14kg"
              :aria-label="`Weight for ${work.name}`"
            />
          </td>
        </tr>
      </tbody>
    </table>
    <port @close-des="closeDes" v-if="selectedDesName">
      <h1>{{ selectedDesName }}</h1>
      <div>
        <small>Description</small>
        <p>
          {{ selectedDesP }}
        </p>
      </div>
    </port>
    <div class="actions card">
      <button type="button">
        Save & Exit<i class="fa-solid fa-floppy-disk"></i>
      </button>
      <button>Complete<i class="fa-solid fa-check"></i></button>
    </div>
  </section>
</template>

<script setup>
import { ref } from "vue";

import { workoutProgram, exerciseDescriptions } from "@/utils/index";
import port from "@/components/Portal.vue";
console.log(workoutProgram);
const selectedProgram = 0;
const { workout, warmup } = workoutProgram[selectedProgram];
const selectedDesName = ref(null);
const selectedDesP = ref("");
function showExercise(exercise) {
  selectedDesName.value = exercise;
  selectedDesP.value = exerciseDescriptions[exercise];
}
function closeDes() {
  selectedDesName.value = null;
}
</script>

<style scoped>
section {
  padding: 10px;
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
table tr:hover td,
tbody tr:nth-child(even):hover td {
  background-color: transparent;
}
table p {
  display: inline-block;
  margin-right: 5px;
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
