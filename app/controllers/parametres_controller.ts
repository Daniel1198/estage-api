import Parametre from '#models/parametre';
import { storeOrEditSettingValidator } from '#validators/parametre';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as authErrors } from '@adonisjs/auth';

export default class ParametresController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeOrEditSettingValidator)
            const parametre = await Parametre.updateOrCreate({ code: payload.code }, { valeur: payload.valeur });
            return response.status(201).json({ status: 201, message: 'Entité créée avec succès !', data: parametre })
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
            const parametres = await Parametre.query()
            return response.status(200).json(parametres)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}