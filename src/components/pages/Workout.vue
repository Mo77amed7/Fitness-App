<template>
  <section>
    <div>
      <h2>Welcome Smoldier</h2>
      <div class="tip">
        <h3>Daily Tip</h3>
        <p>{{ tip }}</p>
      </div>
      <a href="">Start Workout</a>
    </div>
  </section>
  <section>
    <Grid />
  </section>
</template>

<script setup>
import { gymHealthFacts } from "@/utils/index";
import Grid from "@/components/Grid.vue";
const tip = gymHealthFacts[Math.floor(Math.random() * gymHealthFacts.length)];
</script>

<style scoped>
section {
  padding: 1rem;
}
.tip {
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 0.5rem;
  margin: 1rem 0;
}
a {
  display: inline-block;
  background-color: #26539b;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  text-decoration: none;
  font-weight: bold;
}
a:hover {
  background-color: #2563eb;
}
</style>
