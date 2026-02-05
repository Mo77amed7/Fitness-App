<template>
  <section v-if="programData">
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
      <h1>{{ workoutTypes[selectedProgram % 3] }} Workout</h1>
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
        <tr v-for="(warm, index) in programData.warmup" :key="index">
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
              placeholder="-- kg"
              :aria-label="`Weight for ${warm.name}`"
              v-model="sessionWeights[warm.name]"
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
        <tr v-for="(work, index) in programData.workout" :key="index">
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
              placeholder="-- kg"
              :aria-label="`Weight for ${work.name}`"
              v-model="sessionWeights[work.name]"
            />
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

console.log(workoutProgram);
const selectedProgram = Number(route.params.day ?? 0);
const workoutTypes = ["Push", "Pull", "Legs"];

const programData = computed(() => workoutProgram[selectedProgram]);

const sessionWeights = ref({});

const selectedDesName = ref(null);
const selectedDesP = ref("");

onMounted(() => {
  if (store.userData?.weights) {
    const savedWeights = store.userData.weights[`day-${selectedProgram}`];
    if (savedWeights) {
      sessionWeights.value = { ...savedWeights };
    }
  }
});

function showExercise(exercise) {
  selectedDesName.value = exercise;
  selectedDesP.value = exerciseDescriptions[exercise];
}

function closeDes() {
  selectedDesName.value = null;
}

async function handleSave() {
  await store.saveDayWeights(selectedProgram, sessionWeights.value);
  alert("progress saved successfully!");
}

async function handleComplete() {
  await handleSave();
  await store.markDayComplete(selectedProgram);
  router.push("/dashboard");
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
