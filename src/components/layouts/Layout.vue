<template>
  <header>
    <a
      href="
    "
      class="logo"
    >
      <img src="/public/Logo.jpg" alt="Logo for SMOLGRAM" />
      <h1>SMOLGRAM</h1></a
    >
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
