import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create a demo project
  const project = await prisma.project.create({
    data: {
      id: 'demo-project-123',
      name: 'Demo Application',
      slug: 'demo-app',
      apiKey: 'demo-api-key-123',
      language: 'en',
      user: {
        create: {
          email: 'admin@happycust.com',
          name: 'Admin User',
          role: 'SUPER_ADMIN',
          accounts: {
            create: {
              accountId: 'admin-account',
              providerId: 'credential',
              password: 'hashed-password-placeholder', // In real app, this would be hashed
            },
          },
        },
      },
    },
  })

  console.log('✅ Created demo project:', project.name)

  // Create some demo feature requests
  const features = await prisma.featureRequest.createMany({
    data: [
      {
        title: 'Live chat support',
        description: 'Add live chat like Crisp or Intercom for real-time customer support',
        status: 'PLANNED',
        projectId: project.id,
        priority: 'HIGH',
      },
      {
        title: 'Changelog page',
        description: 'Create a public changelog page to show all updates and improvements',
        status: 'UNDER_CONSIDERATION',
        projectId: project.id,
        priority: 'MEDIUM',
      },
      {
        title: 'Visual DOM Selection',
        description: 'Allow users to select specific elements on the page when reporting issues for better context',
        status: 'NEW',
        projectId: project.id,
        priority: 'LOW',
      },
    ],
  })

  console.log(`✅ Created ${features.count} demo feature requests`)

  console.log('🎉 Seeding completed!')
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
