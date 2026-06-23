<template>
  <div class="home-view">
    <h2>Event clock - NATS -</h2>
    <h3>Dashboard clock and timer</h3>
    <div class="display-container">
      <Clock title="Componente Clock" :time="currentTimeHHMM" />
      <Seconds title="Componente ClockWithSeconds" :time="currentTimeHHMMSS" />
    </div>
    <div class="controls">
      <button @click="handleStartTimer" class="control-button">
        Start Counter
      </button>
      <button @click="handleStopTimer" class="control-button">
        Stop Counter:
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import Clock from "../components/Clock.vue";
import Seconds from "../components/Seconds.vue";
import { EventClockApi } from "../composable/EventClockApi";
import {
  ClockChannel,
  SetRequestPayload,
  SetResponsePayload,
} from "#/api/client/index";
import { ClockEvent } from "@web-event-clock/shared";

// Local reactive state
const currentTimeHHMM = ref<string>("00:00");
const currentTimeHHMMSS = ref<string>("00:00:00");

const eventClock = new EventClockApi();

function handlePayload(payload: ClockEvent): void {
  //console.log(`[VIEW_UPDATE] Received payload:`, payload); //
  currentTimeHHMM.value = payload.time ?? "00:00";
  currentTimeHHMMSS.value = payload.time ?? "00:00:00";
}

onMounted(async () => {
  console.log("HomeView - request subscribe hhmm");
  eventClock.subscribeEvent(ClockChannel.hhmm, handlePayload);
  console.log("HomeView - request subscribe hhmmss");
  eventClock.subscribeEvent(ClockChannel.hhmmss, handlePayload);
});

onUnmounted(() => {
  eventClock.unSubscribeEvent(ClockChannel.hhmm, handlePayload);
  eventClock.unSubscribeEvent(ClockChannel.hhmmss, handlePayload);
});

const handleStartTimer = async () => {
  console.log("HomeView - request start timer");
  const requestPayload: SetRequestPayload = {
    time: "00:00",
    mode: "relative",
  };
  const responsePayload: SetResponsePayload =
    await eventClock.startTimerEvent(requestPayload);
  if (responsePayload && !responsePayload.success) {
    console.log(`error start.timer payload: ${responsePayload.message}`);
  }
};

const handleStopTimer = async () => {
  console.log("HomeView - request stop timer");
  const requestPayload: SetRequestPayload = {
    time: "00:00",
    mode: "relative",
  };
  const responsePayload: SetResponsePayload =
    await eventClock.stopTimerEvent(requestPayload);
  if (responsePayload && !responsePayload.success) {
    console.log(`error stop.timer payload: ${responsePayload.message}`);
  }
};
</script>

<style scoped>
.home-view {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  padding: 2rem 0;
  min-height: 100vh;
  background-color: #1a1a1a;
  color: white;
  font-family: sans-serif;
}

.display-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 2rem;
  margin-bottom: 2rem;
  width: 100%;
  max-width: 1000px;
}

.controls {
  padding: 2rem;
  border: 1px solid #444;
  border-radius: 6px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1rem;
  width: 100%;
  max-width: 520px;
}

.control-button {
  padding: 0.75rem 1.25rem;
  font-size: 1.1rem;
  min-width: 150px;
  flex: 1 1 180px;
  cursor: pointer;
  background-color: #444;
  color: white;
  border: 1px solid #888;
  border-radius: 4px;
  transition: background-color 0.2s ease, transform 0.2s ease;
}

.control-button:hover {
  background-color: #666;
  transform: translateY(-1px);
}

@media (max-width: 720px) {
  .home-view {
    padding: 1.5rem 1rem;
  }

  .display-container {
    gap: 1rem;
  }

  .controls {
    padding: 1.5rem;
    max-width: 100%;
  }

  .control-button {
    min-width: 100%;
    flex: 1 1 100%;
    font-size: 1rem;
  }
}

@media (max-width: 520px) {
  .display-container {
    flex-direction: column;
    align-items: center;
  }

  .home-view h2,
  .home-view h3 {
    text-align: center;
  }

  .controls {
    padding: 1rem;
    border-radius: 8px;
  }
}

.control-button:hover {
  background-color: #666;
}
</style>

