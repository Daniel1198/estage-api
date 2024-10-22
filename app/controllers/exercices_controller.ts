import Exercice from '#models/exercice';
import { editExerciseValidator, storeExerciseValidator } from '#validators/exercice';
import type { HttpContext } from '@adonisjs/core/http'
import { errors } from '@vinejs/vine';
import { errors as err } from '@adonisjs/lucid';
import { errors as authErrors } from '@adonisjs/auth';

export default class ExercicesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeExerciseValidator)
            const exercice = await Exercice.findBy({ code: payload.code })
            if (exercice) {
                return response.json({ status: 409, message: 'Un exercie avec ce code existe déjà !' })
            }
            await Exercice.create(payload);
            return response.status(201).json({ status: 201, message: 'Exercice créé avec succès !' })
        } catch (error) {
            if (error instanceof errors.E_VALIDATION_ERROR) {
                response.json({ status: 404, message: error.messages[0].message })
            } else {
                response.json(error)
            }
        }
    }

    async read({ response }: HttpContext) {
        try {
            const exercices = await Exercice.all()
            return response.status(200).json(exercices)
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
            const exercice = await Exercice.findOrFail(request.params().id)
            return response.status(200).json(exercice)
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
            const exercice = await Exercice.findOrFail(request.params().id)
            exercice.delete()
            return response.status(200).json({ status: 200, message: 'Exercice supprimé avec succès !' })
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
            const exercice = await Exercice.findOrFail(request.params().id)
            const payload = await request.validateUsing(editExerciseValidator)
            exercice.debut = payload.debut!
            exercice.fin = payload.fin!
            exercice.save()
            return response.status(200).json({ status: 200, message: 'Exercice modifié avec succès !' })
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

    async active({ request, response }: HttpContext) {
        try {
            const exercice = await Exercice.findOrFail(request.params().id)
            exercice.active = true
            await Exercice.query().update({ active: false }).whereNot('id', request.params().id)
            exercice.save()
            return response.status(200).json({ status: 200, message: 'Exercice activé avec succès !' })
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

    async findActive({ response }: HttpContext) {
        try {
            const exercice = await Exercice.findByOrFail({ 'active': true })
            return response.status(200).json(exercice)
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