<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div
      class="modal-dialog modal-content bg-white p-4 rounded shadow-lg"
      style="max-width: 600px"
    >
      <div
        class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2"
      >
        <h5 class="mb-0 fw-bold text-success">
          Gerenciar Cópias: {{ bookTitle }}
        </h5>
        <button class="btn btn-close" @click="$emit('close')"></button>
      </div>

      <div class="mb-4">
        <label class="form-label fw-bold">Adicionar Nova Cópia</label>
        <div class="row g-2">
          <div :class="globalLabelType === 'MANUAL' ? 'col-md-5' : 'col-md-12'">
            <div class="input-group">
              <input
                type="text"
                class="form-control"
                v-model="newCopyCode"
                :placeholder="
                  globalLabelType === 'AUTO'
                    ? 'Código será gerado automaticamente'
                    : 'Código do Exemplar (Ex: TIT-001)'
                "
                :disabled="globalLabelType === 'AUTO'"
                @keyup.enter="handleAddCopy"
              />
            </div>
          </div>
          <div class="col-md-5" v-if="globalLabelType === 'MANUAL'">
            <input
              type="text"
              class="form-control"
              v-model="newCopyCustomLabel"
              placeholder="Tarja Manual (Ex: HIS-01)"
              @keyup.enter="handleAddCopy"
            />
          </div>
          <div
            :class="globalLabelType === 'MANUAL' ? 'col-md-2' : 'col-12 mt-2'"
          >
            <button class="btn btn-success w-100" @click="handleAddCopy">
              <i class="bi bi-plus-lg"></i> Adicionar
            </button>
          </div>
        </div>
      </div>

      <div class="mb-3 d-flex justify-content-between align-items-center">
        <div class="d-flex align-items-center gap-2 flex-grow-1">
          <input
            type="text"
            class="form-control form-control-sm"
            placeholder="Filtrar cópias..."
            v-model="copySearch"
            style="max-width: 200px"
          />
          <button
            class="btn btn-sm btn-outline-secondary"
            @click="printAllVisible"
            :disabled="!filteredCopies.length"
            title="Imprimir códigos listados"
          >
            <i class="bi bi-printer"></i> Imprimir ({{ filteredCopies.length }})
          </button>
        </div>
        <div class="small text-muted text-nowrap ms-2">
          Total: {{ copies?.length || 0 }}
          <span class="d-none d-sm-inline">
            (Ativas:
            {{ (copies || []).filter((c) => c.status !== 'REMOVED').length }},
            Removidas:
            {{ (copies || []).filter((c) => c.status === 'REMOVED').length }})
          </span>
        </div>
      </div>

      <div class="table-responsive" style="max-height: 300px">
        <table class="table table-sm align-middle">
          <thead class="table-light">
            <tr>
              <th>Código</th>
              <th>Status</th>
              <th class="text-end">Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="copy in filteredCopies" :key="copy.id">
              <td class="font-monospace">{{ copy.copyCode }}</td>
              <td>
                <span
                  class="badge rounded-pill"
                  :class="{
                    'bg-success-subtle text-success': copy.status === 'AVAILABLE',
                    'bg-warning-subtle text-warning': copy.status === 'LOANED',
                    'bg-danger-subtle text-danger': copy.status === 'REMOVED',
                    'bg-secondary-subtle text-secondary': ![
                      'AVAILABLE',
                      'LOANED',
                      'REMOVED',
                    ].includes(copy.status),
                  }"
                >
                  {{
                    copy.status === "AVAILABLE"
                      ? "Disponível"
                      : copy.status === "LOANED"
                      ? "Emprestado"
                      : copy.status === "REMOVED"
                      ? "Removido"
                      : copy.status
                  }}
                </span>
                <div
                  v-if="copy.status === 'REMOVED' && copy.removalReason"
                  class="small text-danger fst-italic mt-1"
                  style="font-size: 0.75rem"
                >
                  Motivo: {{ copy.removalReason }}
                </div>
                <div
                  v-if="
                    copy.status === 'LOANED' &&
                    copy.loans &&
                    copy.loans[0]?.user
                  "
                  class="small text-muted mt-1"
                  style="font-size: 0.75rem"
                >
                  <i class="bi bi-person-fill"></i>
                  {{ copy.loans[0].user.name }}
                  <span
                    v-if="copy.loans[0].renewCount > 0"
                    class="badge bg-info-subtle text-info ms-1"
                    style="font-size: 0.65rem"
                  >
                    {{ copy.loans[0].renewCount }}x ren.
                  </span>
                </div>
              </td>
              <td class="text-end">
                <button
                  class="btn btn-sm btn-outline-info border-0 me-1"
                  @click="$emit('print-label', copy)"
                  title="Imprimir Tarja"
                >
                  <i class="bi bi-printer"></i>
                </button>
                <button
                  class="btn btn-sm btn-outline-danger border-0"
                  :disabled="copy.status !== 'AVAILABLE'"
                  @click="handleRemove(copy.id)"
                  title="Remover Cópia"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
            <tr v-if="!filteredCopies.length">
              <td colspan="3" class="text-center text-muted py-3">
                Nenhuma cópia encontrada.
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
import { ref, computed } from "vue";
import Swal from "sweetalert2";

const props = defineProps({
  copies: {
    type: Array,
    default: () => [],
  },
  bookTitle: String,
  globalLabelType: String,
});

const emit = defineEmits(["close", "add-copy", "remove-copy", "print-label", "print-multiple"]);

const newCopyCode = ref("");
const newCopyCustomLabel = ref("");
const copySearch = ref("");

const filteredCopies = computed(() => {
  if (!copySearch.value) return props.copies;
  const s = copySearch.value.toLowerCase();
  return props.copies.filter(
    (c) =>
      c.copyCode.toLowerCase().includes(s) ||
      (c.customLabel && c.customLabel.toLowerCase().includes(s))
  );
});

const handleAddCopy = () => {
  emit("add-copy", {
    code: newItemCode.value,
    customLabel: newCopyCustomLabel.value,
  });
  newCopyCode.value = "";
  newCopyCustomLabel.value = "";
};

const newItemCode = computed({
    get: () => newCopyCode.value,
    set: (val) => newCopyCode.value = val
});


const handleRemove = async (copyId: string) => {
    // We can handle the SweetAlert confirmation here or in the parent. 
    // Usually UI logic inside the component is fine.
    const { value: reason } = await Swal.fire({
        title: 'Remover Cópia',
        input: 'text',
        inputLabel: 'Motivo da remoção',
        inputPlaceholder: 'Ex: Danificado, Perdido...',
        showCancelButton: true,
        confirmButtonText: 'Remover',
        cancelButtonText: 'Cancelar',
        inputValidator: (value) => {
            if (!value) {
                return 'Você precisa escrever um motivo!';
            }
        }
    });

    if (reason) {
        emit('remove-copy', { id: copyId, reason });
    }
};

const printAllVisible = () => {
    emit('print-multiple', filteredCopies.value);
};
</script>
