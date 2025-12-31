import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  try {
    console.log('Testing Suggestions API...')
    
    // Test 1: Fetch all suggestions
    const suggestions = await prisma.suggestion.findMany({
      include: {
        user: {
          select: {
            name: true,
            matricula: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    })
    
    console.log('✓ Successfully fetched suggestions')
    console.log(`Found ${suggestions.length} suggestions`)
    
    if (suggestions.length > 0) {
      console.log('First suggestion:', JSON.stringify(suggestions[0], null, 2))
    }
    
  } catch (e) {
    console.error('✗ Error:', e.message)
  } finally {
    await prisma.$disconnect()
  }
}

main()
