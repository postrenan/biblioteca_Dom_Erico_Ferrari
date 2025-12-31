<template>
  <AppSubHeader title="Gerenciar Usuários">
    <template #actions>
      <div class="d-flex gap-2">
        <button
          class="btn btn-glass-light shadow-sm"
          @click="$emit('export')"
          title="Exportar CSV"
        >
          <i class="bi bi-download"></i>
        </button>
        <label
          class="btn btn-glass-light shadow-sm mb-0 cursor-pointer"
          title="Importar CSV"
        >
          <i class="bi bi-upload"></i>
          <input
            type="file"
            hidden
            accept=".csv"
            @change="$emit('import', $event)"
          />
        </label>
        <button
          class="btn btn-glass-info shadow-sm"
          @click="$emit('help')"
          title="Ajuda"
        >
          <i class="bi bi-question-circle"></i>
        </button>
      </div>
    </template>
  </AppSubHeader>
</template>

<script setup lang="ts">
// Assuming AppSubHeader is globally available or we need to import it?
// Usually AppSubHeader is a global component in Nuxt if in components root.
// If not, we might need to import it. Typically standard components are auto-imported.
defineEmits(['export', 'import', 'help']);
</script>

<style scoped>
.btn-glass-light {
    background: rgba(255, 255, 255, 0.2);
    border: 1px solid rgba(255, 255, 255, 0.3);
    color: white;
}
.btn-glass-light:hover {
    background: rgba(255, 255, 255, 0.4);
    color: white;
}
.btn-glass-info {
    background: rgba(223, 230, 231, 0.3);
    border: 1px solid rgba(227, 229, 230, 0.4);
    color: white;
}
.btn-glass-info:hover {
    background: #0dcaf0;
    color: white;
}
</style>
