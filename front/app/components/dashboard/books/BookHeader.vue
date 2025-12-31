<template>
  <AppSubHeader title="Gerenciar Acervo">
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
          class="btn btn-glass-light shadow-sm m-0"
          title="Importar CSV"
        >
          <i class="bi bi-upload"></i>
          <input
            type="file"
            class="d-none"
            accept=".csv"
            @change="$emit('import', $event)"
          />
        </label>
        <button
          class="btn btn-glass-light shadow-sm"
          @click="$emit('help')"
          title="Ajuda CSV"
        >
          <i class="bi bi-question-circle"></i>
        </button>

        <button
          class="btn btn-glass-light shadow-sm"
          @click="$emit('settings')"
          title="Configurações"
        >
          <i class="bi bi-gear"></i>
        </button>
      </div>
    </template>
  </AppSubHeader>
</template>

<script setup lang="ts">
// No props needed for this static header logic
const emit = defineEmits(['export', 'import', 'help', 'settings']);
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
