import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const requests = await prisma.request.findMany({
        where: {
            userId: user.id
        },
        orderBy: {
            createdAt: 'desc'
        }
    })

    return {
        success: true,
        requests: requests.map(r => {
            const fromDateObj = new Date(r.startDate)
            const toDateObj = r.endDate ? new Date(r.endDate) : null

            // Extract basic date YYYY-MM-DD
            const fromDate = fromDateObj.toISOString().split('T')[0]
            const toDate = toDateObj ? toDateObj.toISOString().split('T')[0] : null

            // Extract time HH:mm
            const fromTime = fromDateObj.toISOString().split('T')[1].substring(0, 5)
            const toTime = toDateObj ? toDateObj.toISOString().split('T')[1].substring(0, 5) : null

            return {
                id: r.id,
                type: r.type,
                status: r.status,
                fromDate,
                toDate,
                fromTime,
                toTime,
                reason: r.reason,
                managerComment: r.managerComment,
                rejectionReason: r.status === 'REJECTED' ? r.managerComment : undefined,
                createdAt: r.createdAt.toISOString(),
                updatedAt: r.updatedAt.toISOString()
            }
        })
    }
})
