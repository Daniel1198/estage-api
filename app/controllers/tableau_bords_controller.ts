import Stagiaire from '#models/stagiaire'
import type { HttpContext } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'

export default class TableauBordsController {
    async read({ response }: HttpContext) {
        try {
            const enAttente = (await Stagiaire.query().where({ statut: 'EN SAISIE' })).length
            const actif = (await Stagiaire.query().where({ statut: 'ACTIF' })).length
            const expirant = (await Stagiaire.query().where({ statut: 'MOINS 1 SEMAINE' })).length
            const termine = (await Stagiaire.query().where({ statut: 'TERMINE' })).length
            
            return response.status(200).json({ enAttente, actif, expirant, termine })
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}