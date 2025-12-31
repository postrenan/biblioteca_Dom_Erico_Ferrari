<template>
  <div class="row mb-4">
    <div class="col-lg-12">
      <div class="card glass-card border-0">
        <div class="card-body p-3 p-md-4">
          <div class="row align-items-end g-3">
            <div class="col-12 col-md-8">
              <label
                for="action-select"
                class="form-label fw-bold text-secondary text-uppercase small"
                >Ação Desejada</label
              >
              <div class="input-group shadow-sm">
                <span class="input-group-text bg-white"
                  ><i class="bi bi-lightning-charge"></i
                ></span>
                <select
                  id="action-select"
                  class="form-select form-select-lg"
                  :value="modelValue"
                  @change="$emit('update:modelValue', $event.target.value)"
                >
                  <option value="adicionar">Adicionar Novo Livro</option>
                  <option value="atualizar">Atualizar Existente</option>
                  <option value="deletar">Deletar Livro</option>
                  <option value="gerenciar-copias">Gerenciar Cópias</option>
                  <option value="ver-todos">Ver Todo o Acervo</option>
                </select>
              </div>
            </div>
            <div class="col-12 col-md-4 text-start text-md-end">
              <div class="badge bg-primary rounded-pill px-3 py-2">
                Total: {{ totalBooks }} livros
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps({
  modelValue: String,
  totalBooks: {
    type: Number,
    default: 0
  }
});
defineEmits(['update:modelValue']);
</script>
