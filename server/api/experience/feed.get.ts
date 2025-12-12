import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    // Fetch announcements and kudos
    const announcements = await prisma.experiencePost.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    })

    const kudos = await prisma.kudos.findMany({
        include: {
            sender: { select: { name: true } },
            receiver: { select: { name: true } }
        },
        orderBy: { createdAt: 'desc' },
        take: 10
    })

    // Combine and sort
    const feed = [
        ...announcements.map(a => ({ ...a, type: 'ANNOUNCEMENT' })),
        ...kudos.map(k => ({ ...k, type: 'KUDOS' }))
    ].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    return { feed }
})
