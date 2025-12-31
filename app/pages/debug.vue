<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

useSeoMeta({
  title: 'Debug Notion - GrandTour'
})

// Usando as chaves semânticas que definimos
const blog = useNotion(NOTION_DBS.BLOG)
const trips = useNotion(NOTION_DBS.TRIPS)
const reviews = useNotion(NOTION_DBS.REVIEWS)
const partners = useNotion(NOTION_DBS.PARTNERS)
const team = useNotion(NOTION_DBS.TEAM)
const settings = useNotion(NOTION_DBS.SETTINGS)
</script>

<template>
  <div class="debug-page">
    <div class="container">
      <h1>Debug Notion Databases</h1>
      <p>Verifique abaixo se o conteúdo corresponde ao título da seção. Se estiver trocado, ajuste o ID no arquivo .env.</p>

      <div class="db-section">
        <h2>Blog (ID: {{ NOTION_DBS.BLOG || 'Não definido' }})</h2>
        <p v-if="blog.loading.value">Carregando...</p>
        <p v-else-if="blog.error.value" class="error">Erro: {{ blog.error.value }}</p>
        <div v-else>
          <p><strong>Total:</strong> {{ blog.data.value.length }}</p>
          <pre>{{ JSON.stringify(blog.data.value[0], null, 2) }}</pre>
        </div>
      </div>

      <div class="db-section">
        <h2>Viagens (ID: {{ NOTION_DBS.TRIPS || 'Não definido' }})</h2>
        <p v-if="trips.loading.value">Carregando...</p>
        <p v-else-if="trips.error.value" class="error">Erro: {{ trips.error.value }}</p>
        <div v-else>
          <p><strong>Total:</strong> {{ trips.data.value.length }}</p>
          <pre>{{ JSON.stringify(trips.data.value[0], null, 2) }}</pre>
        </div>
      </div>

      <div class="db-section">
        <h2>Equipe (ID: {{ NOTION_DBS.TEAM || 'Não definido' }})</h2>
        <p v-if="team.loading.value">Carregando...</p>
        <div v-else>
          <pre>{{ JSON.stringify(team.data.value[0], null, 2) }}</pre>
        </div>
      </div>
      
       <div class="db-section">
        <h2>Configurações (ID: {{ NOTION_DBS.SETTINGS || 'Não definido' }})</h2>
        <p v-if="settings.loading.value">Carregando...</p>
        <div v-else>
          <pre>{{ JSON.stringify(settings.data.value, null, 2) }}</pre>
        </div>
      </div>

    </div>
  </div>
</template>

<style scoped>
/* Seu CSS estava ótimo, mantive igual */
.debug-page { padding: 2rem 0; min-height: 100vh; background: #f5f5f5; }
.container { max-width: 1200px; margin: 0 auto; padding: 0 1rem; }
h1 { margin-bottom: 1rem; }
.db-section { background: white; padding: 1.5rem; border-radius: 8px; margin-bottom: 2rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
.db-section h2 { font-size: 1.2rem; color: #0056b3; margin-bottom: 1rem; text-transform: uppercase; font-weight: 700; }
pre { background: #1a1a2e; color: #0f9; padding: 1rem; border-radius: 4px; overflow-x: auto; font-size: 0.85rem; max-height: 300px; }
.error { color: red; font-weight: bold; }
</style>