import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    if (user.role === 'EMPLOYEE') {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    const body = await readBody(event)
    const { userId, amount, reason } = body

    if (!userId || !amount || !reason) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    const penalty = await prisma.penalty.create({
        data: {
            userId: parseInt(userId),
            amount: parseFloat(amount),
            reason
        }
    })

    return { penalty }
})
