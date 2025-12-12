import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    let where = {}
    if (user.role === 'EMPLOYEE') {
        where = { userId: user.id }
    } else {
        where = { user: { companyId: user.companyId } }
    }

    const penalties = await prisma.penalty.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return { penalties }
})
