import { computed } from "vue";
const props = defineProps();
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
// @ts-ignore
[formattedTime, formattedTime,];
const __VLS_export = (await import('vue')).defineComponent({
    __typeProps: {},
});
export default {};
