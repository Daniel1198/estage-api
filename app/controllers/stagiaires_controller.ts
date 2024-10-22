import Exercice from '#models/exercice'
import Stagiaire from '#models/stagiaire'
import { editInternValidator, storeInternValidator } from '#validators/stagiaire'
import { cuid } from '@adonisjs/core/helpers'
import type { HttpContext } from '@adonisjs/core/http'
import app from '@adonisjs/core/services/app'
import { errors } from '@vinejs/vine'
import { errors as err } from '@adonisjs/lucid'
import { errors as authErrors } from '@adonisjs/auth'

export default class StagiairesController {
    async store({ request, response, auth }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeInternValidator)
            const stagiaire = new Stagiaire()
            if (payload.photo) {
                const name = `${cuid()}.${payload.photo.extname}`
                stagiaire.photo = name
                await payload.photo.move(app.makePath('storage/uploads/avatars'), {
                    name
                })
            }
            const exercice = await Exercice.findByOrFail({ 'active': true })
            const matricule = 'RTI-STG' + exercice.code + ((await Stagiaire.all()).length + 1) + payload.nom.substring(0, 2) + payload.prenom.substring(0, 1)
            stagiaire.matricule = matricule
            stagiaire.nom = payload.nom
            stagiaire.prenom = payload.prenom
            stagiaire.nomCompletPere = payload.nomCompletPere
            stagiaire.nomCompletMere = payload.nomCompletMere
            stagiaire.dateNaissance = payload.dateNaissance
            stagiaire.sexe = payload.sexe
            stagiaire.nationalite = payload.nationalite
            stagiaire.situationMatrimoniale = payload.situationMatrimoniale
            stagiaire.telephone = payload.telephone
            stagiaire.email = payload.email!
            stagiaire.lieuResidence = payload.lieuResidence!
            stagiaire.nomCompletGarant = payload.nomCompletGarant!
            stagiaire.lienAvecStagiaire = payload.lienAvecStagiaire!
            stagiaire.telephoneGarant = payload.telephoneGarant!
            stagiaire.numeroPiece = payload.numeroPiece!
            stagiaire.competenceProfessionnelle = payload.competenceProfessionnelle!
            stagiaire.statut = payload.statut
            stagiaire.badgeAttribue = payload.badgeAttribue!
            stagiaire.userId = auth.user?.id!
            stagiaire.save()
            return response.status(201).json({ status: 201, message: 'Stagiaire ajouté avec succès ! ', data: stagiaire })
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
            const stagiaires = await Stagiaire.query().preload('user').preload('stages')
            return response.status(200).json(stagiaires)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async readNews({ response }: HttpContext) {
        try {
            const stagiaires = await Stagiaire.query().where({ statut: 'EN SAISIE' }).preload('user').preload('stages', (p) => p.preload('entite').orderBy('fin', 'desc'))
            return response.status(200).json(stagiaires)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async readFinished({ response }: HttpContext) {
        try {
            const stagiaires = await Stagiaire.query().where({ statut: 'TERMINE' }).preload('user').preload('stages', (p) => p.preload('entite').orderBy('fin', 'desc'))
            return response.status(200).json(stagiaires)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async readActives({ response }: HttpContext) {
        try {
            const stagiaires = await Stagiaire.query().where({ statut: 'ACTIF' }).preload('user').preload('stages', (p) => p.preload('entite').orderBy('fin', 'desc'))
            return response.status(200).json(stagiaires)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }

    async readLessOneWeek({ response }: HttpContext) {
        try {
            const stagiaires = await Stagiaire.query().where({ statut: 'MOINS 1 SEMAINE' }).preload('user').preload('stages', (p) => p.preload('entite').orderBy('fin', 'desc'))
            return response.status(200).json(stagiaires)
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
            const stagiaire = await Stagiaire.query().where({ 'id': request.params().id }).preload('user').preload('stages').firstOrFail()
            return response.status(200).json(stagiaire)
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
            const stagiaire = await Stagiaire.findOrFail(request.params().id)
            stagiaire.delete()
            return response.status(200).json({ status: 200, message: 'Stagiaire supprimé avec succès !' })
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
            const stagiaire = await Stagiaire.findByOrFail({ matricule: request.params().id })
            const payload = await request.validateUsing(editInternValidator)
            if (payload.photo) {
                const name = `${cuid()}.${payload.photo.extname}`
                stagiaire.photo = name
                await payload.photo.move(app.makePath('storage/uploads/avatars'), {
                    name
                })
            }
            stagiaire.nom = payload.nom!
            stagiaire.prenom = payload.prenom!
            stagiaire.nomCompletPere = payload.nomCompletPere!
            stagiaire.nomCompletMere = payload.nomCompletMere!
            stagiaire.dateNaissance = payload.dateNaissance!
            stagiaire.sexe = payload.sexe!
            stagiaire.nationalite = payload.nationalite!
            stagiaire.situationMatrimoniale = payload.situationMatrimoniale!
            stagiaire.telephone = payload.telephone!
            stagiaire.email = payload.email!
            stagiaire.lieuResidence = payload.lieuResidence!
            stagiaire.nomCompletGarant = payload.nomCompletGarant!
            stagiaire.lienAvecStagiaire = payload.lienAvecStagiaire!
            stagiaire.telephoneGarant = payload.telephoneGarant!
            stagiaire.numeroPiece = payload.numeroPiece!
            stagiaire.badgeAttribue = payload.badgeAttribue!
            stagiaire.competenceProfessionnelle = payload.competenceProfessionnelle!
            stagiaire.save()
            return response.status(200).json({ status: 200, message: 'Informations du stagiaire modifiées avec succès !' })
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