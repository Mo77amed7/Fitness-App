<template>
  <header>
    <router-link to="/" class="logo">
      <img src="@/assests/Logo.jpg" alt="Logo for SMOLGRAM" />
      <h1>SMOLGRAM</h1></router-link
    >
  </header>
  <nav class="breadcrumbs" v-if="breadcrumbs.length > 1">
    <ol class="breadcrumb-list">
      <li v-for="(crumb, index) in breadcrumbs" :key="index" class="breadcrumb-item">
        <router-link v-if="crumb.path" :to="crumb.path" class="breadcrumb-link">
          {{ crumb.label }}
        </router-link>
        <span v-else class="breadcrumb-current">{{ crumb.label }}</span>
        <span v-if="index < breadcrumbs.length - 1" class="breadcrumb-separator">/</span>
      </li>
    </ol>
  </nav>
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
import { computed } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const breadcrumbs = computed(() => {
  const crumbs = [
    { label: '🏠 Home', path: '/' }
  ]

  if (route.name === 'dashboard') {
    crumbs.push({ label: 'Dashboard', path: null })
  } else if (route.name === 'welcome') {
    crumbs.push({ label: 'Welcome', path: null })
  } else if (route.name === 'workout') {
    crumbs.push({ label: 'Dashboard', path: '/dashboard' })
    const dayNum = route.params.day ? parseInt(route.params.day) + 1 : 1
    crumbs.push({ label: `Workout - Day ${String(dayNum).padStart(2, '0')}`, path: null })
  }

  return crumbs
})
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
.breadcrumbs {
  max-width: 800px;
  margin: 12px auto;
  padding: 0 16px;
}
.breadcrumb-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 6px;
  font-size: 14px;
}
.breadcrumb-item {
  display: flex;
  align-items: center;
  gap: 6px;
}
.breadcrumb-link {
  color: #2563eb;
  text-decoration: none;
  transition: color 0.2s ease;
}
.breadcrumb-link:hover {
  color: #1d4ed8;
  text-decoration: underline;
}
.breadcrumb-current {
  color: #64748b;
  font-weight: 500;
}
.breadcrumb-separator {
  color: #cbd5e1;
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
