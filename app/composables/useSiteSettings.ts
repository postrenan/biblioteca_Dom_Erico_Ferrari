interface SiteSettings {
  empresa_nome: string
  empresa_slogan: string
  empresa_descricao: string
  email_contato: string
  telefone: string
  whatsapp: string
  endereco: string
  instagram: string
  facebook: string
  youtube: string
  logo_url: string
  hero_imagem: string
  sobre_imagem: string
  anos_experiencia: string
  viagens_realizadas: string
  clientes_satisfeitos: string
  destinos: string
  [key: string]: string
}

export function useSiteSettings() {
  const settings = useState<SiteSettings>('siteSettings', () => ({
    empresa_nome: 'GrandTour',
    empresa_slogan: 'Transformando sonhos em destinos inesquecíveis',
    empresa_descricao: '',
    email_contato: 'contato@grandtour.com.br',
    telefone: '(11) 99999-9999',
    whatsapp: '5511999999999',
    endereco: 'São Paulo, SP',
    instagram: '',
    facebook: '',
    youtube: '',
    logo_url: '',
    hero_imagem: '',
    sobre_imagem: '',
    anos_experiencia: '14',
    viagens_realizadas: '500',
    clientes_satisfeitos: '10000',
    destinos: '50'
  }))

  const loading = ref(false)
  const fetched = ref(false)

  const fetch = async () => {
    if (fetched.value) return
    
    loading.value = true
    try {
      const response = await $fetch<{ success: boolean; data: SiteSettings }>('/api/settings')
      if (response.success && response.data) {
        // Merge com valores padrão
        Object.assign(settings.value, response.data)
      }
      fetched.value = true
    } catch (e) {
      console.error('Error fetching settings:', e)
    } finally {
      loading.value = false
    }
  }

  // Auto-fetch on first use
  if (!fetched.value) {
    fetch()
  }

  return {
    settings,
    loading,
    refresh: fetch
  }
}
