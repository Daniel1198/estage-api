import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as err } from '@adonisjs/lucid';
import { errors as authErrors } from '@adonisjs/auth'
import { editTypeStageValidator, storeTypeStageValidator } from '#validators/type_stage';
import TypeStage from '#models/type_stage';

export default class TypeStagesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeTypeStageValidator)
            const typeStage = await TypeStage.create(payload);
            return response.status(201).json({ status: 201, message: 'Type de stage créé avec succès !', data: typeStage })
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
            const typesStage = await TypeStage.query()
            return response.status(200).json(typesStage)
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
            const typeStage = await TypeStage.query().where({ 'id': request.params().id }).firstOrFail()
            return response.status(200).json(typeStage)
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
            const typeStage = await TypeStage.findOrFail(request.params().id)
            typeStage.delete()
            return response.status(200).json({ status: 200, message: 'Type de stage supprimé avec succès !' })
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
            const typeStage = await TypeStage.findOrFail(request.params().id)
            const payload = await request.validateUsing(editTypeStageValidator)
            typeStage.intitule = payload.intitule!
            typeStage.duree = payload.duree!
            typeStage.save()
            return response.status(200).json({ status: 200, message: 'Type de stage modifié avec succès !' })
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