import { extendType, arg, intArg, stringArg } from 'nexus'
import prisma from '@server/prisma'

/**
 * 클라이언트(EVENT_FRAGMENT)가 실제로 요청하는 필드만 선택해서
 * 불필요한 컬럼 조회를 줄인다 (쿼리 부하 및 Neon compute 사용량 절감 목적)
 */
const eventSelect = {
  id: true,
  title: true,
  start: true,
  end: true,
  startTime: true,
  endTime: true,
  startRecur: true,
  endRecur: true,
  daysOfWeek: true,
  groupId: true,
  allDay: true,
  isRental: true,
  color: true,
  desc: true,
  club: {
    select: {
      id: true,
      name: true,
      color: true,
    },
  },
  creator: {
    select: {
      id: true,
      name: true,
      isSuper: true,
      isAdmin: true,
      club: {
        select: {
          id: true,
          name: true,
          color: true,
        },
      },
    },
  },
}

export const EventQuery = extendType({
  type: 'Query',
  definition(t) {
    t.field('event', {
      type: 'Event',
      args: {
        id: 'Int',
      },
      resolve: async (_parent, { id }, _ctx) => {
        return await prisma.event.findUnique({
          where: { id },
          select: eventSelect,
        })
      },
    })

    t.list.field('events', {
      type: 'Event',
      args: {
        from: arg({ type: 'DateTime' }),
        to: arg({ type: 'DateTime' }),
        clubId: intArg(),
      },
      resolve: async (_parent, { from, to, clubId }, _ctx) => {
        return await prisma.event.findMany({
          where: {
            start: {
              gte: from,
              lte: to,
            },
            club: {
              id: clubId,
            },
          },
          select: eventSelect,
        })
      },
    })

    t.list.field('defaultEvents', {
      type: 'Event',
      args: {
        from: arg({ type: 'DateTime' }),
        to: arg({ type: 'DateTime' }),
      },
      resolve: async (_parent, { from, to }, _ctx): Promise<any> => {
        return await prisma.event.findMany({
          where: {
            start: {
              gte: from,
              lte: to,
            },
            OR: [
              {
                creator: {
                  isSuper: true,
                },
              },
              {
                isRental: true,
              },
            ],
          },
          select: eventSelect,
        })
      },
    })

    t.list.field('clubEvents', {
      type: 'Event',
      args: {
        from: arg({ type: 'DateTime' }),
        to: arg({ type: 'DateTime' }),
      },
      resolve: async (_parent, { from, to }, ctx) => {
        const me = await prisma.user.findUnique({
          where: {
            id: ctx.userId,
          },
          select: {
            club: { select: { id: true } },
          },
        })

        return await prisma.event.findMany({
          where: {
            /** club internal events created by club admin */
            OR: [
              {
                start: {
                  gte: from,
                  lte: to,
                },
                creator: {
                  isSuper: false,
                  isAdmin: true,
                },
              },
              /** monthly events whose club is not user's; Thus not available */
              {
                start: {
                  gte: from,
                  lte: to,
                },
                creator: {
                  isSuper: true,
                },
                club: {
                  NOT: {
                    id: me?.club?.id ?? -1,
                  },
                },
              },
            ],
          },
          select: eventSelect,
        })
      },
    })

    t.list.field('monthlyEvents', {
      type: 'Event',
      args: {
        target: arg({ type: 'DateTime' }),
      },
      resolve: async (_parent, { target }, _ctx) => {
        const from = new Date(target.getFullYear(), target.getMonth(), 1)
        const to = new Date(target.getFullYear(), target.getMonth() + 1, 0)

        return await prisma.event.findMany({
          where: {
            start: {
              gte: from,
            },
            end: {
              lte: to,
            },
            creator: {
              isSuper: true,
            },
          },
        })
      },
    })
  },
})