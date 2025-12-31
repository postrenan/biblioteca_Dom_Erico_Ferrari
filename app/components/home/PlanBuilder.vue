<script setup lang="ts">
const form = reactive({
  nome: '',
  email: '',
  telefone: '',
  destino: '',
  dataInicio: '',
  dataFim: '',
  numPessoas: 1,
  orcamento: '',
  atrativos: [] as string[],
  observacoes: ''
})

const atrativosOpcoes = [
  'Praias paradisíacas',
  'Montanhas e trilhas',
  'Cidades históricas',
  'Gastronomia local',
  'Vida noturna',
  'Museus e cultura',
  'Aventura e esportes radicais',
  'Relaxamento e spa',
  'Safari e natureza selvagem',
  'Cruzeiros e passeios de barco'
]

const orcamentoOpcoes = [
  'Até R$ 3.000 por pessoa',
  'R$ 3.000 a R$ 6.000 por pessoa',
  'R$ 6.000 a R$ 10.000 por pessoa',
  'R$ 10.000 a R$ 15.000 por pessoa',
  'Acima de R$ 15.000 por pessoa',
  'Sem limite definido'
]

const loading = ref(false)
const success = ref(false)
const error = ref('')

const toggleAtrativo = (atrativo: string) => {
  const index = form.atrativos.indexOf(atrativo)
  if (index > -1) {
    form.atrativos.splice(index, 1)
  } else {
    form.atrativos.push(atrativo)
  }
}

const enviarPlano = async () => {
  loading.value = true
  error.value = ''
  
  try {
    await $fetch('/api/send-plan', {
      method: 'POST',
      body: form
    })
    success.value = true
  } catch (e: any) {
    error.value = e.message || 'Erro ao enviar. Tente novamente.'
  } finally {
    loading.value = false
  }
}

const resetForm = () => {
  success.value = false
  Object.assign(form, {
    nome: '',
    email: '',
    telefone: '',
    destino: '',
    dataInicio: '',
    dataFim: '',
    numPessoas: 1,
    orcamento: '',
    atrativos: [],
    observacoes: ''
  })
}
</script>

<template>
  <section class="plan-builder">
    <div class="container">
      <h2 class="section-title">Monte Seu Plano</h2>
      <p class="section-subtitle">Crie a viagem dos seus sonhos e nossa equipe entrará em contato!</p>

      <!-- Success Message -->
      <div v-if="success" class="success-message">
        <Icon name="lucide:check-circle" size="48" />
        <h3>Plano Enviado com Sucesso!</h3>
        <p>Nossa equipe entrará em contato em breve para tornar seu sonho realidade.</p>
        <button class="btn btn-primary" @click="resetForm">Criar Novo Plano</button>
      </div>

      <!-- Form -->
      <form v-else class="plan-form" @submit.prevent="enviarPlano">
        <!-- Contact Info -->
        <div class="form-section">
          <h3><Icon name="lucide:user" size="20" /> Seus Dados</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="nome">Nome Completo *</label>
              <input id="nome" v-model="form.nome" type="text" required placeholder="Seu nome" />
            </div>
            <div class="form-group">
              <label for="email">E-mail *</label>
              <input id="email" v-model="form.email" type="email" required placeholder="seu@email.com" />
            </div>
            <div class="form-group">
              <label for="telefone">Telefone/WhatsApp *</label>
              <input id="telefone" v-model="form.telefone" type="tel" required placeholder="(11) 99999-9999" />
            </div>
          </div>
        </div>

        <!-- Destination -->
        <div class="form-section">
          <h3><Icon name="lucide:map-pin" size="20" /> Destino dos Sonhos</h3>
          <div class="form-group full">
            <label for="destino">Para onde você quer ir? *</label>
            <input id="destino" v-model="form.destino" type="text" required 
              placeholder="Ex: Europa, Japão, Caribe, ou 'estou em dúvida'" />
          </div>
        </div>

        <!-- Dates and People -->
        <div class="form-section">
          <h3><Icon name="lucide:calendar" size="20" /> Quando e Quantos</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="dataInicio">Data de Ida</label>
              <input id="dataInicio" v-model="form.dataInicio" type="date" />
            </div>
            <div class="form-group">
              <label for="dataFim">Data de Volta</label>
              <input id="dataFim" v-model="form.dataFim" type="date" />
            </div>
            <div class="form-group">
              <label for="numPessoas">Número de Viajantes *</label>
              <input id="numPessoas" v-model="form.numPessoas" type="number" min="1" max="50" required />
            </div>
          </div>
        </div>

        <!-- Budget -->
        <div class="form-section">
          <h3><Icon name="lucide:wallet" size="20" /> Orçamento</h3>
          <div class="budget-options">
            <label 
              v-for="opcao in orcamentoOpcoes" 
              :key="opcao"
              :class="['budget-option', { selected: form.orcamento === opcao }]"
            >
              <input type="radio" v-model="form.orcamento" :value="opcao" />
              {{ opcao }}
            </label>
          </div>
        </div>

        <!-- Attractions -->
        <div class="form-section">
          <h3><Icon name="lucide:sparkles" size="20" /> O que você quer vivenciar?</h3>
          <div class="attractions-grid">
            <label 
              v-for="atrativo in atrativosOpcoes" 
              :key="atrativo"
              :class="['attraction-option', { selected: form.atrativos.includes(atrativo) }]"
              @click="toggleAtrativo(atrativo)"
            >
              <Icon :name="form.atrativos.includes(atrativo) ? 'lucide:check-circle' : 'lucide:circle'" size="18" />
              {{ atrativo }}
            </label>
          </div>
        </div>

        <!-- Notes -->
        <div class="form-section">
          <h3><Icon name="lucide:message-circle" size="20" /> Observações</h3>
          <div class="form-group full">
            <label for="observacoes">Algo mais que devemos saber?</label>
            <textarea id="observacoes" v-model="form.observacoes" rows="4"
              placeholder="Conte mais sobre o que você imagina para essa viagem..."></textarea>
          </div>
        </div>

        <!-- Error -->
        <p v-if="error" class="error-message">{{ error }}</p>

        <!-- Submit -->
        <div class="form-actions">
          <button type="submit" class="btn btn-secondary btn-lg" :disabled="loading">
            <Icon v-if="loading" name="lucide:loader-2" size="20" class="spin" />
            <Icon v-else name="lucide:send" size="20" />
            {{ loading ? 'Enviando...' : 'Enviar Meu Plano dos Sonhos' }}
          </button>
        </div>
      </form>
    </div>
  </section>
</template>

<style scoped>
.plan-builder {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
  padding: 5rem 0;
}

.section-subtitle {
  text-align: center;
  color: var(--color-text-light);
  margin-top: -2rem;
  margin-bottom: 3rem;
}

.success-message {
  text-align: center;
  background: white;
  padding: 4rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 86, 179, 0.1);
}

.success-message svg {
  color: #22c55e;
  margin-bottom: 1rem;
}

.success-message h3 {
  color: var(--color-text);
  margin-bottom: 0.5rem;
}

.success-message p {
  color: var(--color-text-light);
  margin-bottom: 2rem;
}

.plan-form {
  background: white;
  padding: 3rem;
  border-radius: 20px;
  box-shadow: 0 10px 40px rgba(0, 86, 179, 0.1);
}

.form-section {
  margin-bottom: 2.5rem;
  padding-bottom: 2rem;
  border-bottom: 1px solid #e2e8f0;
}

.form-section:last-of-type {
  border-bottom: none;
  margin-bottom: 1rem;
}

.form-section h3 {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.2rem;
  color: var(--color-primary);
  margin-bottom: 1.5rem;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group.full {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.form-group input,
.form-group textarea {
  padding: 0.8rem 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  border-color: var(--color-primary);
}

.budget-options {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.budget-option {
  display: flex;
  align-items: center;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.budget-option input {
  display: none;
}

.budget-option.selected {
  border-color: var(--color-secondary);
  background: rgba(255, 204, 0, 0.1);
}

.attractions-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
}

.attraction-option {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  border: 2px solid #e2e8f0;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.attraction-option.selected {
  border-color: var(--color-primary);
  background: rgba(0, 86, 179, 0.05);
  color: var(--color-primary);
}

.error-message {
  color: #ef4444;
  text-align: center;
  font-weight: 500;
  margin-bottom: 1rem;
}

.form-actions {
  text-align: center;
}

.btn-lg {
  padding: 1rem 2.5rem;
  font-size: 1.1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .plan-form {
    padding: 1.5rem;
  }

  .form-grid,
  .budget-options,
  .attractions-grid {
    grid-template-columns: 1fr;
  }
}
</style>
