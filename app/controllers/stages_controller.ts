import Exercice from '#models/exercice';
import Stage from '#models/stage';
import Stagiaire from '#models/stagiaire';
import { editStageValidator, storeStageValidator } from '#validators/stage';
import type { HttpContext } from '@adonisjs/core/http'

export default class StagesController {
    async store({ request, response }: HttpContext) {
        try {
            const stage = new Stage()
            const payload = await request.validateUsing(storeStageValidator)
            const stagiaire = await Stagiaire.findBy({ matricule: payload.stagiaireMatricule })
            const stg = await Stage.findBy({ statut: 'ACTIF', stagiaireId: stagiaire?.id })
            const stgEnSaisie = await Stage.findBy({ statut: 'EN SAISIE', stagiaireId: stagiaire?.id })
            if (stgEnSaisie) {
                return response.status(400).json({ status: 400, message: 'Un stage est en cours d\'entrée pour le stagiaire.' })
            }
            if (stg) {
                return response.status(400).json({ status: 400, message: 'Un stage est actif pour le stagiaire. Veuillez attendre la fin du stage avant de procéder à l\'enregistrement d\'une nouvelle période.' })
            }
            const exercice = await Exercice.findByOrFail({ active: true })
            const code = 'STG-' + exercice.code + '-' + payload.type.substring(0, 3) + '-' + ((await Stage.all()).length + 1)
            stage.code = code
            stage.type = payload.type
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
            return response.json(error)
        }
    }

    async read({ response }: HttpContext) {
        try {
            const stages = await Stage.query().preload('responsable').preload('exercice').preload('stagiaire')
            return response.status(201).json({ status: 201, data: stages })
        } catch (error) {
            return response.json(error)
        }
    }

    async find({ request, response }: HttpContext) {
        try {
            const stage = await Stage.query().where({ 'id': request.params().id }).preload('responsable').preload('exercice').preload('stagiaire').firstOrFail()
            return response.status(201).json({ status: 201, data: stage })
        } catch (error) {
            return response.json(error)
        }
    }

    async findByIntern({ request, response }: HttpContext) {
        try {
            const stagiaire = await Stagiaire.findBy({ matricule: request.params().id })
            const stages = await Stage.query().where({ 'stagiaireId': stagiaire?.id }).preload('responsable', (p) => p.preload('entite')).preload('entite').orderBy('fin', 'desc')
            return response.status(200).json(stages)
        } catch (error) {
            return response.json(error)
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const stage = await Stage.findOrFail(request.params().id)
            stage.delete()
            return response.status(201).json({ status: 201, message: 'Stage supprimé avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async edit({ request, response }: HttpContext) {
        try {
            const stage = await Stage.findOrFail(request.params().id)
            const payload = await request.validateUsing(editStageValidator)
            stage.type = payload.type!
            stage.debut = payload.debut!
            stage.fin = payload.fin!
            stage.renouvellement = payload.renouvellement!
            stage.entiteId = payload.entiteId!
            stage.responsableId = payload.responsableId!
            stage.save()
            return response.status(201).json({ status: 201, message: 'Informations du stage modifiées avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }
}