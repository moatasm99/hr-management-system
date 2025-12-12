import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    const id = parseInt(event.context.params?.id as string)

    const payroll = await prisma.payroll.findUnique({
        where: { id },
        include: {
            user: {
                select: {
                    id: true,
                    name: true,
                    email: true,
                    company: {
                        select: {
                            name: true
                        }
                    }
                }
            }
        }
    })

    if (!payroll) {
        throw createError({ statusCode: 404, statusMessage: 'Not found' })
    }

    // Access control
    if (user.role === 'EMPLOYEE' && payroll.userId !== user.id) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
    if (user.role === 'MANAGER' && payroll.userId !== user.id) {
        // Assuming managers can't see others' payroll
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }
    if (user.role === 'HR' && payroll.user.companyId !== user.companyId) {
        throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
    }

    return { payroll }
})
