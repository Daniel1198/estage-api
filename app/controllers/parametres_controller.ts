import Parametre from '#models/parametre';
import { storeOrEditSettingValidator } from '#validators/parametre';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as authErrors } from '@adonisjs/auth';
import env from '#start/env';
import encryption from '@adonisjs/core/services/encryption';

export default class ParametresController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeOrEditSettingValidator)
            
            payload?.parametres.map(async param => {
                if (param.code === 'MAIL_CONFIG') {
                    const p = param.valeur.split(';')
                    env.set('SMTP_HOST', p[0])
                    env.set('SMTP_PORT', p[1])
                    env.set('SMTP_NAME', p[2])
                    env.set('SMTP_USERNAME', p[3])
                    env.set('SMTP_PASSWORD', p[4])

                    param.valeur = encryption.encrypt(param.valeur)
                } else {
                    env.set(param.code, param.valeur)
                }

                await Parametre.updateOrCreate({ code: param.code }, { valeur: param.valeur });
            })
            return response.status(201).json({ status: 201, message: 'Paramètres enregistrés avec succès !' })
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
            const parametres = [
                { code: 'MAIL_CONFIG', valeur: env.get('SMTP_HOST') + ';' + env.get('SMTP_PORT') + ';' + (env.get('SMTP_NAME') ?? '') + ';' + env.get('SMTP_USERNAME') + ';' },
                { code: 'DURATION_BEFORE_ALERT', valeur: env.get('DURATION_BEFORE_ALERT') ?? '' }
            ]
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