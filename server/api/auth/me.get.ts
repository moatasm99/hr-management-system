import prisma from '../../utils/prisma'
import { getUserFromEvent } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    try {
        const decoded = getUserFromEvent(event)
        if (!decoded) {
            throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
        }

        // @ts-ignore
        const user = await prisma.user.findUnique({ where: { id: decoded.id } })

        if (!user) {
            console.warn(`[Auth Check Failed] User ID not found in DB: ${decoded.id}`)
            throw createError({ statusCode: 401, statusMessage: 'User not found' })
        }

        return {
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            }
        }
    } catch (error: any) {
        console.error('[API ERROR] /api/auth/me:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Internal Server Error'
        })
    }
})
