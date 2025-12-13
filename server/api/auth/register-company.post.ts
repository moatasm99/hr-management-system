import prisma from '../../utils/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    console.log('[API START] /api/auth/register-company')
    try {
        const body = await readBody(event)
        const { companyName, adminName, adminEmail, password } = body

        if (!companyName || !adminName || !adminEmail || !password) {
            throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
        }

        // Check if user exists
        const existingUser = await prisma.user.findUnique({ where: { email: adminEmail } })
        if (existingUser) {
            console.warn(`[Registration Failed] Email exists: ${adminEmail}`)
            throw createError({ statusCode: 400, statusMessage: 'Email already exists' })
        }

        // Create Company
        const company = await prisma.company.create({
            data: {
                name: companyName,
                users: {
                    create: {
                        name: adminName,
                        email: adminEmail,
                        password: await bcrypt.hash(password, 10),
                        role: 'HR' // First user is HR/Admin
                    }
                }
            },
            include: {
                users: true
            }
        })

        const user = company.users[0]
        const token = signToken(user)

        setCookie(event, 'auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        })

        console.log(`[API SUCCESS] Created company ${company.name} and user ${user.id}`)

        return {
            success: true,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            },
            token
        }
    } catch (error: any) {
        console.error('[API ERROR] /api/auth/register-company:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || ('Internal Server Error: ' + error.message)
        })
    }
})
