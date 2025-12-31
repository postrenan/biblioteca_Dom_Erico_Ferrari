<template>
  <div
    class="d-flex flex-wrap justify-content-between align-items-center mb-4 glass-subheader p-3 rounded shadow-sm gap-3"
  >
    <div class="d-flex align-items-center">
      <h3 class="mb-0 fw-bold text-white fs-4 fs-md-3">{{ title }}</h3>
    </div>

    <div class="d-flex gap-2 flex-wrap">
      <slot name="actions"></slot>
    </div>
  </div>
</template>

<script setup>
defineProps({
  title: {
    type: String,
    required: true,
  },
});
</script>

<style scoped>
.glass-subheader {
  background: rgba(15, 23, 42, 0.6);
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}
</style>
