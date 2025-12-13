import prisma from '../../utils/prisma'
import bcrypt from 'bcryptjs'
import { signToken } from '../../utils/jwt'

export default defineEventHandler(async (event) => {
    console.log('[API START] /api/auth/login')
    try {
        const body = await readBody(event)
        const { email, password } = body

        if (!email || !password) {
            throw createError({ statusCode: 400, statusMessage: 'Missing fields' })
        }

        const user = await prisma.user.findUnique({ where: { email } })

        if (!user) {
            console.warn(`[Login Failed] User not found: ${email}`)
            throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
        }

        const isValid = await bcrypt.compare(password, user.password)
        if (!isValid) {
            console.warn(`[Login Failed] Invalid password for: ${email}`)
            throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
        }

        const token = signToken(user)

        setCookie(event, 'auth_token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 60 * 60 * 24 * 7, // 7 days
            path: '/'
        })

        console.log(`[API SUCCESS] User logged in: ${user.id}`)

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
        console.error('[API ERROR] /api/auth/login:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Internal Server Error'
        })
    }
})
