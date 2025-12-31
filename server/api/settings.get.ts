
// ID do banco de configurações do site (Definido em .env para segurança ou facilidade de troca)
const SETTINGS_DATABASE_ID = process.env.NOTION_SETTINGS_DB || ''

export default defineEventHandler(async (_event) => {
  // Ensure DB ID is present
  if (!SETTINGS_DATABASE_ID) {
    console.warn('⚠️ Settings DB ID not configured')
     return {
      success: true,
      data: {
        empresa_nome: 'GrandTour',
        empresa_slogan: 'Transformando sonhos em destinos inesquecíveis'
      }
    }
  }

  const config = useRuntimeConfig()
  const token = config.notionToken || process.env.NOTION_TOKEN

  if (!token) {
    console.error('❌ Notion Token missing in settings.get.ts')
    return { success: false, message: 'Notion Token missing' }
  }

  try {
    const response = await $fetch(`https://api.notion.com/v1/databases/${SETTINGS_DATABASE_ID}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: { page_size: 100 }
    }) as any

    // Helper (Duplicate from notion.ts since we can't import easily across server routes)
    function getTextValue(prop: any): any {
      if (!prop) return ''
      if (prop.title) return prop.title.map((t: any) => t.plain_text).join('')
      if (prop.rich_text) return prop.rich_text.map((t: any) => t.plain_text).join('')
      if (prop.select) return prop.select?.name || ''
      if (prop.multi_select) return prop.multi_select.map((t: any) => t.name)
      if (prop.number !== undefined) return prop.number
      if (prop.checkbox !== undefined) return prop.checkbox
      if (prop.date) return prop.date?.start || ''
      if (prop.url) return prop.url || ''
      if (prop.email) return prop.email || ''
      if (prop.phone_number) return prop.phone_number || ''
      if (prop.files && prop.files.length > 0) {
        const file = prop.files[0]
        return file.file?.url || file.external?.url || ''
      }
      return ''
    }

    // Converte as configurações em um objeto chave-valor
    const settings: Record<string, string> = {}
    
    response.results.forEach((page: any) => {
      const props = page.properties
      const chave = getTextValue(props['Chave'] || props['chave'] || props['Nome'] || props['nome'])
      const valor = getTextValue(props['Valor'] || props['valor'])
      
      if (chave) {
        settings[chave.toLowerCase().replace(/\s+/g, '_')] = valor
      }
    })

    return { success: true, data: settings }
  } catch (error: any) {
    console.error('Notion Settings API Error:', error)
    // Retorna configurações padrão em caso de erro
    return {
      success: true,
      data: {
        empresa_nome: 'GrandTour',
        email_contato: 'contato@grandtour.com.br',
        telefone: '(11) 99999-9999'
      }
    }
  }
})
