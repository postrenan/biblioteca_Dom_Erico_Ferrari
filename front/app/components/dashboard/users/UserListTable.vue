<template>
  <div class="table-responsive">
    <table class="table table-hover align-middle mb-0">
      <thead class="bg-light">
        <tr>
          <th class="ps-4">Usuário</th>
          <th>Cargo</th>
          <th>Matrícula</th>
          <th>Série</th>
          <th>Status</th>
          <th class="text-end pe-4">Ações</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="user in users"
          :key="user.id"
          :class="{ 'opacity-50 bg-light': !user.isActive }"
        >
          <td class="ps-4">
            <div class="fw-bold text-dark">{{ user.name }}</div>
            <div class="small text-muted">
              {{ user.email || "Sem email" }}
            </div>
          </td>
          <td>
            <span
              class="badge rounded-pill fw-normal px-3 py-2"
              :class="getRoleBadge(user.role)"
            >
              {{ roleLabels[user.role] }}
            </span>
          </td>
          <td>
            <span class="fw-bold text-dark font-monospace">{{
              user.matricula || "-"
            }}</span>
          </td>
          <td>
            <span class="text-muted">{{ user.serie?.name || "-" }}</span>
          </td>
          <td>
            <span
              v-if="user.isActive"
              class="badge bg-success-subtle text-success border border-success-subtle rounded-pill"
              >Ativo</span
            >
            <span
              v-else
              class="badge bg-danger-subtle text-danger border border-danger-subtle rounded-pill"
              >Suspenso</span
            >
          </td>
          <td class="text-end pe-4">
            <div class="btn-group shadow-sm">
              <button
                class="btn btn-light btn-sm text-primary"
                title="Histórico"
                @click="$emit('history', user)"
              >
                <i class="bi bi-clock-history"></i>
              </button>

              <button
                class="btn btn-light btn-sm text-info"
                title="Editar Detalhes"
                @click="$emit('edit', user)"
              >
                <i class="bi bi-pencil-square"></i>
              </button>

              <button
                class="btn btn-light btn-sm text-secondary"
                title="Redefinir Senha"
                @click="$emit('reset-password', user)"
              >
                <i class="bi bi-key"></i>
              </button>

              <button
                v-if="canSuspend(user)"
                class="btn btn-sm"
                :class="
                  user.isActive
                    ? 'btn-light text-danger'
                    : 'btn-success text-white'
                "
                @click="$emit('toggle-status', user.id)"
                :title="user.isActive ? 'Suspender' : 'Reativar'"
              >
                <i
                  class="bi"
                  :class="user.isActive ? 'bi-ban' : 'bi-check-lg'"
                ></i>
              </button>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  users: {
    type: Array,
    default: () => [],
  },
  currentUser: Object
});

const emit = defineEmits(['history', 'edit', 'reset-password', 'toggle-status']);

const roleLabels = {
  STUDENT: "Aluno",
  TEACHER: "Professor",
  LIBRARIAN: "Bibliotecário",
  ADMIN: "Administrador",
};

const getRoleBadge = (role: string) => {
  switch (role) {
    case "ADMIN":
      return "bg-dark text-white border border-dark";
    case "LIBRARIAN":
      return "bg-primary-subtle text-primary border border-primary-subtle";
    case "TEACHER":
      return "bg-info-subtle text-info-emphasis border border-info-subtle";
    default:
      return "bg-secondary-subtle text-secondary border border-secondary-subtle";
  }
};

const canSuspend = (targetUser: any) => {
  if (!props.currentUser) return false;
  if (
    props.currentUser.role !== "ADMIN" &&
    props.currentUser.role !== "LIBRARIAN"
  )
    return false;

  // Admin can suspend anyone except other ADMINS (and self)
  if (props.currentUser.role === "ADMIN") {
    if (targetUser.id === props.currentUser.id) return false;
    if (targetUser.role === "ADMIN") return false;
    return true;
  }

  // Librarian can only suspend Students
  if (props.currentUser.role === "LIBRARIAN") {
    return targetUser.role === "STUDENT";
  }

  return false;
};
</script>
