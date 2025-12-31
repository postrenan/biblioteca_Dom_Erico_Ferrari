<script setup lang="ts">
import { NOTION_DBS, useNotion } from '~/composables/useNotion'

useSeoMeta({
  title: 'Blog - GrandTour',
  description: 'Dicas de viagem, destinos incríveis e histórias para sua próxima aventura.'
})

// Usa a chave correta BLOG
const { data: posts, loading, error } = useNotion(NOTION_DBS.BLOG)

// Computed segura: verifica se posts.value existe antes de tentar acessar o índice 0
const featuredPost = computed(() => {
  return (posts.value && posts.value.length > 0) ? posts.value[0] : null
})

const otherPosts = computed(() => {
  return (posts.value && posts.value.length > 1) ? posts.value.slice(1) : []
})

// Newsletter Logic
const newsletterEmail = ref('')
const newsletterLoading = ref(false)
const newsletterSuccess = ref(false)
const newsletterError = ref(false)

const subscribeNewsletter = async () => {
  if (!newsletterEmail.value) return

  newsletterLoading.value = true
  newsletterSuccess.value = false
  newsletterError.value = false

  try {
    const response = await $fetch<{ success: boolean }>('/api/send-email', {
      method: 'POST',
      body: { email: newsletterEmail.value }
    })
    
    if (response.success) {
      newsletterSuccess.value = true
      newsletterEmail.value = ''
    }
  } catch (error) {
    console.error('Newsletter error:', error)
    newsletterError.value = true
  } finally {
    newsletterLoading.value = false
  }
}
</script>

<template>
  <div class="blog-page">
    
    <section class="blog-hero">
      <div class="container blog-hero-content">
        <h1>Blog GrandTour</h1>
        <p>Inspiração, dicas e histórias para sua próxima aventura</p>
      </div>
    </section>

    <div v-if="loading" class="container" style="padding: 4rem 0; text-align: center;">
      <Icon name="lucide:loader-2" class="animate-spin" size="40" />
      <p>Carregando as melhores histórias...</p>
    </div>

    <div v-else-if="error" class="container" style="padding: 4rem 0; text-align: center; color: red;">
      <p>Ops! Não conseguimos carregar o blog no momento.</p>
      <small>{{ error }}</small>
    </div>

    <div v-else>
        <section class="featured-section" v-if="featuredPost">
          <div class="container">
            <article class="featured-post">
              <div class="featured-image">
                <img :src="featuredPost.imagem || featuredPost.capa || 'https://placehold.co/600x400?text=GrandTour'" :alt="featuredPost.titulo" />
                <span class="featured-badge">Destaque</span>
              </div>
              <div class="featured-content">
                <div class="post-meta">
                  <span class="post-category">{{ featuredPost.categoria || featuredPost.tags || 'Viagem' }}</span>
                  <span class="post-date">{{ featuredPost.data }}</span>
                </div>
                <h2>{{ featuredPost.titulo }}</h2>
                <p>{{ featuredPost.resumo }}</p>
                <div class="post-footer">
                  <span class="post-author" v-if="featuredPost.autor">
                    <Icon name="lucide:user" size="14" />
                    {{ featuredPost.autor }}
                  </span>
                  <span class="post-read-time" v-if="featuredPost.tempo_leitura">
                    <Icon name="lucide:clock" size="14" />
                    {{ featuredPost.tempo_leitura }}
                  </span>
                </div>
                <NuxtLink :to="`/blog/${featuredPost.id}`" class="btn btn-primary">
                  Ler Artigo
                </NuxtLink>
              </div>
            </article>
          </div>
        </section>

        <section class="posts-section" v-if="otherPosts.length > 0">
          <div class="container">
            <h2 class="section-title">Últimos Artigos</h2>
            <div class="posts-grid">
              <article v-for="post in otherPosts" :key="post.id" class="post-card">
                <div class="post-image">
                  <img :src="post.imagem || post.capa || 'https://placehold.co/600x400?text=Post'" :alt="post.titulo" />
                  <span class="post-category-badge">{{ post.categoria || post.tags || 'Dicas' }}</span>
                </div>
                <div class="post-card-content">
                  <span class="post-date">{{ post.data }}</span>
                  <h3>{{ post.titulo }}</h3>
                  <p>{{ post.resumo }}</p>
                  <div class="post-card-footer">
                    <span class="post-author" v-if="post.autor">
                      <Icon name="lucide:user" size="14" />
                      {{ post.autor }}
                    </span>
                    <NuxtLink :to="`/blog/${post.id}`" class="read-more">
                      Ler mais <Icon name="lucide:arrow-right" size="14" />
                    </NuxtLink>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </section>
    </div>

    <section class="newsletter-section">
       <div class="container newsletter-content">
        <div class="newsletter-text">
          <h2>Receba Novidades</h2>
          <p>Inscreva-se para receber dicas de viagem e ofertas exclusivas no seu email.</p>
        </div>
        <form class="newsletter-form" @submit.prevent="subscribeNewsletter">
          <input v-model="newsletterEmail" type="email" placeholder="Seu melhor email" required :disabled="newsletterLoading" />
          <button type="submit" class="btn btn-primary" :disabled="newsletterLoading">
            {{ newsletterLoading ? 'Enviando...' : 'Inscrever' }}
          </button>
        </form>
        <p v-if="newsletterSuccess" class="success-msg">Inscrição realizada com sucesso!</p>
        <p v-if="newsletterError" class="error-msg">Erro ao inscrever. Tente novamente.</p>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Adicione esta classe ao seu CSS existente para o botão */
.btn-primary {
  display: inline-block;
  background: var(--color-primary, #0056b3); /* Fallback color */
  color: white;
  padding: 0.8rem 1.5rem;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  border: none;
  cursor: pointer;
  transition: opacity 0.2s;
}
.btn-primary:hover { opacity: 0.9; }

/* ... Mantenha todo o seu CSS anterior aqui, ele estava ótimo ... */
/* Apenas certifique-se de que --color-primary está definido no main.css ou :root */
.blog-hero {
  background: linear-gradient(135deg, var(--color-primary, #0056b3), var(--color-accent, #00a8e8));
  color: white;
  padding: 6rem 0;
  text-align: center;
}
/* ... resto do CSS ... */
/* Copie o resto do seu CSS original */
.featured-section { padding: 4rem 0; background: white; }
.featured-post { display: grid; grid-template-columns: 1.2fr 1fr; gap: 3rem; align-items: center; background: #f8fafc; border-radius: 20px; overflow: hidden; }
.featured-image { position: relative; height: 400px; }
.featured-image img { width: 100%; height: 100%; object-fit: cover; }
.featured-badge { position: absolute; top: 1rem; left: 1rem; background: var(--color-secondary, #ffc107); color: var(--color-primary, #000); padding: 0.4rem 1rem; border-radius: 20px; font-weight: 600; font-size: 0.9rem; }
.featured-content { padding: 2rem; }
.post-meta { display: flex; align-items: center; gap: 1rem; margin-bottom: 1rem; }
.post-category { background: var(--color-primary, #0056b3); color: white; padding: 0.3rem 0.8rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; }
.post-date { color: #666; font-size: 0.9rem; }
.featured-content h2 { font-size: 1.8rem; margin-bottom: 1rem; color: #333; }
.featured-content p { color: #666; line-height: 1.8; margin-bottom: 1.5rem; }
.post-footer { display: flex; gap: 1.5rem; margin-bottom: 1.5rem; color: #666; font-size: 0.9rem; }
.post-footer span { display: flex; align-items: center; gap: 0.3rem; }
.posts-section { padding: 4rem 0; background: #f8fafc; }
.posts-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 2rem; }
.post-card { background: white; border-radius: 16px; overflow: hidden; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease, box-shadow 0.3s ease; }
.post-card:hover { transform: translateY(-5px); box-shadow: 0 12px 30px rgba(0, 86, 179, 0.1); }
.post-image { position: relative; height: 180px; }
.post-image img { width: 100%; height: 100%; object-fit: cover; }
.post-category-badge { position: absolute; bottom: 1rem; left: 1rem; background: var(--color-primary, #0056b3); color: white; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; font-weight: 600; }
.post-card-content { padding: 1.5rem; }
.post-card-content .post-date { display: block; margin-bottom: 0.5rem; }
.post-card-content h3 { font-size: 1.1rem; margin-bottom: 0.8rem; color: #333; line-height: 1.4; }
.post-card-content p { font-size: 0.9rem; color: #666; line-height: 1.6; margin-bottom: 1rem; display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
.post-card-footer { display: flex; justify-content: space-between; align-items: center; }
.post-author { display: flex; align-items: center; gap: 0.3rem; font-size: 0.85rem; color: #666; }
.read-more { display: flex; align-items: center; gap: 0.3rem; color: var(--color-primary, #0056b3); font-weight: 600; font-size: 0.9rem; }
.read-more:hover { color: var(--color-secondary, #ffc107); }
.newsletter-section { background: linear-gradient(135deg, var(--color-primary, #0056b3), var(--color-accent, #00a8e8)); padding: 4rem 0; }
.newsletter-content { display: flex; align-items: center; justify-content: space-between; gap: 2rem; }
.newsletter-text h2 { color: white; margin-bottom: 0.5rem; }
.newsletter-text p { color: rgba(255, 255, 255, 0.9); }
.newsletter-form { display: flex; gap: 1rem; }
.newsletter-form input { padding: 0.8rem 1.2rem; border: none; border-radius: 8px; font-size: 1rem; min-width: 300px; }
.newsletter-form input:focus { outline: 2px solid var(--color-secondary, #ffc107); }
.success-msg { color: #4ade80; margin-top: 1rem; font-weight: bold; }
.error-msg { color: #f87171; margin-top: 1rem; font-weight: bold; }

@media (max-width: 1024px) { .posts-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .featured-post { grid-template-columns: 1fr; } .featured-image { height: 250px; } .posts-grid { grid-template-columns: 1fr; } .newsletter-content { flex-direction: column; text-align: center; } .newsletter-form { flex-direction: column; width: 100%; } .newsletter-form input { min-width: 100%; } }
</style>