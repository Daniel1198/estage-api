import type { HttpContext } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'
import Notification from '#models/notification'

export default class NotificationsController {
    async read({ response }: HttpContext) {
        try {
            const notifications = await Notification.all()
            return response.status(200).json(notifications)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}