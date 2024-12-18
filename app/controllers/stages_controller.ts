import Exercice from '#models/exercice';
import Stage from '#models/stage';
import Stagiaire from '#models/stagiaire';
import { editStageValidator, storeStageValidator } from '#validators/stage';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as err } from '@adonisjs/lucid';
import { errors as authErrors } from '@adonisjs/auth'
import TypeStage from '#models/type_stage';

export default class StagesController {
    async store({ request, response }: HttpContext) {
        try {
            const stage = new Stage()
            const payload = await request.validateUsing(storeStageValidator)
            const stagiaire = await Stagiaire.findBy({ matricule: payload.stagiaireMatricule })
            const stg = await Stage.findBy({ statut: 'ACTIF', stagiaireId: stagiaire?.id })
            const stgEnSaisie = await Stage.findBy({ statut: 'EN SAISIE', stagiaireId: stagiaire?.id })
            if (stgEnSaisie) {
                return response.json({ status: 401, message: 'Un stage est en cours d\'entrée pour le stagiaire.' })
            }
            if (stg) {
                return response.json({ status: 401, message: 'Un stage est actif pour le stagiaire. Veuillez attendre la fin du stage avant de procéder à l\'enregistrement d\'une nouvelle période.' })
            }
            let numero = "000"
            const exercice = await Exercice.findByOrFail({ active: true })
            numero = ((await Stage.query().where('exerciceId', exercice.id)).length + 1).toString().padStart(3, '0')
            const typeStage = await TypeStage.find(payload.typeStageId)
            const code = 'STG-' + exercice.code + '-' + typeStage?.intitule.substring(0, 3) + '-' + ((await Stage.all()).length + 1)
            stage.code = code
            stage.numero = numero
            stage.typeStageId = payload.typeStageId
            stage.debut = payload.debut
            stage.fin = payload.fin
            stage.renouvellement = payload.renouvellement!
            stage.statut = payload.statut
            stage.stagiaireId = stagiaire?.id!
            stage.exerciceId = exercice.id
            stage.entiteId = payload.entiteId
            stage.responsableId = payload.responsableId!
            stage.save()
            return response.status(201).json({ status: 201, message: 'Stage ajouté avec succès !' })
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
            const stages = await Stage.query().preload('typeStage').preload('responsable').preload('exercice').preload('stagiaire')
            return response.status(200).json(stages)
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
            const stage = await Stage.query().where({ 'id': request.params().id }).preload('responsable').preload('exercice').preload('stagiaire').firstOrFail()
            return response.status(200).json(stage)
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

    async findByIntern({ request, response }: HttpContext) {
        try {
            const stagiaire = await Stagiaire.findBy({ matricule: request.params().id })
            const stages = await Stage.query().where({ 'stagiaireId': stagiaire?.id }).preload('typeStage').preload('exercice').preload('stagiaire').preload('responsable', (p) => p.preload('entite')).preload('entite',(e) => e.preload('responsables', (r) => r.where({ estDirecteur: true }).first())).orderBy('fin', 'desc')
            return response.status(200).json(stages)
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
            const stage = await Stage.findOrFail(request.params().id)
            stage.delete()
            return response.status(200).json({ status: 200, message: 'Stage supprimé avec succès !' })
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
            const stage = await Stage.findOrFail(request.params().id)
            const payload = await request.validateUsing(editStageValidator)
            stage.debut = payload.debut!
            stage.fin = payload.fin!
            stage.renouvellement = payload.renouvellement!
            stage.entiteId = payload.entiteId!
            stage.responsableId = payload.responsableId!
            stage.save()
            return response.status(200).json({ status: 200, message: 'Informations du stage modifiées avec succès !' })
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