import vine from '@vinejs/vine'
import moment from 'moment'

export const storeInternValidator = vine.compile(
    vine.object({
        nom: vine.string().trim().minLength(2).toUpperCase(),
        prenom: vine.string().trim().toUpperCase().minLength(2),
        dateNaissance: vine.date().before(() => {
            return moment().add(15, 'year').format('YYYY-MM-DD')
        }),
        nomCompletPere: vine.string().trim().toUpperCase().minLength(5),
        nomCompletMere: vine.string().trim().toUpperCase().minLength(5),
        sexe: vine.enum(['M', 'F']),
        nationalite: vine.string().toUpperCase().trim(),
        situationMatrimoniale: vine.string().toUpperCase().trim(),
        telephone: vine.string().toUpperCase().trim().fixedLength(10).alphaNumeric(),
        email: vine.string().trim().toLowerCase().email().minLength(5),
        lieuResidence: vine.string().trim().toUpperCase().minLength(6),
        photo: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        numeroPiece: vine.string().trim().toUpperCase().minLength(5).optional().nullable(),
        nomCompletGarant: vine.string().trim().toUpperCase().minLength(5).optional().nullable(),
        lienAvecStagiaire: vine.string().trim().toUpperCase().optional().nullable(),
        telephoneGarant: vine.string().trim().fixedLength(10).alphaNumeric().optional().nullable(),
        competenceProfessionnelle: vine.string().trim().toUpperCase().optional().nullable(),
        statut: vine.string().toUpperCase().trim(),
        infoSurNote: vine.string().toLowerCase().trim()
    })
)

export const editInternValidator = vine.compile(
    vine.object({
        nom: vine.string().trim().minLength(2).toUpperCase().optional(),
        prenom: vine.string().trim().toUpperCase().minLength(2).optional(),
        dateNaissance: vine.date().before(() => {
            return moment().add(15, 'year').format('YYYY-MM-DD')
        }).optional(),
        sexe: vine.enum(['M', 'F']).optional(),
        nationalite: vine.string().toUpperCase().trim().optional(),
        situationMatrimoniale: vine.string().toUpperCase().trim().optional(),
        telephone: vine.string().toUpperCase().trim().fixedLength(10).alphaNumeric().optional(),
        email: vine.string().trim().toLowerCase().email().minLength(5).optional().optional(),
        lieuResidence: vine.string().trim().toUpperCase().minLength(6).optional().optional(),
        photo: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional(),
        numeroPiece: vine.string().trim().toUpperCase().minLength(5).optional().nullable(),
        nomCompletPere: vine.string().trim().toUpperCase().minLength(5).optional(),
        nomCompletMere: vine.string().trim().toUpperCase().minLength(5).optional(),
        nomCompletGarant: vine.string().trim().toUpperCase().minLength(5).optional().nullable(),
        lienAvecStagiaire: vine.string().trim().toUpperCase().optional().nullable(),
        telephoneGarant: vine.string().trim().fixedLength(10).alphaNumeric().optional().nullable(),
        competenceProfessionnelle: vine.string().trim().toUpperCase().optional().nullable(),
        infoSurNote: vine.string().toLowerCase().trim().optional()
    })
)

export const assignBadgeValidator = vine.compile(
    vine.object({
        numeroBadge: vine.string().alphaNumeric().trim().toUpperCase().nullable().optional()
    })
)