import { PrismaClient } from '@prisma/client'
import { getUserFromEvent } from '../../../utils/jwt'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const user = getUserFromEvent(event)
    if (!user) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

    // Check if user is HR
    const currentUser = await prisma.user.findUnique({
        where: { id: user.id }
    })

    if (currentUser?.role !== 'HR') {
        throw createError({ statusCode: 403, statusMessage: 'Only HR can delete employees' })
    }

    const employeeId = parseInt(event.context.params?.id as string)

    if (!employeeId) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid employee ID' })
    }

    // Check if employee exists and is in the same company
    const employee = await prisma.user.findUnique({
        where: { id: employeeId }
    })

    if (!employee) {
        throw createError({ statusCode: 404, statusMessage: 'Employee not found' })
    }

    if (employee.companyId !== currentUser.companyId) {
        throw createError({ statusCode: 403, statusMessage: 'Cannot delete employee from another company' })
    }

    // Prevent deleting yourself
    if (employee.id === currentUser.id) {
        throw createError({ statusCode: 400, statusMessage: 'Cannot delete your own account' })
    }

    // Delete the employee
    await prisma.user.delete({
        where: { id: employeeId }
    })

    return {
        success: true,
        message: 'Employee deleted successfully'
    }
})
