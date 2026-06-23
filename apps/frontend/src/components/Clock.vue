<template>
  <div class="clock-container">
    <div class="time-display">
      <span class="hours">{{ formattedTime.hours }}</span>:
      <span class="minutes">{{ formattedTime.minutes }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";

// Define props from HomeView
interface Props {
  title: string;
  time: string; // Expected format "HH:MM"
}
const props = defineProps<Props>();

// We remove the static 'currentTime' variable and use props.time directly
// inside the computed property to maintain reactivity.

const formattedTime = computed(() => {
  // Split the "HH:mm" string into an array: ["HH", "mm"]
  const [hours, minutes] = props.time.split(":");

  return {
    // Ensure they are padded correctly if the source is ever missing a digit
    hours: hours ? String(hours).padStart(2, "0") : "00",
    minutes: minutes ? String(minutes).padStart(2, "0") : "00",
  };
  console.log(`${formattedTime}`);
});
</script>

<style scoped>
.clock-container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1rem;
  background-color: #1e1e1e;
  border-radius: 8px;
  border: 1px solid #333;
}

.time-display {
  font-family: "Courier New", Courier, monospace;
  font-size: 4rem;
  font-weight: bold;
  color: #00ff00;
  text-shadow: 0 0 10px rgba(0, 255, 0, 0.5);
}

.hours {
  margin-right: 0.2rem;
}
</style>

