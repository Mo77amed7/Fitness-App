<template>
  <layout>
    <Welcome v-if="ablePage == 1" />
    <Dashboard v-if="ablePage == 2" />
    <Workout v-if="ablePage == 3" />
  </layout>
</template>
<script setup>
import Layout from "@/components/layouts/Layout.vue";
import Welcome from "@/components/pages/Welcome.vue";
import Workout from "@/components/pages/Workout.vue";
import Dashboard from "./components/pages/Dashboard.vue";
const ablePage = 3;
</script>
<style scoped></style>
