import Permission from '#models/permission'
import type { HttpContext } from '@adonisjs/core/http'

export default class PermissionsController {
    async read({ response }: HttpContext) {
        try {
            const permissions = await Permission.all()
            return response.status(201).json(permissions)
        } catch (error) {
            return response.json(error)
        }
    }
}