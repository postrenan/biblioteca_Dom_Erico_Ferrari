import { Client } from '@notionhq/client'

const notion = new Client({
  auth: process.env.NOTION_TOKEN
})

// ID do banco de dados para salvar os leads (você precisa criar este banco no Notion)
const LEADS_DATABASE_ID = process.env.NOTION_LEADS_DB || ''

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  
  const { nome, email, telefone, destino, dataInicio, dataFim, numPessoas, orcamento, atrativos, observacoes } = body

  if (!nome || !email || !telefone || !destino) {
    throw createError({
      statusCode: 400,
      message: 'Por favor, preencha todos os campos obrigatórios.'
    })
  }

  // Formatar a mensagem do plano
  const planDetails = `
📍 Destino: ${destino}
📅 Datas: ${dataInicio || 'Flexível'} a ${dataFim || 'Flexível'}
👥 Viajantes: ${numPessoas}
💰 Orçamento: ${orcamento || 'Não definido'}
✨ Atrativos: ${atrativos.length > 0 ? atrativos.join(', ') : 'Não especificado'}
📝 Observações: ${observacoes || 'Nenhuma'}
  `.trim()

  try {
    // Se tiver banco de leads configurado, salvar no Notion
    if (LEADS_DATABASE_ID) {
      await notion.pages.create({
        parent: { database_id: LEADS_DATABASE_ID },
        properties: {
          'Nome': { title: [{ text: { content: nome } }] },
          'Email': { email: email },
          'Telefone': { phone_number: telefone },
          'Destino': { rich_text: [{ text: { content: destino } }] },
          'Pessoas': { number: numPessoas },
          'Orçamento': { select: { name: orcamento || 'Não definido' } },
          'Status': { select: { name: 'Novo' } }
        }
      })
    }

    // Enviar email usando serviço externo (você pode configurar depois)
    // Por enquanto, apenas logamos e retornamos sucesso
    console.log('=== NOVO PLANO RECEBIDO ===')
    console.log('Nome:', nome)
    console.log('Email:', email)
    console.log('Telefone:', telefone)
    console.log(planDetails)
    console.log('===========================')

    return { 
      success: true, 
      message: 'Plano enviado com sucesso! Entraremos em contato em breve.' 
    }
  } catch (error: any) {
    console.error('Erro ao processar plano:', error)
    throw createError({
      statusCode: 500,
      message: 'Erro ao enviar plano. Tente novamente.'
    })
  }
})
