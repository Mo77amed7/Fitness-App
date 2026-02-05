<template>
  <header>
    <router-link to="/" class="logo">
      <img src="@/assests/Logo.jpg" alt="Logo for SMOLGRAM" />
      <h1>SMOLGRAM</h1></router-link
    >
    <div class="user-actions">
      <div v-if="store.user" class="profile">
        <img :src="store.user.photoURL" alt="User" class="avatar" />
        <button @click="store.logoutUser" class="btn-logout">Logout</button>
      </div>
      <button v-else @click="store.loginUser" class="btn-login">
        Login <i class="fa-brands fa-google"></i>
      </button>
    </div>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <p>Created By</p>
    <a class="git-profile" href="https://github.com/Mo77amed7" target="_blank">
      <img
        src="https://avatars.githubusercontent.com/u/99067002?v=4"
        alt="Profile"
      />
      <p>Mohamed</p>
      <i class="fa-brands fa-github"></i>
    </a>
  </footer>
</template>

<script setup>
import { onMounted } from "vue";
import { useWorkoutStore } from "@/stores/workoutStore";

const store = useWorkoutStore();

onMounted(() => {
  store.initAuth();
});
</script>
<style scoped>
header,
main {
  max-width: 800px;
  margin: auto;
}
.logo {
  display: flex;
  align-items: center;
}
h1 {
  padding: 8px;
  color: #2563eb;
}
.logo img {
  width: 30px;
}
.user-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}
.avatar {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  border: 2px solid #2563eb;
}
.btn-login {
  background-color: #2563eb;
  color: white;
  border: none;
  padding: 5px 15px;
  border-radius: 20px;
  cursor: pointer;
  font-weight: bold;
}
.btn-logout {
  background-color: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
}
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
a {
  text-decoration: none;
}
a.git-profile {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px;
}
a.git-profile:hover {
  border-color: #2563eb;
}
.git-profile img {
  width: 25px;
  border-radius: 50%;
}
.git-profile p {
  margin-top: 3px;
  color: black;
}
</style>
