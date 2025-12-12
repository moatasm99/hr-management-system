import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    if (user.role !== 'HR') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const employees = await prisma.user.findMany({
        where: {
            companyId: user.companyId
        },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            createdAt: true
        },
        orderBy: { createdAt: 'desc' }
    })

    return { employees }
})
