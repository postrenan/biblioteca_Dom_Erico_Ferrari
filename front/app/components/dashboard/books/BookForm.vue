<template>
  <form @submit.prevent="$emit('submit')">
    <fieldset :disabled="disabled">
      <div class="row">
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label text-dark">Identificação (ID)</label>
            <input
              type="text"
              class="form-control"
              :value="modelValue.id"
              disabled
            />
            <div class="form-text -50">Gerado automaticamente</div>
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Capa do Livro (URL ou Upload)</label>
            <div class="input-group">
              <span class="input-group-text"><i class="bi bi-image"></i></span>
              <input
                :value="modelValue.coverUrl"
                @input="updateField('coverUrl', $event.target.value)"
                type="text"
                class="form-control"
                placeholder="https://exemplo.com/capa.jpg"
              />
              <label class="btn btn-outline-secondary" title="Fazer Upload">
                <i class="bi bi-upload"></i>
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  @change="$emit('upload-cover', $event)"
                />
              </label>
            </div>
            <div
              v-if="modelValue.coverUrl"
              class="mt-2 text-center p-2 border rounded bg-light"
            >
              <img
                :src="fixImageUrl(modelValue.coverUrl)"
                class="img-thumbnail"
                style="max-height: 150px"
                alt="Preview da Capa"
              />
              <div class="small text-muted mt-1">Pré-visualização da Capa</div>
            </div>
          </div>
          <div class="mb-3">
            <label class="form-label">Título</label>
            <input
              type="text"
              class="form-control"
              :value="modelValue.title"
              @input="updateField('title', $event.target.value)"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Autor</label>
            <input
              type="text"
              class="form-control"
              :value="modelValue.author"
              @input="updateField('author', $event.target.value)"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Data de Publicação</label>
            <input
              type="date"
              class="form-control"
              :value="modelValue.publicationDate"
              @input="updateField('publicationDate', $event.target.value)"
            />
          </div>
          <div class="mb-3">
            <label class="form-label fw-bold">Categorias (Múltipla Escolha)</label>
            <div class="category-select-wrapper border rounded bg-white shadow-sm overflow-hidden">
              <div class="category-list p-2" style="max-height: 160px; overflow-y: auto">
                <div
                  v-for="cat in categories"
                  :key="cat.id"
                  class="form-check custom-cat-check py-1"
                >
                  <input
                    class="form-check-input"
                    type="checkbox"
                    :value="cat.id"
                    :id="idPrefix + 'cat-' + cat.id"
                    v-model="modelValue.selectedCategoryIds"
                  />
                  <label
                    class="form-check-label w-100 cursor-pointer"
                    :for="idPrefix + 'cat-' + cat.id"
                  >
                    {{ cat.name }}
                  </label>
                </div>
              </div>
            </div>
            <button
              class="btn btn-sm btn-link text-decoration-none mt-1 p-0 fw-bold"
              type="button"
              @click="$emit('manage-categories')"
            >
              <i class="bi bi-gear-fill"></i> Gerenciar Opções
            </button>
          </div>
        </div>
        <div class="col-md-6">
          <div class="mb-3">
            <label class="form-label">Descrição</label>
            <textarea
              class="form-control"
              rows="5"
              :value="modelValue.description"
              @input="updateField('description', $event.target.value)"
            ></textarea>
          </div>
          <div class="row">
            <div class="col-8">
              <label class="form-label">Nº Total de Exemplares</label>
              <input
                type="number"
                class="form-control"
                :value="modelValue.totalCopies"
                @input="updateField('totalCopies', $event.target.value)"
                min="0"
              />
            </div>
            <div class="col-4">
              <label class="form-label">Páginas</label>
              <input
                type="number"
                class="form-control"
                :value="modelValue.pages"
                @input="updateField('pages', $event.target.value)"
                min="0"
              />
            </div>
          </div>
          <div class="row mt-3">
            <div class="col">
              <label class="form-label">Em Estoque</label>
              <input
                type="number"
                class="form-control"
                :value="modelValue.availableCopies"
                disabled
              />
              <div class="form-text -50">Calculado automaticamente</div>
            </div>
            <div class="col">
              <label class="form-label">Retirados</label>
              <input
                type="number"
                class="form-control"
                :value="modelValue.totalCopies - modelValue.availableCopies"
                disabled
              />
              <div class="form-text -50">Calculado automaticamente</div>
            </div>
          </div>
        </div>
      </div>
    </fieldset>

    <div class="mt-4 text-end">
        <slot name="actions">
            <button
                type="submit"
                class="btn btn-primary btn-lg"
            >
                Salvar
            </button>
        </slot>
    </div>
  </form>
</template>

<script setup lang="ts">
import { useApi } from "~/composables/useApi";

const props = defineProps({
  modelValue: {
    type: Object,
    required: true,
  },
  categories: {
    type: Array,
    default: () => [],
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  idPrefix: {
    type: String, // To avoid ID conflicts if multiple forms exist
    default: 'form-',
  }
});

const emit = defineEmits(['update:modelValue', 'submit', 'manage-categories', 'upload-cover']);

const updateField = (field: string, value: any) => {
  emit('update:modelValue', {
    ...props.modelValue,
    [field]: value
  });
};

const fixImageUrl = (url: string) => {
  if (!url) return "/img-placeholder.jpg";
  if (url.startsWith("http")) return url;
  const { baseURL } = useApi();
  return `${baseURL}${url.startsWith("/") ? "" : "/"}${url}`;
};
</script>
