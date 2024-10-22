import responsable from '#models/responsable';
import Entite from '#models/entite';
import { editChiefValidator, storeChiefValidator } from '#validators/responsable';
import type { HttpContext } from '@adonisjs/core/http'
import Responsable from '#models/responsable';
import { errors } from '@vinejs/vine';
import { errors as err } from '@adonisjs/lucid';
import { errors as authErrors } from '@adonisjs/auth'

export default class responsablesController {
    async store({ request, response }: HttpContext) {
        try {
            const responsable = new Responsable()
            const payload = await request.validateUsing(storeChiefValidator)
            const entite = await Entite.query().where({ 'id': payload.entiteId }).firstOrFail()
            const year = new Date().getFullYear()
            const code = 'R-' + entite.code + '-' + year + '-' + (((await Responsable.all()).length) + 1)
            responsable.code = code
            responsable.nom = payload.nom
            responsable.prenom = payload.prenom
            responsable.fonction = payload.fonction
            responsable.poste = payload.poste!
            responsable.email = payload.email!
            responsable.telephone = payload.telephone!
            responsable.estDirecteur = payload.estDirecteur!
            responsable.entiteId = payload.entiteId
            responsable.save()
            return response.status(201).json({ status: 201, message: 'Responsable ajouté avec succès !', data: responsable })
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
            const responsables = await responsable.query().preload('entite')
            return response.status(200).json(responsables)
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
            const responsable = await Responsable.findOrFail(request.params().id)
            return response.status(200).json(responsable)
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
            const responsable = await Responsable.findOrFail(request.params().id)
            responsable.delete()
            return response.status(200).json({ status: 200, message: 'Responsable retiré avec succès !' })
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
            const responsable = await Responsable.findOrFail(request.params().id)
            const payload = await request.validateUsing(editChiefValidator)
            responsable.poste = payload.poste!
            responsable.email = payload.email!
            responsable.telephone = payload.telephone!
            responsable.fonction = payload.fonction!
            responsable.estDirecteur = payload.estDirecteur!
            responsable.entiteId = payload.entiteId!
            responsable.save()
            return response.status(200).json({ status: 200, message: 'Informations du responsable modifiées avec succès !' })
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
}