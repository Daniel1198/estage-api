import Entite from '#models/entite';
import { editEntiteValidator, storeEntiteValidator } from '#validators/entite';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as authErrors } from '@adonisjs/auth';
import { errors as err } from '@adonisjs/lucid';

export default class EntitesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeEntiteValidator)
            const entite = await Entite.create(payload);
            return response.status(201).json({ status: 201, message: 'Entité créée avec succès !', data: entite })
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
            const entites = await Entite.query().preload('parent').preload('sousEntites')
            return response.status(200).json(entites)
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
            const entite = await Entite.query().where({ id: request.params().id }).preload('parent').preload('sousEntites').firstOrFail()
            return response.status(200).json(entite)
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
            const entite = await Entite.findOrFail(request.params().id)
            entite.delete()
            return response.status(200).json({ status: 200, message: 'Entité supprimée avec succès !' })
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
            const entite = await Entite.findOrFail(request.params().id)
            const payload = await request.validateUsing(editEntiteValidator)
            entite.intitule = payload.intitule!
            entite.entiteId = payload.entiteId!
            entite.type = payload.type!
            entite.save()
            return response.status(200).json({ status: 200, message: 'Entité modifiée avec succès !' })
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
}