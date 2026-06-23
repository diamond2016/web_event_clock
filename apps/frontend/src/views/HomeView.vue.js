import { ref, onMounted, onUnmounted } from "vue";
import Clock from "../components/Clock.vue";
import Seconds from "../components/Seconds.vue";
import { EventClockApi } from "../composable/EventClockApi";
import { ClockChannel, } from "#/api/client/index";
// Local reactive state
const currentTimeHHMM = ref("00:00");
const currentTimeHHMMSS = ref("00:00:00");
const eventClock = new EventClockApi();
function handlePayload(payload) {
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
    const requestPayload = {
        time: "00:00",
        mode: "relative",
    };
    const responsePayload = await eventClock.startTimerEvent(requestPayload);
    if (responsePayload && !responsePayload.success) {
        console.log(`error start.timer payload: ${responsePayload.message}`);
    }
};
const handleStopTimer = async () => {
    console.log("HomeView - request stop timer");
    const requestPayload = {
        time: "00:00",
        mode: "relative",
    };
    const responsePayload = await eventClock.stopTimerEvent(requestPayload);
    if (responsePayload && !responsePayload.success) {
        console.log(`error stop.timer payload: ${responsePayload.message}`);
    }
};
const __VLS_ctx = {
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
/** @type {__VLS_StyleScopedClasses['control-button']} */ ;
/** @type {__VLS_StyleScopedClasses['home-view']} */ ;
/** @type {__VLS_StyleScopedClasses['display-container']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control-button']} */ ;
/** @type {__VLS_StyleScopedClasses['display-container']} */ ;
/** @type {__VLS_StyleScopedClasses['home-view']} */ ;
/** @type {__VLS_StyleScopedClasses['home-view']} */ ;
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
/** @type {__VLS_StyleScopedClasses['control-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "home-view" },
});
/** @type {__VLS_StyleScopedClasses['home-view']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.h2, __VLS_intrinsics.h2)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.h3, __VLS_intrinsics.h3)({});
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "display-container" },
});
/** @type {__VLS_StyleScopedClasses['display-container']} */ ;
const __VLS_0 = Clock;
// @ts-ignore
const __VLS_1 = __VLS_asFunctionalComponent1(__VLS_0, new __VLS_0({
    title: "Componente Clock",
    time: (__VLS_ctx.currentTimeHHMM),
}));
const __VLS_2 = __VLS_1({
    title: "Componente Clock",
    time: (__VLS_ctx.currentTimeHHMM),
}, ...__VLS_functionalComponentArgsRest(__VLS_1));
const __VLS_5 = Seconds;
// @ts-ignore
const __VLS_6 = __VLS_asFunctionalComponent1(__VLS_5, new __VLS_5({
    title: "Componente ClockWithSeconds",
    time: (__VLS_ctx.currentTimeHHMMSS),
}));
const __VLS_7 = __VLS_6({
    title: "Componente ClockWithSeconds",
    time: (__VLS_ctx.currentTimeHHMMSS),
}, ...__VLS_functionalComponentArgsRest(__VLS_6));
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "controls" },
});
/** @type {__VLS_StyleScopedClasses['controls']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.handleStartTimer) },
    ...{ class: "control-button" },
});
/** @type {__VLS_StyleScopedClasses['control-button']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.button, __VLS_intrinsics.button)({
    ...{ onClick: (__VLS_ctx.handleStopTimer) },
    ...{ class: "control-button" },
});
/** @type {__VLS_StyleScopedClasses['control-button']} */ ;
// @ts-ignore
[currentTimeHHMM, currentTimeHHMMSS, handleStartTimer, handleStopTimer,];
const __VLS_export = (await import('vue')).defineComponent({});
export default {};
