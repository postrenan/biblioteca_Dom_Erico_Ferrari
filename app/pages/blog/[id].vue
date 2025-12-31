<script setup lang="ts">
import { NOTION_DBS, useNotion } from '~/composables/useNotion'

const route = useRoute()
const postId = route.params.id as string

const { data: posts, loading, error } = useNotion(NOTION_DBS.BLOG)

const post = computed(() => {
  return posts.value?.find((p: any) => p.id === postId)
})

useSeoMeta({
  title: () => post.value?.titulo ? `${post.value.titulo} - GrandTour` : 'Carregando...',
})
</script>

<template>
  <div class="post-page">
    <div v-if="loading && !post" class="container loading-state">
      <Icon name="lucide:loader-2" class="animate-spin" size="40" />
      <p>Carregando artigo...</p>
    </div>

    <div v-else-if="!post" class="container error-state">
      <h1>Artigo não encontrado</h1>
      <NuxtLink to="/blog" class="btn">Voltar para o Blog</NuxtLink>
    </div>

    <article v-else>
      <header class="post-header">
        <div class="container">
          <div class="post-meta">
            <span class="category">{{ post.categoria || post.tags }}</span>
            <span class="date">{{ post.data }}</span>
          </div>
          <h1>{{ post.titulo }}</h1>
          <div class="author" v-if="post.autor">
            <Icon name="lucide:user" size="16" /> Por {{ post.autor }}
          </div>
        </div>
        <div class="post-cover" v-if="post.imagem || post.capa">
          <img :src="post.imagem || post.capa" :alt="post.titulo">
        </div>
      </header>

      <div class="container post-container">
        <p class="lead" v-if="post.resumo">{{ post.resumo }}</p>
        
        <hr class="divider" />

        <div class="article-content">
          {{ post.artigo }}
        </div>

        <div class="post-footer">
            <NuxtLink to="/blog" class="back-link">
            <Icon name="lucide:arrow-left" /> Voltar para o Blog
            </NuxtLink>
        </div>
      </div>
    </article>
  </div>
</template>

<style scoped>
/* Estados de Carregamento e Erro */
.loading-state, .error-state { padding: 4rem 0; text-align: center; }

/* Cabeçalho */
.post-header { background: #f8fafc; padding: 4rem 0 0; text-align: center; }
.post-header h1 { font-size: clamp(2rem, 4vw, 3rem); margin: 1rem 0; color: #1a1a1a; line-height: 1.2; }
.post-meta { color: var(--color-primary); font-weight: 600; display: flex; gap: 1rem; justify-content: center; text-transform: uppercase; font-size: 0.85rem; letter-spacing: 1px; }
.author { display: flex; align-items: center; justify-content: center; gap: 0.5rem; color: #666; margin-top: 1rem; }

/* Capa */
.post-cover { margin-top: 3rem; height: 450px; width: 100%; overflow: hidden; }
.post-cover img { width: 100%; height: 100%; object-fit: cover; }

/* Container do Texto */
.post-container { max-width: 760px; margin: 0 auto; padding: 3rem 1.5rem; }

/* Tipografia do Artigo */
.lead { 
  font-size: 1.35rem; 
  line-height: 1.6; 
  color: #334155; 
  margin-bottom: 2rem; 
  font-weight: 500;
}

.divider {
  border: 0;
  height: 1px;
  background: #e2e8f0;
  margin: 2rem 0;
}

.article-content {
  /* O segredo para texto simples parecer formatado: */
  white-space: pre-wrap; /* Respeita os 'Enter' dados no Notion */
  font-family: 'Merriweather', 'Georgia', serif; /* Fontes serifadas são melhores para leitura longa */
  font-size: 1.125rem;
  line-height: 1.8;
  color: #1e293b;
}

/* Espaçamento extra se houver quebras de parágrafo duplas */
.article-content :deep(p) {
    margin-bottom: 1.5rem;
}

/* Footer do Post */
.post-footer {
    margin-top: 4rem;
    padding-top: 2rem;
    border-top: 1px solid #e2e8f0;
}

.back-link { 
  display: inline-flex; 
  align-items: center; 
  gap: 0.5rem; 
  text-decoration: none; 
  color: var(--color-primary); 
  font-weight: 600; 
  transition: transform 0.2s;
}

.back-link:hover {
    transform: translateX(-5px);
}
</style>