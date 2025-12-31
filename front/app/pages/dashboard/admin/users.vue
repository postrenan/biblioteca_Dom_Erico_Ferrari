<template>
  <div class="dashboard-container position-relative">
    <div class="hero-bg-anim"></div>
    <div class="shape shape-1"></div>
    <div class="shape shape-2"></div>

    <div class="container position-relative z-2 py-5">
      <AppHeader />

      <UserListHeader
        @export="handleExport"
        @import="handleImport"
        @help="showCsvHelp = true"
      />

      <UserCsvHelpModal v-if="showCsvHelp" @close="showCsvHelp = false" />

      <!-- Create User Form -->
      <CreateUserForm
        v-if="currentUser?.role === 'ADMIN'"
        v-model="form"
        :series="series"
        :loading="loading"
        @submit="handleCreate"
      />

      <!-- Users List -->
      <div class="card glass-card border-0">
        <div class="card-body p-0">
          <div class="p-4 border-bottom">
            <h5
              class="card-title mb-0 fw-bold text-secondary text-uppercase fs-6 tracking-wide"
            >
              <i class="bi bi-people-fill me-2 text-primary"></i>Base de Usuários
            </h5>
          </div>

          <UserFilters
            v-model:searchText="searchText"
            v-model:selectedRole="selectedRole"
            v-model:selectedStatus="selectedStatus"
            :totalMatches="filteredUsers.length"
          />

          <div v-if="loading" class="text-center py-5">
            <div class="spinner-border text-primary" role="status"></div>
          </div>

          <UserListTable
            v-else
            :users="filteredUsers"
            :currentUser="currentUser"
            @history="handleHistory"
            @edit="handleEdit"
            @reset-password="handleResetPassword"
            @toggle-status="toggleStatus"
          />
        </div>
      </div>

      <!-- History Modal -->
      <UserHistoryModal
        v-if="selectedHistoryUser"
        :userName="selectedHistoryUser.name"
        :history="userHistory"
        :loading="historyLoading"
        @close="closeHistory"
      />

      <!-- Edit User Modal -->
      <EditUserModal
        v-if="editUser"
        v-model="editForm"
        :series="series"
        :loading="loading"
        :currentUserRole="editUser.role"
        @close="closeEdit"
        @submit="handleEditSubmit"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import Swal from "sweetalert2";
import { useApi } from "~/composables/useApi";
// Components
import UserCsvHelpModal from "~/components/dashboard/users/UserCsvHelpModal.vue";
import UserListHeader from "~/components/dashboard/users/UserListHeader.vue";
import UserFilters from "~/components/dashboard/users/UserFilters.vue";
import UserListTable from "~/components/dashboard/users/UserListTable.vue";
import CreateUserForm from "~/components/dashboard/users/CreateUserForm.vue";
import EditUserModal from "~/components/dashboard/users/EditUserModal.vue";
import UserHistoryModal from "~/components/dashboard/users/UserHistoryModal.vue";

const { fetchUsers, createUser, toggleStatus, updateUser, users, loading } =
  useUserStore();
const { fetchSeries, series } = useSeriesStore();
const { user: currentUser, fetchProfile } = useAuth();
const { apiFetch, baseURL } = useApi();

const form = ref({
  name: "",
  email: "",
  password: "",
  role: "STUDENT",
  matricula: "",
  serieId: "",
  contact1: "",
  contact2: "",
});

const searchText = ref("");
const selectedRole = ref("");
const selectedStatus = ref("");

const filteredUsers = computed(() => {
  return users.value.filter((u) => {
    // 1. Search Text (Name, Email, Matricula)
    const textMatch =
      !searchText.value ||
      u.name.toLowerCase().includes(searchText.value.toLowerCase()) ||
      (u.email &&
        u.email.toLowerCase().includes(searchText.value.toLowerCase())) ||
      (u.matricula &&
        u.matricula.toLowerCase().includes(searchText.value.toLowerCase()));

    // 2. Role Filter
    const roleMatch = !selectedRole.value || u.role === selectedRole.value;

    // 3. Status Filter
    const statusMatch =
      !selectedStatus.value ||
      (selectedStatus.value === "active" ? u.isActive : !u.isActive);

    return textMatch && roleMatch && statusMatch;
  });
});

const editUser = ref(null);
const editForm = ref({});
const showCsvHelp = ref(false);

const selectedHistoryUser = ref(null);
const userHistory = ref([]);
const historyLoading = ref(false);

onMounted(async () => {
  await fetchProfile();
  await fetchUsers();
  await fetchSeries();
});

const handleCreate = async () => {
  if (!form.value.serieId && ["STUDENT", "TEACHER"].includes(form.value.role)) {
     // Optional: Warning here if needed, but required attr handles it mostly on submit
  }

  const { error } = await createUser(form.value);

  if (!error.value) {
    Swal.fire("Sucesso", "Usuário criado com sucesso", "success");
    form.value = {
      name: "",
      email: "",
      password: "",
      role: "STUDENT",
      matricula: "",
      serieId: "",
      contact1: "",
      contact2: "",
    };
  } else {
    const msg = error.value?.data?.message || "Erro ao criar usuário";
    Swal.fire("Erro", msg, "error");
  }
};

const handleEdit = (user) => {
  editUser.value = user;
  editForm.value = {
    name: user.name,
    email: user.email,
    contact1: user.contact1 || "",
    contact2: user.contact2 || "",
    observation: user.observation || "",
    serieId: user.serie?.id || "",
  };
};

const closeEdit = () => {
  editUser.value = null;
  editForm.value = {};
};

const handleEditSubmit = async () => {
  if (!editUser.value) return;

  const result = await updateUser(editUser.value.id, editForm.value);

  if (result) {
    Swal.fire("Sucesso", "Usuário atualizado com sucesso!", "success");
    closeEdit();
  } else {
    Swal.fire("Erro", "Falha ao atualizar usuário.", "error");
  }
};

const handleResetPassword = async (user) => {
  const { value: newPassword } = await Swal.fire({
    title: `Redefinir Senha de ${user.name}`,
    input: "password",
    inputLabel: "Nova Senha",
    inputPlaceholder: "Digite a nova senha",
    showCancelButton: true,
    confirmButtonText: "Salvar",
    cancelButtonText: "Cancelar",
  });

  if (newPassword) {
    await updateUser(user.id, { password: newPassword });
    Swal.fire("Sucesso", "Senha atualizada.", "success");
  }
};

// History Logic
const handleHistory = async (user) => {
  selectedHistoryUser.value = user;
  userHistory.value = [];
  historyLoading.value = true;

  try {
    const data = await apiFetch(`/users/${user.id}/history`);
    userHistory.value = data || [];
  } catch (e) {
    Swal.fire("Erro", "Não foi possível carregar o histórico.", "error");
  } finally {
    historyLoading.value = false;
  }
};

const closeHistory = () => {
  selectedHistoryUser.value = null;
  userHistory.value = [];
};

// Import/Export
const handleExport = async () => {
  try {
    const token = useCookie("auth_token");
    const response = await fetch(`${baseURL}/data/export/users`, {
      headers: { Authorization: `Bearer ${token.value}` },
    });

    if (!response.ok) throw new Error("Falha no download");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
    window.URL.revokeObjectURL(url);
  } catch (e) {
    Swal.fire("Erro", "Erro ao exportar dados", "error");
  }
};

const handleImport = async (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    await apiFetch("/data/import/users", {
      method: "POST",
      body: formData,
    });
    Swal.fire("Sucesso", "Importação realizada!", "success");
    fetchUsers();
  } catch (e) {
    Swal.fire("Erro", "Erro ao importar. Verifique o formato do CSV.", "error");
  } finally {
    event.target.value = "";
  }
};
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
  background: radial-gradient(
      circle at 20% 50%,
      rgba(0, 144, 25, 0.2) 0%,
      transparent 50%
    ),
    radial-gradient(
      circle at 80% 20%,
      rgba(171, 215, 254, 0.15) 0%,
      transparent 50%
    );
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
</style>
