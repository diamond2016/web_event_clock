import { ref, computed, onMounted } from "vue";
const props = defineProps();
const message = ref('');
// This function runs when the websocket layer emits 'clock_update_hhmmss'
const handleSocketMessage = (payload) => {
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
const __VLS_ctx = {
    ...{},
    ...{},
    ...{},
    ...{},
};
let __VLS_components;
let __VLS_intrinsics;
let __VLS_directives;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "clock-container" },
});
/** @type {__VLS_StyleScopedClasses['clock-container']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.div, __VLS_intrinsics.div)({
    ...{ class: "time-display" },
});
/** @type {__VLS_StyleScopedClasses['time-display']} */ ;
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "hours" },
});
/** @type {__VLS_StyleScopedClasses['hours']} */ ;
(__VLS_ctx.formattedTime.hours);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "minutes" },
});
/** @type {__VLS_StyleScopedClasses['minutes']} */ ;
(__VLS_ctx.formattedTime.minutes);
__VLS_asFunctionalElement1(__VLS_intrinsics.span, __VLS_intrinsics.span)({
    ...{ class: "seconds" },
});
/** @type {__VLS_StyleScopedClasses['seconds']} */ ;
(__VLS_ctx.formattedTime.seconds);
// @ts-ignore
[formattedTime, formattedTime, formattedTime,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
