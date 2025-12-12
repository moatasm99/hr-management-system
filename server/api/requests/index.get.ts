import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    let where = {}
    if (user.role === 'EMPLOYEE') {
        where = { userId: user.id }
    } else if (user.role === 'MANAGER') {
        // Managers see their team's requests (simplified: all requests for now or implement team logic)
        // For now, let's assume Manager sees all requests in company or we need a team relation.
        // Assuming company-wide for simplicity as per prompt "Team Requests" but no team structure defined yet.
        where = { user: { companyId: user.companyId } }
    } else if (user.role === 'HR') {
        where = { user: { companyId: user.companyId } }
    }

    const requests = await prisma.request.findMany({
        where,
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true
                }
            }
        },
        orderBy: { createdAt: 'desc' }
    })

    return { requests }
})
