<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div
      class="modal-dialog modal-content bg-white p-4 rounded shadow-lg"
      style="max-width: 600px"
    >
      <div
        class="d-flex justify-content-between align-items-center mb-3 border-bottom pb-2"
      >
        <h5 class="mb-0 fw-bold text-info">Formato do Arquivo CSV</h5>
        <button class="btn btn-close" @click="$emit('close')"></button>
      </div>
      <p>
        O arquivo CSV deve conter as seguintes colunas (respeitando a ordem ou
        cabeçalho):
      </p>
      <div class="table-responsive">
        <table class="table table-sm table-bordered">
          <thead class="table-light">
            <tr>
              <th>Coluna</th>
              <th>Descrição</th>
              <th>Obrigatório</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Title</td>
              <td>Título do Livro</td>
              <td>Sim</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>Nome do Autor</td>
              <td>Sim</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>Descrição/Sinopse</td>
              <td>Não</td>
            </tr>
            <tr>
              <td>Genre</td>
              <td>Gênero Literário</td>
              <td>Não</td>
            </tr>
            <tr>
              <td>PublicationDate</td>
              <td>Data (ISO ou Texto)</td>
              <td>Não</td>
            </tr>
            <tr>
              <td>TotalCopies</td>
              <td>Número de Exemplares</td>
              <td>Sim (Padrão 0)</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="alert alert-warning mt-2 mb-0">
        <small
          ><i class="bi bi-exclamation-triangle"></i> Utilize vírgula (,) como
          separador.</small
        >
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineEmits(['close']);
</script>
