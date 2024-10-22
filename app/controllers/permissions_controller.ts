import Permission from '#models/permission'
import type { HttpContext } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'

export default class PermissionsController {
    async read({ response }: HttpContext) {
        try {
            const permissions = await Permission.all()
            return response.status(200).json(permissions)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}