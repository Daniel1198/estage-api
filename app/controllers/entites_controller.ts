import Entite from '#models/entite';
import { editEntiteValidator, storeEntiteValidator } from '#validators/entite';
import type { HttpContext } from '@adonisjs/core/http'

export default class EntitesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeEntiteValidator)
            const entite = await Entite.create(payload);
            return response.status(201).json({ status: 201, message: 'Entité créée avec succès !', data: entite })
        } catch (error) {
            return response.json(error)
        }
    }

    async read({ response }: HttpContext) {
        try {
            const entites = await Entite.query().preload('parent').preload('sousEntites')
            return response.status(201).json(entites)
        } catch (error) {
            return response.json(error)
        }
    }

    async find({ request, response }: HttpContext) {
        try {
            const entite = await Entite.query().where({ id: request.params().id }).preload('parent').preload('sousEntites').firstOrFail()
            return response.status(201).json(entite)
        } catch (error) {
            return response.json(error)
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const entite = await Entite.findOrFail(request.params().id)
            entite.delete()
            return response.status(201).json({ status: 201, message: 'Entité supprimée avec succès !' })
        } catch (error) {
            return response.json(error)
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
            return response.status(201).json({ status: 201, message: 'Entité modifiée avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }
}