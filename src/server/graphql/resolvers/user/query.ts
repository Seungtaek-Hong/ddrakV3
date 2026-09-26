import { extendType, nonNull, intArg } from 'nexus'
import { ApolloError } from 'apollo-server-micro'
import prisma from '@server/prisma'

export const UserQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('user', {
      type: 'User',
      args: {
        id: nonNull(intArg()),
      },
      resolve: async (_, { id }, ctx) => {
        return await prisma.user.findUnique({
          where: {
            id,
          },
          include: {
            club: true,
          },
        })
      },
    })

    t.list.field('users', {
      type: 'User',
      resolve: async (_parent, _args, ctx) => {
        const requester = await prisma.user.findUnique({
          where: { id: ctx.userId },
        })

        if (!requester?.isSuper) {
          throw new ApolloError('권한이 없습니다', null, {
            extraCode: 'FORBIDDEN',
          })
        }

        return prisma.user.findMany({
          orderBy: { id: 'asc' },
          select: {
            id: true,
            name: true,
            isAdmin: true,
            isSuper: true,
            club: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },
          },
        })
      },
    })
  },
})