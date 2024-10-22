import Permission from '#models/permission';
import User from '#models/user';
import { editPermissionsValidator } from '#validators/model';
import { editUserValidator, storeUserValidator } from '#validators/user';
import { cuid } from '@adonisjs/core/helpers';
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app';
import mail from '@adonisjs/mail/services/main';
import { errors } from '@vinejs/vine';
import { errors as err } from '@adonisjs/lucid';
import { errors as authErrors } from '@adonisjs/auth'

export default class UsersController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeUserValidator)
            const user = new User()
            if (payload.image) {
                const name = `${cuid()}.${payload.image.extname}`
                user.image = name
                await payload.image.move(app.makePath('storage/uploads/avatars'), {
                    name
                })
            }
            const password = Math.random().toString(36).slice(2, 8)
            user.password = password
            user.code = payload.code
            user.fullName = payload.fullName
            user.job = payload.job!
            user.email = payload.email
            user.save();
            await mail.send((message) => {
                message
                    .to(user.email)
                    .subject('Création de compte.')
                    .htmlView('emails/created_account', { username: user.fullName, password, codeUser: user.code })
            })
            return response.status(201).json({ status: 201, message: 'Utilisateur créé avec succès ! ', data: user })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                response.json({ status: 401, message: error.messages[0].message })
            } else if (error instanceof err.E_ROW_NOT_FOUND) {
                response.json({ status: 404, message: error.message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async read({ response }: HttpContext) {
        try {
            const users = await User.query().preload('permissions')
            return response.status(200).json(users)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async find({ request, response }: HttpContext) {
        try {
            const user = await User.query().where({ 'id': request.params().id }).preload('permissions').firstOrFail()
            return response.status(200).json(user)
        } catch (error) {
            if (error instanceof err.E_ROW_NOT_FOUND) {
                response.json({ status: 404, message: error.message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const user = await User.findOrFail(request.params().id)
            user.delete()
            return response.status(200).json({ status: 200, message: 'Utilisateur supprimé avec succès !' })
        } catch (error) {
            if (error instanceof err.E_ROW_NOT_FOUND) {
                response.json({ status: 404, message: error.message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async edit({ request, response }: HttpContext) {
        try {
            const user = await User.findOrFail(request.params().id)
            const payload = await request.validateUsing(editUserValidator)
            if (payload.image) {
                const name = `${cuid()}.${payload.image.extname}`
                user.image = name
                await payload.image.move(app.makePath('storage/uploads/avatars'), {
                    name
                })
            }
            user.fullName = payload.fullName!
            user.email = payload.email!
            user.job = payload.job!
            user.save()
            return response.status(200).json({ status: 200, message: 'Utilisateur modifié avec succès !' })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                response.json({ status: 401, message: error.messages[0].message })
            } else if (error instanceof err.E_ROW_NOT_FOUND) {
                response.json({ status: 404, message: error.message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async attachPermissions({ request, response }: HttpContext) {
        try {
            const user = await User.findOrFail(request.params().id)
            const payload = await request.validateUsing(editPermissionsValidator)
            user.related('permissions').detach()
            user.related('permissions').attach(payload.permissions)
            user.save()
            return response.status(201).json({ status: 201, message: 'Permissions ajoutées avec succès !' })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                response.json({ status: 401, message: error.messages[0].message })
            } else if (error instanceof err.E_ROW_NOT_FOUND) {
                response.json({ status: 404, message: error.message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async getPermissions({ request, response }: HttpContext) {
        try {
            const user = await User.query().where({ 'id': request.params().id }).preload('permissions').firstOrFail()
            const permissions = await Permission.all()
            const access = permissions.map((permission) => {
                const p = {
                    checked: false,
                    id: permission.id,
                    code: permission.code,
                    intitule: permission.intitule
                }
                if (user.permissions.some((perm) => perm.id === permission.id)) {
                    p.checked = true
                }
                return p
            })
            return response.status(200).json(access)
        } catch (error) {
            if (error instanceof err.E_ROW_NOT_FOUND) {
                response.json({ status: 404, message: error.message })
            } else if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}