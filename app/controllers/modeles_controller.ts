import Modele from '#models/modele';
import Permission from '#models/permission';
import { editModelValidator, editPermissionsValidator, storeModelValidator } from '#validators/model';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as err } from '@adonisjs/lucid';
import { errors as authErrors } from '@adonisjs/auth'

export default class ModelesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeModelValidator)
            const modele = await Modele.create(payload);
            return response.status(201).json({ status: 201, message: 'Modèle créé avec succès !', data: modele })
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

    async read({ response }: HttpContext) {
        try {
            const modeles = await Modele.query().preload('permissions')
            return response.status(200).json(modeles)
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
            const modele = await Modele.query().where({ 'id': request.params().id }).preload('permissions').firstOrFail()
            return response.status(200).json(modele)
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

    async delete({ request, response }: HttpContext) {
        try {
            const modele = await Modele.findOrFail(request.params().id)
            modele.related('permissions').detach()
            modele.delete()
            return response.status(200).json({ status: 200, message: 'Modèle supprimé avec succès !' })
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

    async edit({ request, response }: HttpContext) {
        try {
            const modele = await Modele.findOrFail(request.params().id)
            const payload = await request.validateUsing(editModelValidator)
            modele.intitule = payload.intitule!
            modele.save()
            return response.status(200).json({ status: 200, message: 'Modèle modifié avec succès !' })
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

    async attachPermissions({ request, response }: HttpContext) {
        try {
            const modele = await Modele.findOrFail(request.params().id)
            const payload = await request.validateUsing(editPermissionsValidator)
            modele.related('permissions').detach()
            modele.related('permissions').attach(payload.permissions)
            modele.save()
            return response.status(201).json({ status: 201, message: 'Permissions ajoutées avec succès !' })
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

    async getPermissions({ request, response }: HttpContext) {
        try {
            const modele = await Modele.query().where({ 'id': request.params().id }).preload('permissions').firstOrFail()
            const permissions = await Permission.all()
            const access = permissions.map((permission) => {
                const p = {
                    checked: false,
                    id: permission.id,
                    code: permission.code,
                    intitule: permission.intitule
                }
                if (modele.permissions.some((perm) => perm.id === permission.id)) {
                    p.checked = true
                }
                return p
            })
            return response.status(200).json(access)
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