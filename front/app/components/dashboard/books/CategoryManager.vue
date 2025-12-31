<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div
      class="modal-dialog modal-content bg-white p-4 rounded shadow-lg"
      style="max-width: 500px"
    >
      <div
        class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2"
      >
        <h5 class="mb-0 fw-bold text-primary">Gerenciar Categorias</h5>
        <button class="btn btn-close" @click="$emit('close')"></button>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold">Nova Categoria</label>
        <div class="input-group">
          <input
            type="text"
            class="form-control"
            v-model="newCategoryName"
            placeholder="Ex: Romance, Terror..."
            @keyup.enter="handleAdd"
          />
          <button class="btn btn-primary" @click="handleAdd">
            <i class="bi bi-plus-lg"></i>
          </button>
        </div>
      </div>

      <div class="table-responsive" style="max-height: 250px">
        <table class="table table-sm">
          <thead class="table-light">
            <tr>
              <th>Nome</th>
              <th class="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="cat in categories" :key="cat.id">
              <td>{{ cat.name }}</td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-outline-danger border-0"
                  @click="$emit('remove', cat.id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!categories.length">
              <td colspan="2" class="text-center text-muted">
                Nenhuma categoria cadastrada.
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div class="mt-4 text-end">
        <button class="btn btn-light" @click="$emit('close')">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const props = defineProps({
  categories: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['close', 'add', 'remove']);
const newCategoryName = ref('');

const handleAdd = () => {
    if(!newCategoryName.value) return;
    emit('add', newCategoryName.value);
    newCategoryName.value = '';
};
</script>
