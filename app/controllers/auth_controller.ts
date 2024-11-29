import User from '#models/user';
import { updatePasswordValidator } from '#validators/user';
import type { HttpContext } from '@adonisjs/core/http'
import hash from '@adonisjs/core/services/hash';
import mail from '@adonisjs/mail/services/main';
import { DateTime } from 'luxon';
import { errors as authErrors } from '@adonisjs/auth'
import { errors } from '@vinejs/vine';
import Parametre from '#models/parametre';

export default class AuthController {
    async login({ request, response }: HttpContext) {
        try {
            const { code, password } = request.only(['code', 'password']);
            const user = await User.verifyCredentials(code, password)
            const permissions = (await User.query().where({ code }).preload('permissions').first())?.permissions
            const parametreDrhName = (await Parametre.findBy({ code: 'DRH_NAME' }))
            user.connectedAt = DateTime.now()
            user.save()
            const token = (await User.accessTokens.create(user, ['*'], {
                expiresIn: '1h',
            })).value?.release()
            return response.status(200).json({ status: 200, message: 'Connexion réussie !', token, data: { ...user.toJSON(), permissions }, drhName: parametreDrhName?.valeur })
        } catch (error) {
            if (error instanceof authErrors.E_INVALID_CREDENTIALS) {
                response.json({ status: 401, message: "Nom d'utilisateur ou mot de passe incorrecte" })
            } else {
                response.json(error)
            }
        }
    }

    async resetPassword({ request, response }: HttpContext) {
        try {
            const user = await User.find(request.params().id)
            if (!user) {
                return response.json({ status: 404, message: 'Utilisateur inexistant dans la base de données' })
            }
            const password = Math.random().toString(36).slice(2, 8)
            user.password = password
            user.save()
            await mail.send((message) => {
                message
                    .to(user.email)
                    .subject('Réinitialisation du mot de passe.')
                    .htmlView('emails/password_reset', { username: user.fullName, password })
            })
            return response.status(200).json({ status: 200, message: 'Mot de passe réinitialisé avec succès !' })
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async updatePassword({ request, response, auth }: HttpContext) {
        try {
            await request.validateUsing(updatePasswordValidator)
            const { currentPassword, newPassword } = request.only(['currentPassword', 'newPassword']);
            const user = auth.user
            if (!user) {
                return response.json({ status: 404, message: 'Utilisateur inexistant dans la base de données' })
            }
            const isPasswordValid = await hash.verify(user.password, currentPassword)
            if (!isPasswordValid) {
                return response.json({ status: 404, message: 'Le mot de passe actuel saisi n\'est pas valide. Veuillez saisir le mot de passe correcte svp !' })
            }

            if (newPassword === currentPassword) {
                return response.json({ status: 404, message: 'Le nouveau mot de passe ne peut être identique au mot de passe actuel. Veuillez saisir un nouveau mot de passe différent svp!' })
            }
            user.password = newPassword
            user.save()
            return response.status(200).json({ status: 200, message: 'Mot de passe changé avec succès !' })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                response.json({ status: 401, message: error.messages[0].message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}