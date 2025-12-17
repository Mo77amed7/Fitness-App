<template>
  <layout>
    <Welcome v-if="ablePage == 1"/>
    <Workout v-if="ablePage == 2"/>
  </layout>
</template>
<script setup>
import Layout from "@/components/layouts/Layout.vue";
import Welcome from "@/components/pages/Welcome.vue";
import Workout from "@/components/pages/Workout.vue";
const ablePage = 2;
</script>
<style scoped>
</style>
