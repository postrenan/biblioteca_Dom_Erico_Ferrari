<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

useSeoMeta({
  title: 'Sobre Nós - GrandTour',
  description: 'Conheça a história da GrandTour, nossa missão e a equipe que faz suas viagens acontecerem.'
})

// Assumindo que useSiteSettings retorna um ref reativo. 
// Se não, certifique-se de que 'settings' é reativo (ref ou computed).
const { settings } = useSiteSettings()

// ATUALIZAÇÃO: Usando a chave semântica 'TEAM' definida no composable
const { data: notionTeam, loading } = useNotion(NOTION_DBS.TEAM)

const team = computed(() => {
  if (notionTeam.value && notionTeam.value.length > 0) {
    // Filtra apenas quem tem cargo definido
    const dbTeam = notionTeam.value.filter((p: any) => p.cargo || p.role)
    if (dbTeam.length > 0) return dbTeam
  }
  return []
})

// Computed para tratar o texto com segurança (evita erro de split em undefined)
const historyParagraphs = computed(() => {
  const text = settings.value?.historia_texto || ''
  return text ? text.split('\n').filter((p: string) => p.trim() !== '') : []
})
</script>

<template>
  <div class="about-page">
    <section class="about-hero">
      <div class="about-hero-overlay"></div>
      <div class="container about-hero-content">
        <h1>{{ settings?.historia_titulo || 'Nossa História' }}</h1>
        <p>{{ settings?.historia_subtitulo || 'Transformando sonhos em destinos desde 2010' }}</p>
      </div>
    </section>

    <section class="about-section">
      <div class="container about-grid">
        <div class="about-image">
          <img :src="settings?.imagem_sobre || 'https://images.unsplash.com/photo-1522199755839-a2bacb67c546?w=600&h=400&fit=crop'" alt="Sobre a GrandTour" />
          <div class="about-image-accent"></div>
        </div>
        <div class="about-content">
          <h2>Quem Somos</h2>
          
          <div class="about-text" v-if="historyParagraphs.length > 0">
             <p v-for="(paragraph, index) in historyParagraphs" :key="index">
               {{ paragraph }}
             </p>
          </div>
          
          <div v-else>
            <p>
              A <strong>GrandTour</strong> nasceu em 2010 da paixão de um grupo de amigos por explorar o mundo. 
              O que começou como um sonho compartilhado se transformou em uma das agências de turismo mais 
              respeitadas do Brasil.
            </p>
            <p>
              Nossa missão é proporcionar experiências de viagem únicas e memoráveis, cuidando de cada 
              detalhe para que nossos clientes possam aproveitar ao máximo cada momento longe de casa.
            </p>
            <p>
              Com mais de 500 viagens realizadas e mais de 10.000 clientes satisfeitos, continuamos 
              comprometidos com a excelência e a inovação no turismo.
            </p>
          </div>

          <div class="about-stats">
            <div class="about-stat">
              <span class="stat-number">{{ settings?.anos_experiencia || '14+' }}</span>
              <span class="stat-label">Anos de Experiência</span>
            </div>
            <div class="about-stat">
              <span class="stat-number">{{ settings?.destinos || '50+' }}</span>
              <span class="stat-label">Destinos</span>
            </div>
            <div class="about-stat">
              <span class="stat-number">{{ settings?.clientes_satisfeitos || '10k+' }}</span>
              <span class="stat-label">Clientes Felizes</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="values-section">
      <div class="container">
        <h2 class="section-title">Nossos Valores</h2>
        <div class="values-grid">
          <div class="value-card">
            <Icon name="lucide:heart" size="40" />
            <h3>Paixão</h3>
            <p>Amamos o que fazemos e isso se reflete em cada viagem que organizamos.</p>
          </div>
          <div class="value-card">
            <Icon name="lucide:shield" size="40" />
            <h3>Confiança</h3>
            <p>Transparência e honestidade são a base de todas as nossas relações.</p>
          </div>
          <div class="value-card">
            <Icon name="lucide:sparkles" size="40" />
            <h3>Excelência</h3>
            <p>Buscamos a perfeição em cada detalhe, do planejamento à execução.</p>
          </div>
          <div class="value-card">
            <Icon name="lucide:users" size="40" />
            <h3>Cuidado</h3>
            <p>Cada cliente é tratado como um membro da nossa família.</p>
          </div>
        </div>
      </div>
    </section>

    <section class="team-section">
      <div class="container">
        <h2 class="section-title">Nossa Equipe</h2>
        
        <div v-if="loading && team.length === 0" style="text-align:center; padding: 2rem;">
            <Icon name="lucide:loader-2" class="animate-spin" size="30" />
        </div>

        <div class="team-grid" v-else>
          <article v-for="member in team" :key="member.nome" class="team-card">
            <div class="team-image">
              <img :src="member.imagem || member.image || 'https://i.pravatar.cc/300'" :alt="member.nome" />
            </div>
            <div class="team-content">
              <h3>{{ member.nome }}</h3>
              <span class="team-role">{{ member.cargo || member.role }}</span>
              <p>{{ member.bio }}</p>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* O seu CSS estava perfeito, mantive exatamente igual. */
.about-hero { position: relative; height: 50vh; min-height: 400px; display: flex; align-items: center; justify-content: center; background: linear-gradient(135deg, var(--color-primary), var(--color-accent)); color: white; text-align: center; }
.about-hero-overlay { position: absolute; inset: 0; background: url('https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1200&h=600&fit=crop'); background-size: cover; background-position: center; opacity: 0.2; }
.about-hero-content { position: relative; z-index: 1; }
.about-hero h1 { font-size: clamp(2.5rem, 5vw, 4rem); color: white; margin-bottom: 1rem; }
.about-hero p { font-size: 1.25rem; opacity: 0.9; }
.about-section { padding: 6rem 0; background: white; }
.about-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 4rem; align-items: center; }
.about-image { position: relative; }
.about-image img { width: 100%; border-radius: 16px; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1); }
.about-image-accent { position: absolute; width: 100%; height: 100%; border: 3px solid var(--color-secondary); border-radius: 16px; top: 20px; left: 20px; z-index: -1; }
.about-content h2 { font-size: 2rem; margin-bottom: 1.5rem; }
.about-content p { margin-bottom: 1rem; color: #666; line-height: 1.8; }
.about-stats { display: flex; gap: 2rem; margin-top: 2rem; }
.about-stat { text-align: center; }
.about-stat .stat-number { display: block; font-family: var(--font-heading); font-size: 2rem; font-weight: 700; color: var(--color-primary); }
.about-stat .stat-label { font-size: 0.9rem; color: #666; }
.values-section { background: #f8fafc; padding: 6rem 0; }
.values-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 2rem; }
.value-card { text-align: center; padding: 2rem; background: white; border-radius: 16px; box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05); transition: transform 0.3s ease; }
.value-card:hover { transform: translateY(-5px); }
.value-card svg { color: var(--color-primary); margin-bottom: 1rem; }
.value-card h3 { font-size: 1.2rem; margin-bottom: 0.5rem; color: #333; }
.value-card p { font-size: 0.9rem; color: #666; }
.team-section { padding: 6rem 0; background: white; }
.team-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; }
.team-card { display: flex; gap: 1.5rem; padding: 1.5rem; background: #f8fafc; border-radius: 16px; transition: all 0.3s ease; }
.team-card:hover { box-shadow: 0 10px 30px rgba(0, 86, 179, 0.1); }
.team-image { flex-shrink: 0; }
.team-image img { width: 120px; height: 120px; border-radius: 12px; object-fit: cover; border: 3px solid var(--color-secondary); }
.team-content h3 { font-size: 1.2rem; margin-bottom: 0.2rem; color: #333; }
.team-role { display: inline-block; background: var(--color-secondary); color: var(--color-primary); font-size: 0.8rem; font-weight: 600; padding: 0.2rem 0.6rem; border-radius: 4px; margin-bottom: 0.8rem; }
.team-content p { font-size: 0.9rem; color: #666; line-height: 1.6; }

@media (max-width: 1024px) { .values-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 768px) { .about-grid { grid-template-columns: 1fr; gap: 2rem; } .about-image-accent { display: none; } .values-grid { grid-template-columns: 1fr; } .team-grid { grid-template-columns: 1fr; } .team-card { flex-direction: column; text-align: center; } .team-image { margin: 0 auto; } .about-stats { flex-wrap: wrap; justify-content: center; } }
</style>