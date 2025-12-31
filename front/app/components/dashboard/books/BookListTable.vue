<template>
  <div class="card glass-card border-0 mb-4">
    <div
      class="card-header bg-white border-bottom-0 d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center p-3 p-md-4 gap-2"
    >
      <h5 class="mb-0 fw-bold">Todos os Livros</h5>
      <div class="search-box w-100 w-sm-auto">
        <input
          type="text"
          class="form-control"
          :value="filterText"
          @input="$emit('update:filterText', $event.target.value)"
          placeholder="Filtrar nesta tabela..."
        />
      </div>
    </div>
    <div class="card-body p-0">
      <div class="table-responsive">
        <table class="table table-hover align-middle mb-0">
          <thead class="table-light sticky-top">
            <tr>
              <th>Título</th>
              <th>Autor</th>
              <th>Categorias</th>
              <th>Páginas</th>
              <th>Copias</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="book in books" :key="book.id">
              <td>
                <img
                  v-if="book.coverUrl"
                  :src="fixImageUrl(book.coverUrl)"
                  class="me-2 rounded shadow-sm"
                  style="width: 25px; height: 35px; object-fit: cover"
                />
                {{ book.title }}
              </td>
              <td>{{ book.author }}</td>
              <td>
                <small
                  class="badge bg-light text-dark border me-1"
                  v-for="cat in book.categories"
                  :key="cat.id"
                >
                  {{ cat.name }}
                </small>
              </td>
              <td>
                <span class="badge bg-light text-dark border">
                  {{ book.pages || '---' }}
                </span>
              </td>
              <td>
                <span
                  class="badge"
                  :class="book.availableCopies > 0 ? 'bg-success' : 'bg-danger'"
                >
                  {{ book.availableCopies }} / {{ book.totalCopies }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "~/composables/useApi";

defineProps({
  books: {
    type: Array,
    default: () => []
  },
  filterText: String
});

defineEmits(['update:filterText']);

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  const { baseURL } = useApi();
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};
</script>
