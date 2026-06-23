<template>
  <div class="app-window">
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>

<style scoped>
.app-window {
  width: 800px;
  height: 600px;
  margin: auto;
  position: relative;
  overflow: hidden;
  background-color: #ffffff;
  border: 1px solid #ccc;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  display: flex;
  flex-direction: column;
}

/* Ensure the body doesn't scroll if the window is fixed size */
:deep(body) {
  margin: 0;
  padding: 0;
  background-color: #f0f0f0;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
}
</style>
