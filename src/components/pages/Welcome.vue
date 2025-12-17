<template>
  <section>
    <div class="instructions">
      <h2>
        Complete this program <br />
        if you want...
      </h2>
      <p>
        <i class="fa-solid fa-square-check" style="color: #01b60c"></i>Follow a
        simple program with proven results.
      </p>
      <p>
        <i class="fa-solid fa-square-check" style="color: #01b60c"></i>Get fit,
        healthy, strong and absolutely shredded.
      </p>
      <p>
        <i class="fa-solid fa-square-check" style="color: #01b60c"></i>Learn
        more about gym, training and technique
      </p>
    </div>
  </section>
  <section>
    <div class="plan">
      <h3>The Training Plan</h3>
      <p>
        This training plan follows a structure known as the
        <strong>Bro Split</strong>
      </p>
      <p>Push &rarr; Pull &rarr; Legs &rarr; Repeat</p>
    </div>
  </section>
  <section>
    <div class="challenge card">
      <h3>
        <i class="fa-solid fa-fire" style="color: #f57b35"></i>Your Challenge
      </h3>
      <p>
        complete all the workouts and track your progress along the way!
        <br />Do you accept
      </p>

      <a href="">Begin<i class="fa-solid fa-right-long"></i></a>
    </div>
  </section>
</template>

<style scoped>
section {
  margin: 1rem auto;
  padding: 8px;
}
.instructions,
.plan,
.challenge {
  display: flex;
  flex-direction: column;
  gap: 5px;
}
.plan p:last-child {
  font-weight: bold;
  font-style: italic;
}
.card {
  background-color: rgb(241, 244, 246);
}
.challenge a {
  text-decoration: none;
  background-color: rgb(255, 255, 255);
  display: flex;
  align-items: center;
  justify-content: space-between;
  text-align: center;
  width: 100px;
  border-radius: 4px;
  color: black;
  padding: 3px 10px;
  font-weight: bold;
  box-shadow: 1px 1px 1px rgb(177, 177, 177);
}
.challenge a:hover {
  background-color: black;
  color: rgb(241, 244, 246);
}
</style>
