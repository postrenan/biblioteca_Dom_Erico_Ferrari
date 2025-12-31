<template>
  <div class="mb-3">
    <input
      type="text"
      class="form-control"
      :value="searchText"
      @input="$emit('update:searchText', $event.target.value)"
      placeholder="Buscar por Título, Autor ou ID..."
    />
  </div>
  <table class="table table-hover align-middle">
    <thead class="table-light">
      <tr>
        <th>Título</th>
        <th>Autor</th>
        <th>Categoria</th>
        <th>Copias</th>
        <th>Ações</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="book in books" :key="book.id">
        <td class="d-flex align-items-center">
          <img
            v-if="book.coverUrl"
            :src="fixImageUrl(book.coverUrl)"
            class="me-2 rounded shadow-sm"
            style="width: 30px; height: 40px; object-fit: cover"
            alt="Capa"
          />
          {{ book.title }}
        </td>
        <td>{{ book.author }}</td>
        <td>
          <span class="badge bg-secondary-subtle text-secondary border">
            {{ book.categoryName }}
          </span>
        </td>
        <td>{{ book.availableCopies }} / {{ book.totalCopies }}</td>
        <td>
          <button
            v-if="action === 'atualizar'"
            class="btn btn-sm btn-outline-primary"
            @click="$emit('edit', book)"
          >
            <i class="bi bi-pencil-square me-1"></i> Editar
          </button>
          <button
            v-if="action === 'gerenciar-copias'"
            class="btn btn-sm btn-outline-success"
            @click="$emit('manage-copies', book)"
          >
            <i class="bi bi-layers-fill me-1"></i> Gerenciar
          </button>
          <button
            v-if="action === 'deletar'"
            class="btn btn-sm btn-outline-danger"
            @click="$emit('delete', book)"
          >
            <i class="bi bi-trash me-1"></i> Deletar
          </button>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script setup lang="ts">
import { useApi } from "~/composables/useApi";

defineProps({
  books: {
    type: Array,
    default: () => []
  },
  action: {
      type: String,
      required: true
  },
  searchText: String
});

defineEmits(['update:searchText', 'edit', 'manage-copies', 'delete']);

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  const { baseURL } = useApi();
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};
</script>
