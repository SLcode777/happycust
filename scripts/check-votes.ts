import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const features = await prisma.featureRequest.findMany({
    include: {
      _count: {
        select: { votes: true },
      },
      votes: true,
    },
  })

  console.log('Feature Requests and their votes:')
  features.forEach((feature) => {
    console.log(`\n${feature.title}:`)
    console.log(`  Total votes: ${feature._count.votes}`)
    console.log(`  Vote details:`, feature.votes)
  })
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
