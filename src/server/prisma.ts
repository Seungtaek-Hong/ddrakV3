import { PrismaClient } from '@prisma/client'

function createPrismaClient() {
  const client = new PrismaClient({
    log: [{ emit: 'event', level: 'query' }],
  })

  client.$on('query', (e) => {
    console.log(`[Prisma] ${e.duration}ms | ${e.query}`)
  })

  return client
}

// PrismaClient is attached to the `global` object in development to prevent
// exhausting your database connection limit.
//
// Learn more:
// https://pris.ly/d/help/next-js-best-practices

let prisma: PrismaClient

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient()
} else {
  if (!global.prisma) {
    global.prisma = createPrismaClient()
  }
  prisma = global.prisma
}
export default prisma