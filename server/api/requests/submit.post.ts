import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const body = await readBody(event)
    const { type, fromDate, toDate, fromTime, toTime, reason } = body

    // Validate required fields
    if (!type || !fromDate || !reason) {
        throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
    }

    // Construct DateTime objects
    // Assuming fromDate/toDate are YYYY-MM-DD
    const startDateTimeStr = fromTime ? `${fromDate}T${fromTime}:00` : `${fromDate}T00:00:00`
    const startDate = new Date(startDateTimeStr)

    let endDate = null
    if (toDate) {
        const endDateTimeStr = toTime ? `${toDate}T${toTime}:00` : `${toDate}T23:59:59`
        endDate = new Date(endDateTimeStr)
    }

    // Create the request
    const request = await prisma.request.create({
        data: {
            userId: user.id,
            type,
            status: 'PENDING',
            startDate: startDate,
            endDate: endDate,
            reason
        }
    })

    return {
        success: true,
        request: {
            id: request.id,
            type: request.type,
            status: request.status,
            fromDate: request.startDate.toISOString().split('T')[0],
            toDate: request.endDate ? request.endDate.toISOString().split('T')[0] : null,
            fromTime: fromTime || null,
            toTime: toTime || null, // Best effort return, as we don't store exact strings separate
            reason: request.reason,
            createdAt: request.createdAt.toISOString(),
            updatedAt: request.updatedAt.toISOString()
        }
    }
})
