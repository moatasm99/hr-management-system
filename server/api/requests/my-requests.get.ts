import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    console.log('[API START] /api/requests/my-requests')
    try {
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

        const mappedRequests = requests.map(r => {
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

        console.log(`[API SUCCESS] Fetched ${mappedRequests.length} requests for user ${user.id}`)

        return {
            success: true,
            requests: mappedRequests
        }
    } catch (error: any) {
        console.error('[API ERROR] /api/requests/my-requests:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || ('Internal Server Error: ' + error.message)
        })
    }
})
