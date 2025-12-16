<template>
  <header>
    <h1>SMOLGRAM</h1>
  </header>
  <main>
    <slot></slot>
  </main>
  <footer>
    <p>Created By</p>
    <a href="https://github.com/Mo77amed7" target="_blank">
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
footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
a {
  text-decoration: none;
}
a {
  display: flex;
  align-items: center;
  gap: 5px;
  border: 1px solid transparent;
  border-radius: 6px;
  padding: 2px;
}
a:hover {
  border-color: #2563eb;
}
img {
  width: 25px;
  border-radius: 50%;
}
</style>
