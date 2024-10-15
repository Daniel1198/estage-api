import vine from '@vinejs/vine'
import moment from 'moment'

export const storeInternValidator = vine.compile(
    vine.object({
        nom: vine.string().trim().minLength(2).toUpperCase(),
        prenom: vine.string().trim().toUpperCase().minLength(2),
        dateNaissance: vine.date().before(() => {
            return moment().add(15, 'year').format('YYYY-MM-DD')
        }),
        genre: vine.enum(['M', 'F']),
        nationalite: vine.string().toUpperCase().trim(),
        situationMatrimoniale: vine.string().toUpperCase().trim(),
        telephone: vine.string().toUpperCase().trim().fixedLength(10).alphaNumeric(),
        email: vine.string().trim().toLowerCase().email().minLength(5).optional(),
        communeQuartier: vine.string().trim().toUpperCase().minLength(6).optional(),
        photo: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        lettreMotivation: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        cv: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        nomCompletGarant: vine.string().trim().toUpperCase().minLength(5).optional(),
        lienAvecStagiaire: vine.string().trim().toUpperCase().minLength(6).optional(),
        telephoneGarant: vine.string().trim().fixedLength(10).alphaNumeric().optional(),
        etablissement: vine.string().trim().toUpperCase().optional(),
        niveau: vine.string().trim().toUpperCase().optional(),
        qualification: vine.string().trim().toUpperCase().optional(),
        statut: vine.string().toUpperCase().trim(),
        userId: vine.number()
    })
)

export const editInternValidator = vine.compile(
    vine.object({
        nom: vine.string().trim().minLength(2).toUpperCase().optional(),
        prenom: vine.string().trim().toUpperCase().minLength(2).optional(),
        dateNaissance: vine.date().before(() => {
            return moment().add(15, 'year').format('YYYY-MM-DD')
        }).optional(),
        genre: vine.enum(['M', 'F']).optional(),
        nationalite: vine.string().toUpperCase().trim().optional(),
        situationMatrimoniale: vine.string().toUpperCase().trim().optional(),
        telephone: vine.string().toUpperCase().trim().fixedLength(10).alphaNumeric().optional(),
        email: vine.string().trim().toLowerCase().email().minLength(5).optional().optional(),
        communeQuartier: vine.string().trim().toUpperCase().minLength(6).optional().optional(),
        photo: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        lettreMotivation: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        cv: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        nomCompletGarant: vine.string().trim().toUpperCase().minLength(5).optional(),
        lienAvecStagiaire: vine.string().trim().toUpperCase().minLength(6).optional(),
        telephoneGarant: vine.string().trim().fixedLength(10).alphaNumeric().optional(),
        etablissement: vine.string().trim().toUpperCase().optional(),
        niveau: vine.string().trim().toUpperCase().optional(),
        qualification: vine.string().trim().toUpperCase().optional()
    })
)