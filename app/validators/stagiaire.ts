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
        email: vine.string().trim().toLowerCase().email().minLength(5),
        communeQuartier: vine.string().trim().toUpperCase().minLength(6),
        photo: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        pieceIdentite: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png', 'pdf']
        }).nullable().optional(),
        lettreMotivation: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png', 'pdf']
        }).nullable().optional(),
        cv: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png', 'pdf']
        }).nullable().optional(),
        nomCompletGarant: vine.string().trim().toUpperCase().minLength(5).optional().nullable(),
        lienAvecStagiaire: vine.string().trim().toUpperCase().minLength(6).optional().nullable(),
        telephoneGarant: vine.string().trim().fixedLength(10).alphaNumeric().optional().nullable(),
        etablissement: vine.string().trim().toUpperCase().optional().nullable(),
        qualification: vine.string().trim().toUpperCase().optional().nullable(),
        statut: vine.string().toUpperCase().trim()
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
        pieceIdentite: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png', 'pdf']
        }).nullable().optional(),
        lettreMotivation: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png', 'pdf']
        }).nullable().optional(),
        cv: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png', 'pdf']
        }).nullable().optional(),
        nomCompletGarant: vine.string().trim().toUpperCase().minLength(5).optional().nullable(),
        lienAvecStagiaire: vine.string().trim().toUpperCase().minLength(6).optional().nullable(),
        telephoneGarant: vine.string().trim().fixedLength(10).alphaNumeric().optional().nullable(),
        etablissement: vine.string().trim().toUpperCase().optional().nullable(),
        qualification: vine.string().trim().toUpperCase().optional().nullable()
    })
)