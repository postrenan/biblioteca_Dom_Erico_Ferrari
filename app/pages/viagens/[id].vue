<script setup lang="ts">
import { NOTION_DBS } from '~/composables/useNotion'

const route = useRoute()
const tripId = route.params.id as string

const { data: trips, loading } = useNotion(NOTION_DBS.DB_1)

const trip = computed(() => {
  if (!trips.value) return null
  return trips.value.find((t: any) => t.id === tripId)
})

const formatPrice = (price: string | number) => {
  const num = typeof price === 'string' ? parseFloat(price) : price
  if (isNaN(num)) return price
  return `R$ ${num.toLocaleString('pt-BR')}`
}

useSeoMeta({
  title: computed(() => trip.value ? `${trip.value.nome} - GrandTour` : 'Viagem - GrandTour'),
  description: computed(() => trip.value?.descricao || 'Detalhes da viagem')
})
</script>

<template>
  <div class="trip-detail-page">
    <div v-if="loading" class="loading-state">
      <div class="loader"></div>
      <p>Carregando detalhes da viagem...</p>
    </div>

    <template v-else-if="trip">
      <!-- Hero -->
      <section class="trip-hero" :style="{ backgroundImage: `url(${trip.imagem || ''})` }">
        <div class="trip-hero-overlay"></div>
        <div class="container trip-hero-content">
          <span class="trip-category">{{ trip.categoria || 'Viagem' }}</span>
          <h1>{{ trip.nome }}</h1>
          <p class="trip-location">
            <Icon name="lucide:map-pin" /> {{ trip.destino }}
          </p>
        </div>
      </section>

      <!-- Main Content -->
      <section class="trip-content-section">
        <div class="container content-grid">
          <!-- Left Column: Details -->
          <div class="details-col">
            <div class="info-card">
              <div class="info-item">
                <Icon name="lucide:calendar" size="24" />
                <div>
                  <h4>Data de Início</h4>
                  <p>{{ trip.data_início }}</p>
                </div>
              </div>
              <div class="info-item">
                <Icon name="lucide:clock" size="24" />
                <div>
                  <h4>Duração</h4>
                  <p>{{ trip.duração || trip.duracao }}</p>
                </div>
              </div>
              <div class="info-item">
                <Icon name="lucide:users" size="24" />
                <div>
                  <h4>Vagas (Spots)</h4>
                  <p>{{ trip.vagas }} vagas restantes</p>
                </div>
              </div>
              <div class="info-item price-item">
                <Icon name="lucide:tag" size="24" />
                <div>
                  <h4>Preço por Pessoa</h4>
                  <p class="price">{{ formatPrice(trip.preço || trip.preco) }}</p>
                </div>
              </div>
            </div>

            <div class="description-box">
              <h2>Sobre a Viagem</h2>
              <p class="description-text">{{ trip.descricao }}</p>
            </div>
            
            <!-- Can verify if rich text content exists later -->
          </div>

          <!-- Right Column: Booking Box -->
          <div class="booking-col">
            <div class="booking-card">
              <h3>Reserve sua vaga</h3>
              <p>Garanta seu lugar nessa experiência única.</p>
              <div class="price-display">
                <span class="label">Total</span>
                <span class="value">{{ formatPrice(trip.preço || trip.preco) }}</span>
              </div>
              
              <NuxtLink to="/#plan-builder" class="btn btn-primary btn-block">
                Solicitar Reserva
              </NuxtLink>
              <p class="booking-note">Fale com um consultor para personalizar seu pacote.</p>
            </div>
          </div>
        </div>
      </section>
    </template>

    <div v-else class="not-found">
      <h2>Viagem não encontrada</h2>
      <NuxtLink to="/viagens" class="btn btn-primary">Voltar para Viagens</NuxtLink>
    </div>
  </div>
</template>

<style scoped>
.loading-state, .not-found {
  min-height: 60vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  padding-top: 80px;
}

.trip-hero {
  position: relative;
  height: 60vh;
  min-height: 400px;
  background-size: cover;
  background-position: center;
  display: flex;
  align-items: flex-end;
  padding-bottom: 4rem;
  color: white;
}

.trip-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(to bottom, rgba(0,0,0,0.2), rgba(0,0,0,0.8));
}

.trip-hero-content {
  position: relative;
  z-index: 10;
}

.trip-category {
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 0.4rem 1rem;
  border-radius: 20px;
  font-weight: 600;
  display: inline-block;
  margin-bottom: 1rem;
  text-transform: uppercase;
  font-size: 0.8rem;
}

.trip-hero h1 {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 0.5rem;
  line-height: 1.1;
}

.trip-location {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  opacity: 0.9;
}

.trip-content-section {
  padding: 4rem 0;
  background: #f8fafc;
}

.content-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 3rem;
}

.info-card {
  background: white;
  border-radius: 16px;
  padding: 2rem;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  box-shadow: 0 4px 20px rgba(0,0,0,0.05);
  margin-bottom: 2rem;
}

.info-item {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.info-item h4 {
  font-size: 0.9rem;
  color: var(--color-text-light);
  margin-bottom: 0.2rem;
}

.info-item p {
  font-weight: 600;
  color: var(--color-text);
  font-size: 1.1rem;
}

.info-item.price-item p {
  color: var(--color-primary);
  font-size: 1.3rem;
}

.description-box h2 {
  font-size: 1.8rem;
  margin-bottom: 1.5rem;
  color: var(--color-primary);
}

.description-text {
  line-height: 1.8;
  color: var(--color-text);
  font-size: 1.1rem;
  white-space: pre-line;
}

.booking-card {
  background: white;
  padding: 2rem;
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0,0,0,0.08);
  position: sticky;
  top: 100px;
}

.booking-card h3 {
  margin-bottom: 0.5rem;
  color: var(--color-primary);;
}

.price-display {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 1.5rem 0;
  padding: 1rem 0;
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.price-display .value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
}

.btn-block {
  width: 100%;
  text-align: center;
  display: block;
}

.booking-note {
  font-size: 0.8rem;
  color: var(--color-text-light);
  text-align: center;
  margin-top: 1rem;
}

@media (max-width: 900px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .info-card {
    grid-template-columns: 1fr;
  }
}
</style>
