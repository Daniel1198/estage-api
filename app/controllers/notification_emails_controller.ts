import NotificationEmail from '#models/notification_email';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as authErrors } from '@adonisjs/auth';
import { errors as err } from '@adonisjs/lucid';
import { storeNotificationEmailValidator } from '#validators/notification_email';

export default class NotificationEmailsController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeNotificationEmailValidator)
            const email = await NotificationEmail.create(payload);
            return response.status(201).json({ status: 201, message: 'Email ajouté avec succès !', data: email })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                response.json({ status: 404, message: error.messages[0].message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async read({ response }: HttpContext) {
        try {
            const emails = await NotificationEmail.query()
            return response.status(200).json(emails)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const email = await NotificationEmail.findOrFail(request.params().id)
            email.delete()
            return response.status(200).json({ status: 200, message: 'Email supprimé avec succès !' })
        } catch (error) {
            if (error instanceof err.E_ROW_NOT_FOUND) {
                response.json({ status: 404, message: "Donnée non trouvée" })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}