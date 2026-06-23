<template>
  <div class="clock-container">
    <div class="time-display">
      <span class="hours">{{ formattedTime.hours }}</span
      >: <span class="minutes">{{ formattedTime.minutes }}</span
      >:
      <span class="seconds">{{ formattedTime.seconds }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from "vue";

// Define props from HomeView
interface Props {
  title: string;
  time: string;
}

const props = defineProps<Props>();

const message = ref<any>('');
// This function runs when the websocket layer emits 'clock_update_hhmmss'
const handleSocketMessage = (payload: any) => {
  message.value = payload;
};

const formattedTime = computed(() => {
  // Split the "HH:MM:SS" string into an array: ["HH", "MM", "SS"]
  const [hours, minutes, seconds] = props.time.split(":");

  return {
    // Ensure they are padded correctly if the source is ever missing a digit
    hours: hours ? String(hours).padStart(2, "0") : "00",
    minutes: minutes ? String(minutes).padStart(2, "0") : "00",
    seconds: seconds ? String(seconds).padStart(2, "0") : "00"
  };
  console.log(`${formattedTime}`);
});

onMounted(() => {
  //setInterval(updateTime, 1000);
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

.hours,
.minutes,
.seconds {
  margin-right: 0.2rem;
}
</style>

