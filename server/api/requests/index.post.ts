import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const body = await readBody(event)
    const { type, startDate, endDate, reason } = body

    if (!type || !startDate) {
        throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
    }

    const request = await prisma.request.create({
        data: {
            userId: user.id,
            type,
            startDate: new Date(startDate),
            endDate: endDate ? new Date(endDate) : null,
            reason,
            status: 'PENDING'
        }
    })

    return { request }
})
