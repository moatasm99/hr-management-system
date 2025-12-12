import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    // Get user's company
    const currentUser = await prisma.user.findUnique({
        where: { id: user.id }
    })

    if (!currentUser) {
        throw createError({ statusCode: 404, statusMessage: 'User not found' })
    }

    // Fetch announcements for the company
    const announcements = await prisma.experiencePost.findMany({
        where: {
            type: 'ANNOUNCEMENT',
            companyId: currentUser.companyId
        },
        orderBy: {
            createdAt: 'desc'
        },
        take: 20
    })

    return {
        success: true,
        announcements
    }
})
