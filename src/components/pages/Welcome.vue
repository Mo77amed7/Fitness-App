<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const benefits = [
  "Follow a simple program with proven results.",
  "Get fit, healthy, strong and absolutely shredded.",
  "Learn more about gym, training and technique",
];

const trainingSplit = ["Push", "Pull", "Legs"];
const totalDays = 84; // 12 weeks
const daysPerWeek = 3;
const challengeLength = 12;

function startProgram() {
  router.push("/dashboard");
}
</script>
<template>
  <section class="welcome-section intro-section">
    <div class="instructions">
      <h2>Complete this program <br />if you want...</h2>
      <div class="benefits">
        <div
          v-for="(benefit, index) in benefits"
          :key="index"
          class="benefit-item"
        >
          <div class="benefit-icon-wrapper">
            <i class="fa-solid fa-square-check" aria-hidden="true"></i>
          </div>
          <p>{{ benefit }}</p>
        </div>
      </div>
    </div>
  </section>

  <section class="welcome-section plan-section">
    <div class="plan card">
      <h3>
        <i class="fa-solid fa-dumbbell" aria-hidden="true"></i>
        The Training Plan
      </h3>
      <p>
        This training plan follows a structure known as the
        <strong>Bro Split</strong>
      </p>
      <div class="split-cycle">
        <span
          v-for="(day, index) in trainingSplit"
          :key="index"
          class="split-day"
        >
          {{ day }}
          <i
            v-if="index < trainingSplit.length - 1"
            class="fa-solid fa-arrow-right"
            aria-hidden="true"
          ></i>
        </span>
      </div>
      <p class="cycle-note">
        {{ totalDays }} days, {{ daysPerWeek }} days per week
      </p>
    </div>
  </section>

  <section class="welcome-section challenge-section">
    <div class="challenge card">
      <div class="challenge-header">
        <h3>
          <i class="fa-solid fa-fire" aria-hidden="true"></i>
          Your Challenge
        </h3>
        <span class="challenge-badge">{{ challengeLength }} Week Program</span>
      </div>
      <p>Complete all the workouts and track your progress along the way!</p>
      <p class="challenge-question">Do you accept?</p>

      <button
        type="button"
        class="begin-btn"
        @click="startProgram"
        aria-label="Begin the fitness program on the dashboard"
      >
        Begin
        <i class="fa-solid fa-arrow-right" aria-hidden="true"></i>
      </button>
    </div>
  </section>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
}

section.welcome-section {
  margin: 2rem auto;
  padding: 1.5rem 1rem;
  animation: fadeInUp 0.6s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateX(-10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

.intro-section {
  animation-delay: 0s;
}

.plan-section {
  animation-delay: 0.1s;
}

.challenge-section {
  animation-delay: 0.2s;
}

/* Instructions Section */
.instructions h2 {
  font-size: 1.75rem;
  margin-bottom: 1.5rem;
  line-height: 1.4;
  color: #1f2937;
}

.benefits {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.benefit-item {
  display: flex;
  gap: 1rem;
  align-items: flex-start;
  animation: slideIn 0.6s ease-out;
  padding: 0.75rem;
  border-radius: 0.5rem;
  transition: all 0.3s ease;
}

.benefit-item:hover {
  background-color: #f3f4f6;
  transform: translateX(5px);
}

.benefit-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 0.375rem;
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.benefit-item i.fa-square-check {
  color: white;
  font-size: 1.25rem;
}

.benefit-item p {
  color: #374151;
  font-size: 1rem;
  line-height: 1.5;
  margin: 0;
}

/* Plan Section */
.plan {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
}

.plan.card {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.plan h3 {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
}

.plan h3 i {
  font-size: 1.75rem;
}

.plan p {
  margin: 0;
  font-size: 1rem;
  opacity: 0.95;
}

.split-cycle {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 1rem 0;
  flex-wrap: wrap;
}

.split-day {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: bold;
  font-size: 1.1rem;
  padding: 0.5rem 1rem;
  background-color: rgba(255, 255, 255, 0.2);
  border-radius: 0.375rem;
}

.split-day i {
  font-size: 0.9rem;
}

.cycle-note {
  font-size: 0.9rem !important;
  opacity: 0.85 !important;
  font-style: italic;
}

/* Challenge Section */
.challenge {
  background-color: #fff7ed;
  border-left: 5px solid #f57b35;
  padding: 2rem;
  border-radius: 0.75rem;
  box-shadow: 0 4px 15px rgba(245, 123, 53, 0.15);
}

.challenge.card {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.challenge-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.challenge h3 {
  font-size: 1.5rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin: 0;
  color: #1f2937;
}

.challenge h3 i {
  font-size: 1.75rem;
  color: #f57b35;
}

.challenge-badge {
  background-color: #f57b35;
  color: white;
  padding: 0.375rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: bold;
  white-space: nowrap;
}

.challenge p {
  margin: 0;
  color: #374151;
  font-size: 1rem;
  line-height: 1.6;
}

.challenge-question {
  font-weight: 600;
  font-size: 1.1rem !important;
}

.begin-btn {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  background-color: #f57b35;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 0.5rem;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(245, 123, 53, 0.3);
}

.begin-btn:hover {
  background-color: #e67e22;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(245, 123, 53, 0.4);
}

.begin-btn:active {
  transform: translateY(0);
}

.begin-btn i {
  font-size: 1.1rem;
  transition: transform 0.3s ease;
}

.begin-btn:hover i {
  transform: translateX(4px);
}

/* Responsive Design */
@media (max-width: 640px) {
  section.welcome-section {
    margin: 1.5rem auto;
    padding: 1rem;
  }

  .instructions h2 {
    font-size: 1.5rem;
  }

  .benefit-item {
    padding: 0.5rem;
  }

  .plan,
  .challenge {
    padding: 1.5rem;
  }

  .challenge-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .challenge-badge {
    align-self: flex-start;
  }
}
</style>
