<template>
  <div class="col-md-8 mx-auto">
    <div class="card glass-card border-0 mb-4">
      <div class="card-body p-4">
        <h5 class="fw-bold mb-4">Sugerir novo livro para o acervo</h5>
        <div class="mb-3">
          <label class="form-label small fw-bold">Título do Livro *</label>
          <input
            :value="form.title"
            @input="updateField('title', $event)"
            type="text"
            class="form-control"
            placeholder="Ex: O Menino do Pijama Listrado"
          />
        </div>
        <div class="mb-3">
          <label class="form-label small fw-bold">Autor (Opcional)</label>
          <input
            :value="form.author"
             @input="updateField('author', $event)"
            type="text"
            class="form-control"
            placeholder="Ex: John Boyne"
          />
        </div>
         <!-- Add reason field if needed as per my-loans usage -->
         <div class="mb-3">
          <label class="form-label small fw-bold">Motivo (Opcional)</label>
           <textarea
            :value="form.reason || ''"
             @input="updateField('reason', $event)"
            class="form-control"
            rows="2"
            placeholder="Por que este livro deve ser comprado?"
          ></textarea>
        </div>
        <button
          class="btn btn-primary w-100 py-2"
          @click="$emit('submit')"
        >
          <i class="bi bi-send me-1"></i> Enviar Sugestão
        </button>
      </div>
    </div>

    <!-- Suggestion History -->
    <div class="card glass-card border-0">
      <div class="card-body p-4">
        <h5 class="fw-bold mb-3">Minhas Sugestões</h5>
         <div v-if="loading" class="text-center py-3"><div class="spinner-border text-primary"></div></div>
        <div
          v-else-if="mySuggestions.length === 0"
          class="text-center text-muted py-4"
        >
          <i class="bi bi-inbox display-4 opacity-10 d-block mb-2"></i>
          <p class="mt-2">Você ainda não enviou nenhuma sugestão.</p>
        </div>
        <div v-else class="list-group list-group-flush">
          <div
            v-for="s in (mySuggestions as any[])"
            :key="s.id"
            class="list-group-item bg-transparent"
          >
            <div class="d-flex justify-content-between align-items-start">
              <div>
                <h6 class="mb-1 fw-bold">{{ s.title }}</h6>
                <p class="mb-1 small text-muted">
                  {{ s.author || "Autor não informado" }}
                </p>
                <small class="text-muted">{{ formatDate(s.createdAt) }}</small>
              </div>
              <span class="badge" :class="getStatusClass(s.status)">{{
                s.status === 'PENDING' ? 'Pendente' : (s.status === 'APPROVED' ? 'Aprovado' : 'Rejeitado')
              }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    form: {
        type: Object as () => any, // Relaxed type for simplified form
        required: true
    },
    mySuggestions: {
        type: Array,
        default: () => []
    },
    loading: Boolean
});

const emit = defineEmits(['update:form', 'submit']);

const updateField = (field: string, event: Event) => {
    const target = event.target as HTMLInputElement | HTMLTextAreaElement;
    emit('update:form', {
        ...props.form,
        [field]: target.value 
    });
};

const formatDate = (dateString: string) => {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("pt-BR");
};

const getStatusClass = (status: string) => {
    switch (status) {
        case 'PENDING': return 'bg-warning text-dark';
        case 'APPROVED': return 'bg-success';
        case 'REJECTED': return 'bg-danger';
        default: return 'bg-secondary';
    }
};
</script>

<style scoped>
.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}
</style>
