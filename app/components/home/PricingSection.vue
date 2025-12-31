<script setup lang="ts">
const plans = ref([
  {
    name: 'Básico',
    price: 'R$ 2.990',
    description: 'Perfeito para viagens curtas',
    features: [
      'Hospedagem 3 estrelas',
      'Café da manhã incluso',
      'Guia local',
      'Passeios em grupo'
    ],
    recommended: false
  },
  {
    name: 'Premium',
    price: 'R$ 5.990',
    description: 'A escolha mais popular',
    features: [
      'Hospedagem 4-5 estrelas',
      'Pensão completa',
      'Guia exclusivo',
      'Passeios privados',
      'Seguro viagem completo',
      'Transfers VIP'
    ],
    recommended: true
  },
  {
    name: 'Luxo',
    price: 'R$ 12.990',
    description: 'Experiência inesquecível',
    features: [
      'Hotéis boutique exclusivos',
      'Todas as refeições gourmet',
      'Guia pessoal 24h',
      'Experiências VIP',
      'Seguro premium',
      'Transfers de helicóptero',
      'Concierge dedicado'
    ],
    recommended: false
  }
])
</script>

<template>
  <section class="pricing">
    <div class="container">
      <h2 class="section-title">Nossos Planos</h2>
      <p class="section-subtitle">Escolha o plano ideal para sua próxima aventura</p>
      
      <div class="pricing-grid">
        <div 
          v-for="plan in plans" 
          :key="plan.name" 
          class="pricing-card"
          :class="{ recommended: plan.recommended }"
        >
          <div v-if="plan.recommended" class="recommended-badge">
            Mais Popular
          </div>
          <h3 class="plan-name">{{ plan.name }}</h3>
          <p class="plan-description">{{ plan.description }}</p>
          <div class="plan-price">
            <span class="price">{{ plan.price }}</span>
            <span class="period">por pessoa</span>
          </div>
          <ul class="plan-features">
            <li v-for="feature in plan.features" :key="feature">
              <Icon name="lucide:check" size="18" class="check-icon" />
              {{ feature }}
            </li>
          </ul>
          <NuxtLink to="/viagens" class="btn" :class="plan.recommended ? 'btn-secondary' : 'btn-primary'">
            Escolher Plano
          </NuxtLink>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.section-subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-top: -2rem;
  margin-bottom: 3rem;
}

.pricing-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  align-items: start;
}

.pricing-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem;
  text-align: center;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  position: relative;
  transition: transform 0.3s ease;
}

.pricing-card:hover {
  transform: translateY(-5px);
}

.pricing-card.recommended {
  background: linear-gradient(135deg, var(--color-primary) 0%, var(--color-accent) 100%);
  color: white;
  transform: scale(1.05);
  z-index: 1;
}

.pricing-card.recommended:hover {
  transform: scale(1.05) translateY(-5px);
}

.recommended-badge {
  position: absolute;
  top: -12px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--color-secondary);
  color: var(--color-primary);
  padding: 0.4rem 1.2rem;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
}

.plan-name {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.recommended .plan-name {
  color: white;
}

.plan-description {
  opacity: 0.8;
  margin-bottom: 1.5rem;
}

.plan-price {
  margin-bottom: 2rem;
}

.price {
  display: block;
  font-family: var(--font-heading);
  font-size: 2.5rem;
  font-weight: 700;
}

.recommended .price {
  color: var(--color-secondary);
}

.period {
  font-size: 0.9rem;
  opacity: 0.7;
}

.plan-features {
  list-style: none;
  text-align: left;
  margin-bottom: 2rem;
}

.plan-features li {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
}

.recommended .plan-features li {
  border-color: rgba(255, 255, 255, 0.1);
}

.check-icon {
  color: var(--color-secondary);
  flex-shrink: 0;
}

.pricing-card .btn {
  width: 100%;
}

@media (max-width: 1024px) {
  .pricing-grid {
    grid-template-columns: 1fr;
    max-width: 400px;
    margin: 0 auto;
  }

  .pricing-card.recommended {
    transform: none;
  }

  .pricing-card.recommended:hover {
    transform: translateY(-5px);
  }
}
</style>
