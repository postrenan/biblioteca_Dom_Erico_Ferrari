// server/api/notion.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const dbId = query.db as string
  
  if (!dbId) {
    throw createError({
      statusCode: 400,
      message: 'Database ID is required'
    })
  }

  const config = useRuntimeConfig()
  const token = config.notionToken 

  if (!token) {
     console.error('❌ ERRO: Token do Notion não encontrado em runtimeConfig.notionToken')
     throw createError({
      statusCode: 500,
      message: 'NOTION_TOKEN is missing in runtimeConfig'
    })
  }

  console.log(`🔍 Buscando no Notion DB: ${dbId} | Token presente: ${!!token}`)

  try {
    const response = await $fetch(`https://api.notion.com/v1/databases/${dbId}/query`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': '2022-06-28',
        'Content-Type': 'application/json'
      },
      body: {
        page_size: 100,
        // MELHORIA: Ordena automaticamente pelos mais recentes
        sorts: [
          {
            timestamp: 'created_time',
            direction: 'descending'
          }
        ]
      }
    }) as any

    const items = response.results.map((page: any) => {
      const props = page.properties
      const item: Record<string, any> = {
        id: page.id
      }

      // Map all properties dynamically
      for (const [key, value] of Object.entries(props)) {
        item[key.toLowerCase().replace(/\s+/g, '_')] = getTextValue(value as any)
      }

      return item
    })

    return { success: true, data: items }
  } catch (error: any) {
    console.error('Notion API Error:', error)
    throw createError({
      statusCode: error.response?.status || 500,
      message: error.data?.message || error.message || 'Failed to fetch from Notion'
    })
  }
})

function getTextValue(prop: any): any {
  if (!prop) return ''
  
  // Textos (Title e Rich Text)
  // CORREÇÃO CRÍTICA: Percorre o array inteiro e junta os textos
  // Antes pegava só o [0], cortando textos com formatação
  if (prop.title) {
    return prop.title.map((t: any) => t.plain_text).join('')
  }
  if (prop.rich_text) {
    return prop.rich_text.map((t: any) => t.plain_text).join('')
  }
  
  // Seletores
  if (prop.select) return prop.select?.name || ''
  if (prop.multi_select) return prop.multi_select.map((t: any) => t.name) // Retorna array de strings
  
  // Números e Booleanos
  if (prop.number !== undefined) return prop.number
  if (prop.checkbox !== undefined) return prop.checkbox
  
  // Datas e Links
  if (prop.date) return prop.date?.start || ''
  if (prop.url) return prop.url || ''
  if (prop.email) return prop.email || ''
  if (prop.phone_number) return prop.phone_number || ''
  
  // Arquivos/Imagens
  if (prop.files && prop.files.length > 0) {
    const file = prop.files[0]
    return file.file?.url || file.external?.url || ''
  }
  
  return ''
}