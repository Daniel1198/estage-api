import Exercice from '#models/exercice';
import { editExerciseValidator, storeExerciseValidator } from '#validators/exercice';
import type { HttpContext } from '@adonisjs/core/http'

export default class ExercicesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeExerciseValidator)
            await Exercice.create(payload);
            return response.status(201).json({ status: 201, message: 'Exercice créé avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async read({ response }: HttpContext) {
        try {
            const exercices = await Exercice.all()
            return response.status(201).json(exercices)
        } catch (error) {
            return response.json(error)
        }
    }

    async find({ request, response }: HttpContext) {
        try {
            const exercice = await Exercice.findOrFail(request.params().id)
            return response.status(201).json(exercice)
        } catch (error) {
            return response.json(error)
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const exercice = await Exercice.findOrFail(request.params().id)
            exercice.delete()
            return response.status(201).json({ status: 201, message: 'Exercice supprimé avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async edit({ request, response }: HttpContext) {
        try {
            const exercice = await Exercice.findOrFail(request.params().id)
            const payload = await request.validateUsing(editExerciseValidator)
            exercice.debut = payload.debut!
            exercice.fin = payload.fin!
            exercice.save()
            return response.status(201).json({ status: 201, message: 'Exercice modifié avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async active({ request, response }: HttpContext) {
        try {
            const exercice = await Exercice.findOrFail(request.params().id)
            exercice.active = true
            await Exercice.query().update({ active: false }).whereNot('id', request.params().id)
            exercice.save()
            return response.status(201).json({ status: 201, message: 'Exercice activé avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async findActive({ response }: HttpContext) {
        try {
            const exercice = await Exercice.findByOrFail({ 'active': true })
            return response.status(201).json(exercice)
        } catch (error) {
            return response.json(error)
        }
    }
}