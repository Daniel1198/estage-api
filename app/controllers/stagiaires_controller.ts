import Exercice from '#models/exercice'
import Stagiaire from '#models/stagiaire'
import { editInternValidator, storeInternValidator } from '#validators/stagiaire'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'

export default class StagiairesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeInternValidator)
            const stagiaire = new Stagiaire()
            if (payload.photo) {
                const name = `${cuid()}.${payload.photo.extname}`
                stagiaire.photo = name
                await payload.photo.move(app.makePath('storage/uploads/stagiaires/photo'), {
                    name
                })
            }
            if (payload.lettreMotivation) {
                const name = `${cuid()}.${payload.lettreMotivation.extname}`
                stagiaire.lettreMotivation = name
                await payload.lettreMotivation.move(app.makePath('storage/uploads/stagiaires/documents'), {
                    name
                })
            }
            if (payload.cv) {
                const name = `${cuid()}.${payload.cv.extname}`
                stagiaire.cv = name
                await payload.cv.move(app.makePath('storage/uploads/stagiaires/documents'), {
                    name
                })
            }
            const exercice = await Exercice.findByOrFail({ 'active': true })
            const matricule = 'RTI-STG' + exercice.code + ((await Stagiaire.all()).length + 1) + payload.nom.substring(0, 2) + payload.prenom.substring(0, 1)
            stagiaire.matricule = matricule
            stagiaire.nom = payload.nom
            stagiaire.prenom = payload.prenom
            stagiaire.dateNaissance = payload.dateNaissance
            stagiaire.genre = payload.genre
            stagiaire.nationalite = payload.nationalite
            stagiaire.situationMatrimoniale = payload.situationMatrimoniale
            stagiaire.telephone = payload.telephone
            stagiaire.email = payload.email!
            stagiaire.communeQuartier = payload.communeQuartier!
            stagiaire.nomCompletGarant = payload.nomCompletGarant!
            stagiaire.lienAvecStagiaire = payload.lienAvecStagiaire!
            stagiaire.telephoneGarant = payload.telephoneGarant!
            stagiaire.etablissement = payload.etablissement!
            stagiaire.niveau = payload.niveau!
            stagiaire.qualification = payload.qualification!
            stagiaire.statut = payload.statut
            stagiaire.userId = payload.userId
            stagiaire.save()
            return response.status(201).json({ status: 201, message: 'Stagiaire ajouté avec succès ! ' })
        } catch (error) {
            return response.json(error)
        }
    }

    async read({ response }: HttpContext) {
        try {
            const stagiaires = await Stagiaire.query().preload('user').preload('stages')
            return response.status(201).json({ status: 201, data: stagiaires })
        } catch (error) {
            return response.json(error)
        }
    }

    async find({ request, response }: HttpContext) {
        try {
            const stagiaire = await Stagiaire.query().where({ 'id': request.params().id }).preload('user').preload('stages').firstOrFail()
            return response.status(201).json({ status: 201, data: stagiaire })
        } catch (error) {
            return response.json(error)
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const stagiaire = await Stagiaire.findOrFail(request.params().id)
            stagiaire.delete()
            return response.status(201).json({ status: 201, message: 'Stagiaire supprimé avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async edit({ request, response }: HttpContext) {
        try {
            const stagiaire = await Stagiaire.findOrFail(request.params().id)
            const payload = await request.validateUsing(editInternValidator)
            if (payload.photo) {
                const name = `${cuid()}.${payload.photo.extname}`
                stagiaire.photo = name
                await payload.photo.move(app.makePath('storage/uploads/stagiaires/photo'), {
                    name
                })
            }
            if (payload.lettreMotivation) {
                const name = `${cuid()}.${payload.lettreMotivation.extname}`
                stagiaire.lettreMotivation = name
                await payload.lettreMotivation.move(app.makePath('storage/uploads/stagiaires/documents'), {
                    name
                })
            }
            if (payload.cv) {
                const name = `${cuid()}.${payload.cv.extname}`
                stagiaire.cv = name
                await payload.cv.move(app.makePath('storage/uploads/stagiaires/documents'), {
                    name
                })
            }
            stagiaire.nom = payload.nom!
            stagiaire.prenom = payload.prenom!
            stagiaire.dateNaissance = payload.dateNaissance!
            stagiaire.genre = payload.genre!
            stagiaire.nationalite = payload.nationalite!
            stagiaire.situationMatrimoniale = payload.situationMatrimoniale!
            stagiaire.telephone = payload.telephone!
            stagiaire.email = payload.email!
            stagiaire.communeQuartier = payload.communeQuartier!
            stagiaire.nomCompletGarant = payload.nomCompletGarant!
            stagiaire.lienAvecStagiaire = payload.lienAvecStagiaire!
            stagiaire.telephoneGarant = payload.telephoneGarant!
            stagiaire.etablissement = payload.etablissement!
            stagiaire.niveau = payload.niveau!
            stagiaire.qualification = payload.qualification!
            stagiaire.save()
            return response.status(201).json({ status: 201, message: 'Informations du stagiaire modifiées avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }
}