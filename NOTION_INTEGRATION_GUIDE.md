# Guia de Integração com Notion - GrandTour (ATUALIZADO)

## ✅ Integração Básica Configurada

Você já tem a integração básica funcionando. Agora pode adicionar mais bancos de dados.

---

## Novos Bancos de Dados (Opcionais)

### 🎛️ Configurações do Site

Crie um banco chamado **"Configurações"** com:

| Chave                | Valor                            |
| -------------------- | -------------------------------- |
| empresa_nome         | GrandTour                        |
| empresa_slogan       | Transformando sonhos em destinos |
| email_contato        | contato@grandtour.com.br         |
| telefone             | (11) 99999-9999                  |
| whatsapp             | 5511999999999                    |
| endereco             | São Paulo, SP                    |
| instagram            | https://instagram.com/grandtour  |
| facebook             | https://facebook.com/grandtour   |
| anos_experiencia     | 14                               |
| viagens_realizadas   | 500                              |
| clientes_satisfeitos | 10000                            |

### 📋 Leads/Planos Recebidos

Este banco será criado automaticamente quando alguém enviar um plano pelo site. Colunas:

- Nome (título)
- Email
- Telefone
- Destino
- Pessoas (número)
- Orçamento (select)
- Status (select: Novo, Em Contato, Fechado, Perdido)

---

1. Acesse [https://www.notion.so/my-integrations](https://www.notion.so/my-integrations)
2. Clique em **"+ Nova integração"**
3. Dê um nome (ex: "GrandTour Website")
4. Selecione o workspace onde estão seus dados
5. Em **Capacidades**, marque "Ler conteúdo"
6. Clique em **"Enviar"**
7. **Copie o "Token de Integração Interno"** (começa com `secret_...`)

### 2. Criar os Bancos de Dados no Notion

Crie 4 bancos de dados no Notion com as seguintes estruturas:

---

#### 📅 **Viagens** (Trips)

| Propriedade | Tipo          | Descrição                        |
| ----------- | ------------- | -------------------------------- |
| Nome        | Title         | Nome da viagem                   |
| Destino     | Text          | País/cidade                      |
| Data Início | Date          | Quando começa                    |
| Duração     | Text          | Ex: "7 dias"                     |
| Preço       | Number        | Valor em R$                      |
| Vagas       | Number        | Quantidade disponível            |
| Imagem      | Files & Media | Foto da viagem                   |
| Categoria   | Select        | Aventura, Cultural, Praias, etc. |
| Descrição   | Text          | Descrição curta                  |
| Ativa       | Checkbox      | Se está ativa para venda         |

---

#### ⭐ **Avaliações** (Reviews)

| Propriedade | Tipo          | Descrição              |
| ----------- | ------------- | ---------------------- |
| Nome        | Title         | Nome do cliente        |
| Avatar      | Files & Media | Foto do cliente        |
| Nota        | Number        | 1 a 5                  |
| Viagem      | Text          | Nome da viagem que fez |
| Depoimento  | Text          | Texto da avaliação     |

---

#### 📝 **Blog** (Posts)

| Propriedade   | Tipo          | Descrição                      |
| ------------- | ------------- | ------------------------------ |
| Título        | Title         | Título do post                 |
| Resumo        | Text          | Breve descrição                |
| Imagem        | Files & Media | Imagem de capa                 |
| Data          | Date          | Data de publicação             |
| Autor         | Text          | Nome do autor                  |
| Categoria     | Select        | Dicas, Destinos, Cultura, etc. |
| Tempo Leitura | Text          | Ex: "5 min"                    |
| Conteúdo      | Rich Text     | Corpo do artigo                |
| Publicado     | Checkbox      | Se está publicado              |

---

#### 🤝 **Parceiros** (Partners)

| Propriedade | Tipo          | Descrição        |
| ----------- | ------------- | ---------------- |
| Nome        | Title         | Nome da empresa  |
| Logo        | Files & Media | Logo da empresa  |
| URL         | URL           | Site do parceiro |

---

### 3. Conectar os Bancos à Integração

Para cada banco de dados criado:

1. Abra o banco de dados no Notion
2. Clique nos **"..."** no canto superior direito
3. Vá em **"Conexões"** → **"Conectar a"**
4. Selecione sua integração "GrandTour Website"

### 4. Pegar os IDs dos Bancos de Dados

Para cada banco:

1. Abra o banco de dados em página cheia
2. A URL será algo como: `https://notion.so/seu-workspace/abc123def456?v=...`
3. O ID é a parte `abc123def456` (32 caracteres)

---

## Configurar no Projeto

### 5. Criar arquivo `.env`

Crie um arquivo `.env` na raiz do projeto (`c:\Users\renan\Projetos\grandtour\.env`):

```env
NOTION_TOKEN=secret_sua_chave_aqui
NOTION_TRIPS_DB=id_do_banco_de_viagens
NOTION_REVIEWS_DB=id_do_banco_de_avaliacoes
NOTION_BLOG_DB=id_do_banco_de_blog
NOTION_PARTNERS_DB=id_do_banco_de_parceiros
```

### 6. Próximos Passos de Código

Depois de configurar o `.env`, você precisa:

1. **Criar API routes** em `app/server/api/` para buscar dados do Notion
2. **Criar composables** para consumir essas APIs nos componentes
3. **Atualizar os componentes** para usar dados reais em vez de mock

---

## Resumo do Status Atual

| Item                                    | Status             |
| --------------------------------------- | ------------------ |
| ✅ Site funcionando                     | Completo           |
| ✅ Design Blue/Yellow                   | Completo           |
| ✅ Páginas (Home, Sobre, Viagens, Blog) | Completo           |
| ✅ SDK do Notion instalado              | Completo           |
| ⏳ Configuração do Notion               | Você precisa fazer |
| ⏳ API routes do Notion                 | A implementar      |
| ⏳ Conexão dos componentes              | A implementar      |

---

## Quer que eu implemente a integração completa?

Me forneça:

1. Seu **Token de Integração** do Notion
2. Os **IDs dos bancos de dados** que você criar

E eu implemento toda a conexão automaticamente!
