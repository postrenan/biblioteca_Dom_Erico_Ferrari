<template>
  <div class="row g-3">
    <div v-for="item in requiredReadings" :key="item.id" class="col-md-4">
      <div class="card h-100 shadow-sm border-0">
        <img
          :src="fixImageUrl(item.book.coverUrl)"
          class="card-img-top"
          style="height: 200px; object-fit: cover"
        />
        <div class="card-body">
          <h6 class="fw-bold mb-1">{{ item.book.title }}</h6>
          <p class="small text-muted mb-2">{{ item.book.author }}</p>
          <span v-if="isBookRead(item.bookId)" class="badge bg-success">
            <i class="bi bi-check-circle"></i> Lido
          </span>
          <span v-else class="badge bg-warning text-dark">
            <i class="bi bi-hourglass-split"></i> Pendente
          </span>
        </div>
      </div>
    </div>
    <div
      v-if="requiredReadings.length === 0"
      class="col-12 text-center text-muted bg-light p-5 rounded"
    >
      <i class="bi bi-book display-1 opacity-10"></i>
      <p class="mt-3">Nenhuma leitura obrigatória definida para sua turma.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useApi } from "~/composables/useApi";

const props = defineProps({
    requiredReadings: {
        type: Array,
        default: () => []
    },
    loans: {
        type: Array,
        default: () => []
    }
});

const isBookRead = (bookId: string) => {
   // Logic moved from store/component
   // Assume returned status
   return props.loans.some(l => l.bookCopy.bookId === bookId && l.status === 'RETURNED');
};

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  const { baseURL } = useApi();
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};
</script>
