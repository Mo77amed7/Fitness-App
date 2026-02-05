<template>
  <teleport to="body">
    <section>
      <div class="overlay" role="button" @click="close"></div>
      <div class="content">
        <slot></slot>
        <button type="button" aria-label="close-teleport" @click="close">
          Close <i class="fa-solid fa-x"></i>
        </button>
      </div>
    </section>
  </teleport>
</template>

<script setup>
const emit = defineEmits(["close-des"]);

function close() {
  emit("close-des");
}
</script>
<style scoped>
.overlay {
  background-color: #ccc;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1001;
  opacity: 0.4;
}
.content {
  background-color: white;
  width: 50%;
  max-height: 600px;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 1002;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
@media (max-width: 667px) {
  .content {
    width: 80%;
  }
}
button {
  margin-top: 5px;
}
</style>
