<template>
  <section>
    <div class="card">
      <p>
        Day
        {{
          selectedProgram < 9
            ? "0" + (selectedProgram + 1)
            : selectedProgram + 1
        }}
      </p>
      <i class="fa-solid fa-dumbbell" v-if="selectedProgram % 3 == 0"></i>
      <i class="fa-solid fa-weight-hanging" v-if="selectedProgram % 3 == 1"></i>
      <i class="fa-solid fa-bolt" v-if="selectedProgram % 3 == 2"></i>
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
            <button type="button" aria-label="Exercise details">
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
            <button type="button" aria-label="Exercise details">
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
    <div class="actions card">
      <button type="button">
        Save & Exit<i class="fa-solid fa-floppy-disk"></i>
      </button>
      <button>Complete<i class="fa-solid fa-check"></i></button>
    </div>
  </section>
</template>

<script setup>
import { workoutProgram } from "@/utils/index";
console.log(workoutProgram);
const selectedProgram = 0;
const { workout, warmup } = workoutProgram[selectedProgram];
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
