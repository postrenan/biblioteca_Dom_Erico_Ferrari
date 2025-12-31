<template>
  <div class="dashboard-container position-relative">
    <!-- Background Shapes -->
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
      <AppHeader />

      <BookHeader
        @export="handleExport"
        @import="handleImport"
        @help="showCsvHelp = true"
        @settings="openSettingsModal"
      />

      <BookFilters
        v-model:searchQuery="searchQuery"
        v-model:selectedCategoryId="selectedCategory"
        v-model:availabilityFilter="availabilityFilter"
        :categories="categories"
      />

      <CsvHelpModal v-if="showCsvHelp" @close="showCsvHelp = false" />

      <BookActionSelector
        v-model="selectedAction"
        :totalBooks="books.length"
      />

      <div
        v-if="statusMessage.text"
        class="alert shadow-sm border-0 mb-4"
        :class="statusMessage.type"
        role="alert"
      >
        {{ statusMessage.text }}
      </div>

      <!-- Views -->
      <BookListTable
        v-if="selectedAction === 'ver-todos'"
        :books="filteredBooks"
        v-model:filterText="searchText"
      />

      <div
        v-if="['atualizar', 'gerenciar-copias', 'deletar'].includes(selectedAction)"
      >
        <BookManagementTable
          :books="filteredBooks"
          :action="selectedAction"
          v-model:searchText="searchText"
          @edit="handleEditClick"
          @manage-copies="handleManageCopies"
          @delete="handleDeleteClick"
        />
      </div>

       <div
        v-if="
            selectedAction !== 'adicionar' &&
            selectedAction !== 'atualizar' &&
            selectedAction !== 'gerenciar-copias' &&
            selectedAction !== 'deletar' && 
            selectedAction !== 'ver-todos'
        "
        class="mb-4 p-3 bg-light rounded bg-opacity-10 "
        >
        <label for="search-id" class="form-label text-white "
            >Buscar Livro por ID (8 dígitos):</label
        >
        <div class="input-group">
            <input
            type="text"
            id="search-id"
            class="form-control"
            v-model="searchId"
            placeholder="Ex: 1A2B3C4D"
            />
            <button class="btn btn-primary" @click="findBook">Buscar</button>
        </div>
    </div>

      <!-- Inline Form -->
      <div
        v-if="
          selectedAction === 'adicionar' ||
          (selectedAction !== 'atualizar' && showForm)
        "
        class="card p-4 border-0 shadow-sm glass-card"
      >
        <BookForm
          v-model="form"
          :categories="categories"
          :disabled="isFormDisabled"
          @submit="handleSubmit"
          @manage-categories="showManageCategoriesModal = true"
          @upload-cover="handleFileUpload"
        >
          <template #actions>
            <button
              v-if="selectedAction === 'adicionar'"
              type="submit"
              class="btn btn-success btn-lg"
            >
              <i class="bi bi-plus-lg me-1"></i>
              Adicionar Livro
            </button>
            <button
              v-if="selectedAction === 'atualizar'"
              type="submit"
              class="btn btn-primary btn-lg"
            >
              Salvar Alterações
            </button>
            <button
              v-if="selectedAction === 'deletar'"
              type="submit"
              class="btn btn-danger btn-lg"
            >
              Confirmar Deleção
            </button>
          </template>
        </BookForm>
      </div>

      <!-- Edit Modal -->
      <div
        v-if="showEditModal"
        class="modal-overlay"
        @click.self="closeEditModal"
      >
        <div
          class="modal-dialog modal-lg modal-content bg-white p-4 rounded shadow-lg"
        >
          <div
            class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2"
          >
            <h4 class="mb-0 fw-bold text-primary">Editar Livro</h4>
            <button class="btn btn-close" @click="closeEditModal"></button>
          </div>
          <BookForm
            v-model="form"
            :categories="categories"
            @submit="handleSubmit"
            @manage-categories="showManageCategoriesModal = true"
            @upload-cover="handleFileUpload"
            idPrefix="edit-form-"
          />
        </div>
      </div>

      <!-- Modals -->
      <BookCopiesManager
        v-if="showCopiesModal"
        :copies="selectedBook?.copies || []"
        :bookTitle="form.title"
        :globalLabelType="globalLabelType"
        @close="closeCopiesModal"
        @add-copy="handleAddCopyEvent"
        @remove-copy="handleRemoveCopyEvent"
        @print-label="printLabel"
        @print-multiple="printLabels"
      />

      <CategoryManager
        v-if="showManageCategoriesModal"
        :categories="categories"
        @close="showManageCategoriesModal = false"
        @add="handleAddCategory"
        @remove="handleRemoveCategory"
      />

      <!-- Settings Modal -->
        <div
        v-if="showSettingsModal"
        class="modal-overlay"
        @click.self="showSettingsModal = false"
        >
        <div
            class="modal-dialog modal-content bg-white p-4 rounded shadow-lg"
            style="max-width: 500px"
        >
            <div class="d-flex justify-content-between align-items-center mb-4 border-bottom pb-2">
            <h5 class="mb-0 fw-bold"><i class="bi bi-gear-fill me-2"></i>Configurações do Sistema</h5>
            <button class="btn btn-close" @click="showSettingsModal = false"></button>
            </div>

            <div class="mb-3">
                <label class="form-label fw-bold">Geração de Etiquetas (Códigos)</label>
                <div class="alert alert-info small">
                    Isso define como os códigos dos novos exemplares serão gerados.
                </div>
                <div class="d-flex gap-3">
                    <div class="form-check">
                    <input class="form-check-input" type="radio" value="AUTO" id="set-auto" v-model="globalLabelType" @change="saveSettings" />
                    <label class="form-check-label" for="set-auto">Automático (Padrão)</label>
                    </div>
                    <div class="form-check">
                    <input class="form-check-input" type="radio" value="MANUAL" id="set-manual" v-model="globalLabelType" @change="saveSettings" />
                    <label class="form-check-label" for="set-manual">Manual</label>
                    </div>
                </div>
            </div>

            <div class="text-end mt-4">
                <button class="btn btn-primary" @click="showSettingsModal = false">Concluir</button>
            </div>
        </div>
        </div>

    </div>
  </div>
</template>

<script setup>
import { ref, reactive, watch, computed, onMounted } from "vue";
import Swal from "sweetalert2";
import { useApi } from "~/composables/useApi";
// Components
import BookHeader from "~/components/dashboard/books/BookHeader.vue";
import BookFilters from "~/components/dashboard/books/BookFilters.vue";
import CsvHelpModal from "~/components/dashboard/books/CsvHelpModal.vue";
import BookActionSelector from "~/components/dashboard/books/BookActionSelector.vue";
import BookListTable from "~/components/dashboard/books/BookListTable.vue";
import BookManagementTable from "~/components/dashboard/books/BookManagementTable.vue";
import BookForm from "~/components/dashboard/books/BookForm.vue";
import BookCopiesManager from "~/components/dashboard/books/BookCopiesManager.vue";
import CategoryManager from "~/components/dashboard/books/CategoryManager.vue";

const { printLabel: printCode, printLabels } = usePrint();

// Stores
const {
  books,
  fetchBooks,
  createBook,
  updateBook,
  deleteBook,
  loading: booksLoading,
} = useBookStore();
const { addCopy, removeCopy } = useCopyStore();
const { categories, fetchCategories, addCategory, removeCategory } =
  useCategoryStore();
const { logout } = useAuth(); // kept if needed for app header
const loading = computed(() => booksLoading.value);

// State
const selectedAction = ref("adicionar");
const searchId = ref("");
const selectedBook = ref(null);
const statusMessage = ref({ text: "", type: "" });

const searchQuery = ref("");
const searchText = ref("");
const selectedCategory = ref("");
const availabilityFilter = ref("all");
const showSettingsModal = ref(false);
const globalLabelType = ref("AUTO");
const showCsvHelp = ref(false);

const { apiFetch } = useApi();

// Settings Logic
const fetchSettings = async () => {
    try {
        const res = await apiFetch("/settings/label-type");
        globalLabelType.value = res.value;
    } catch (e) {
        console.error("Failed to fetch settings", e);
    }
};

const saveSettings = async () => {
    try {
        await apiFetch("/settings/label-type", {
            method: "PUT",
            body: { value: globalLabelType.value }
        });
        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: 'Configuração salva!',
            showConfirmButton: false,
            timer: 1500
        });
    } catch (e) {
        console.error("Failed to save settings", e);
        Swal.fire("Erro", "Falha ao salvar configuração", "error");
    }
};

const openSettingsModal = () => {
    fetchSettings();
    showSettingsModal.value = true;
};

onMounted(() => {
    fetchSettings();
    fetchBooks();
    fetchCategories();
});

// Filtering
const filteredBooks = computed(() => {
  let result = books.value;
  
  // Filter by search query (from Header/Filters)
  if (searchQuery.value) {
    const lower = searchQuery.value.toLowerCase();
    result = result.filter(
        (b) =>
        b.title.toLowerCase().includes(lower) ||
        b.author.toLowerCase().includes(lower) ||
        (b.categoryName && b.categoryName.toLowerCase().includes(lower)) ||
        b.id.toString().toLowerCase().includes(lower)
    );
  }

  // Filter by category
  if (selectedCategory.value) {
      result = result.filter(b => b.categoryId === selectedCategory.value || 
        (b.categories && b.categories.some(c => c.id === selectedCategory.value))
      );
  }

  // Filter by availability
  if (availabilityFilter.value !== 'all') {
      if (availabilityFilter.value === 'available') {
          result = result.filter(b => b.availableCopies > 0);
      } else {
          result = result.filter(b => b.availableCopies === 0);
      }
  }

  return result;
});

// Form Reference
const form = reactive({
  id: "", 
  title: "",
  author: "",
  publicationDate: "",
  description: "",
  genre: "",
  coverUrl: "",
  categoryId: "", 
  selectedCategoryIds: [], 
  labelType: "AUTO", 
  pages: 0,
  totalCopies: 0,
  availableCopies: 0,
});

// Category Handlers
const showManageCategoriesModal = ref(false);
const handleAddCategory = async (name) => {
  const { error } = await addCategory(name);
  if (!error) {
    Swal.fire("Sucesso", "Categoria adicionada!", "success");
  } else {
    Swal.fire("Erro", "Erro ao adicionar categoria.", "error");
  }
};

const handleRemoveCategory = async (id) => {
  const result = await Swal.fire({
    title: "Remover categoria?",
    text: "Isso não afetará os livros já vinculados, mas a categoria deixará de existir.",
    icon: "warning",
    showCancelButton: true,
  });

  if (result.isConfirmed) {
    await removeCategory(id);
  }
};

// Utils
const resetForm = () => {
  Object.assign(form, {
    id: "",
    title: "",
    author: "",
    publicationDate: "",
    description: "",
    genre: "",
    coverUrl: "",
    categoryId: "",
    selectedCategoryIds: [],
    labelType: "AUTO",
    pages: 0,
    totalCopies: 0,
    availableCopies: 0,
  });
  selectedBook.value = null;
  searchId.value = "";
};

const showStatus = (text, type, duration = 4000) => {
  statusMessage.value = { text, type };
  setTimeout(() => {
    statusMessage.value = { text: "", type: "" };
  }, duration);
};

// Edit Modal Logic
const showEditModal = ref(false);

const handleEditClick = (book) => {
  selectedBook.value = book;
  form.id = book.id;
  form.title = book.title;
  form.author = book.author;
  form.publicationDate = book.publicationDate ? book.publicationDate.split('T')[0] : "";
  form.description = book.description;
  form.genre = book.genre;
  form.pages = book.pages || 0;
  form.totalCopies = book.totalCopies;
  form.availableCopies = book.availableCopies;
  form.coverUrl = book.coverUrl;
  form.selectedCategoryIds = book.categories ? book.categories.map(c => c.id) : [];

  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  resetForm();
};

// Copies Modal Logic
const showCopiesModal = ref(false);

const handleManageCopies = (book) => {
  selectedBook.value = book;
  form.id = book.id;
  form.title = book.title;
  form.totalCopies = book.totalCopies;
  showCopiesModal.value = true;
};

const closeCopiesModal = () => {
  showCopiesModal.value = false;
  resetForm();
};

const handleDeleteClick = async (book) => {
  const borrowed = book.totalCopies - book.availableCopies;
  if (borrowed > 0) {
    Swal.fire({
      icon: "error",
      title: "Não é possível deletar",
      text: `Este livro possui ${borrowed} cópia(s) emprestada(s). Devolva-as antes de remover o livro.`,
    });
    return;
  }

  const result = await Swal.fire({
    title: "Tem certeza?",
    text: `Você está prestes a deletar "${book.title}". Esta ação não pode ser desfeita.`,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sim, deletar!",
    cancelButtonText: "Cancelar",
  });

  if (result.isConfirmed) {
    const { error } = await deleteBook(book.id);
    if (!error.value) {
      Swal.fire("Deletado!", "O livro foi removido.", "success");
      fetchBooks();
    } else {
      Swal.fire("Erro!", "Ocorreu um erro ao deletar.", "error");
    }
  }
};

watch(selectedAction, () => {
  resetForm();
  statusMessage.value = { text: "", type: "" };
});

const showForm = computed(() => {
  return (
    selectedAction.value === "adicionar" ||
    (selectedAction.value !== "adicionar" && selectedBook.value)
  );
});

const isFormDisabled = computed(() => {
  return ["deletar", "gerenciar-copias"].includes(selectedAction.value);
});

const findBook = () => {
  const found = books.value.find(
    (book) => book.id.toLowerCase() === searchId.value.toLowerCase()
  );
  if (found) {
    selectedBook.value = found;
    form.id = found.id;
    form.title = found.title;
    form.author = found.author;
    form.publicationDate = found.publicationDate;
    form.description = found.description;
    form.genre = found.genre;
    form.coverUrl = found.coverUrl;
    form.categoryId = found.categoryId || "";
    form.selectedCategoryIds = found.categories
      ? found.categories.map((c) => c.id)
      : [];
    form.pages = found.pages || 0;
    form.totalCopies = found.totalCopies;
    form.availableCopies = found.availableCopies;

    showStatus("Livro encontrado. Prossiga com a ação.", "alert-info");
  } else {
    selectedBook.value = null;
    showStatus(
      "Livro com o ID informado não foi encontrado nesta página (verifique se já foi carregado).",
      "alert-warning"
    );
  }
};

const handleSubmit = () => {
  switch (selectedAction.value) {
    case "adicionar":
      handleAdd();
      break;
    case "atualizar":
      handleUpdate();
      break;
    case "deletar":
      handleDelete();
      break;
  }
};

const handleAdd = async () => {
  const { error } = await createBook({
    title: form.title,
    author: form.author,
    description: form.description,
    totalCopies: form.totalCopies,
    availableCopies: form.totalCopies,
    genre: form.genre,
    pages: form.pages,
    coverUrl: form.coverUrl,
    labelType: form.labelType,
    categoryIds: form.selectedCategoryIds,
    publicationDate: form.publicationDate,
  });

  if (!error.value) {
    showStatus(`Livro "${form.title}" adicionado com sucesso!`, "alert-success");
    resetForm();
    await fetchBooks();
  } else {
    showStatus("Erro ao adicionar livro.", "alert-danger");
  }
};

const handleUpdate = async () => {
  const { error } = await updateBook(form.id, {
    title: form.title,
    author: form.author,
    description: form.description,
    totalCopies: form.totalCopies,
    genre: form.genre,
    pages: form.pages,
    coverUrl: form.coverUrl,
    labelType: form.labelType,
    categoryIds: form.selectedCategoryIds,
    publicationDate: form.publicationDate,
  });

  if (!error.value) {
    showStatus("Livro atualizado com sucesso!", "alert-success");
    closeEditModal();
    await fetchBooks();
  } else {
    Swal.fire("Erro", error.value.data?.message || "Erro ao atualizar livro.", "error");
  }
};

const handleDelete = async () => {
  const { error } = await deleteBook(form.id);
  if (!error.value) {
    showStatus("Livro deletado com sucesso!", "alert-success");
    resetForm();
  } else {
    Swal.fire("Erro", error.value.data?.message || "Erro ao deletar livro.", "error");
  }
};

// Copies Event Handlers from Component
const handleAddCopyEvent = async ({ code, customLabel }) => {
   if (globalLabelType.value !== 'AUTO' && !code) {
    showStatus("Informe o código da cópia.", "alert-warning");
    return;
  }
  const { error } = await addCopy(
    selectedBook.value.id,
    code,
    customLabel
  );
  if (!error) {
    showStatus("Cópia adicionada com sucesso!", "alert-success");
    await fetchBooks();
    selectedBook.value = books.value.find(b => b.id === selectedBook.value.id);
  } else {
    showStatus("Erro ao adicionar cópia. Verifique o código.", "alert-danger");
  }
};

const handleRemoveCopyEvent = async ({ id, reason }) => {
    const { error } = await removeCopy(id, reason);
    if (!error) {
      Swal.fire("Sucesso", "Cópia removida.", "success");
      await fetchBooks();
      selectedBook.value = books.value.find(b => b.id === selectedBook.value.id);
    } else {
      Swal.fire("Erro", "Não foi possível remover a cópia.", "error");
    }
};

const printLabel = (copy) => {
    if (copy && copy.copyCode) printCode(copy.copyCode);
};

// Import/Export Handlers
const handleExport = async () => {
  try {
    const { wrapper } = await import("~/composables/useApi"); // Dynamic import or use defined
    // Actually useApi is available
    const token = useCookie("auth_token");
    const config = useRuntimeConfig();
    const apiUrl = config.public.apiBase || "http://localhost:3001";

    const response = await fetch(`${apiUrl}/data/export/books`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!response.ok) throw new Error("Falha no download");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "books.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    showStatus("Erro ao exportar dados.", "alert-danger");
  }
};

const handleImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    const { apiFetch } = useApi();
    await apiFetch("/data/import/books", {
      method: "POST",
      body: formData,
    });
    showStatus("Importação realizada com sucesso!", "alert-success");
    fetchBooks(); 
  } catch (e) {
    showStatus("Erro ao importar. Verifique o CSV.", "alert-danger");
  } finally {
    event.target.value = "";
  }
};

const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
        const response = await apiFetch("/uploads", {
            method: "POST",
            body: formData,
        });
        if (response && response.url) {
            form.coverUrl = response.url; 
            showStatus("Upload de imagem realizado!", "alert-success");
        }
    } catch (e) {
        showStatus("Erro ao fazer upload.", "alert-danger");
    } finally {
        event.target.value = "";
    }
};

resetForm();
</script>

<style scoped>
.dashboard-container {
  min-height: 100vh;
  background-color: #0f172a;
  overflow-x: hidden;
  font-family: "Inter", sans-serif;
}

.hero-bg-anim {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle at 20% 50%, rgba(0, 144, 25, 0.2) 0%, transparent 50%),
    radial-gradient(circle at 80% 20%, rgba(171, 215, 254, 0.15) 0%, transparent 50%);
  z-index: 1;
}

.shape {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.4;
  z-index: 0;
}
.shape-1 {
  width: 400px;
  height: 400px;
  background: #009019;
  top: -100px;
  left: -100px;
}
.shape-2 {
  width: 500px;
  height: 500px;
  background: #abd7fe;
  bottom: -100px;
  right: -100px;
}

.glass-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
}
.modal-content {
  max-width: 800px;
  width: 90%;
  border: none;
}
</style>
