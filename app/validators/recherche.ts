import vine from '@vinejs/vine'

export const searchInternValidator = vine.compile(
    vine.object({
        matricule: vine.string().trim().toUpperCase().optional(),
        nom: vine.string().trim().toUpperCase().optional(),
        prenom: vine.string().trim().toUpperCase().optional(),
        sexe: vine.enum(['M', 'F']).optional(),
        nationalite: vine.string().toUpperCase().trim().optional(),
        situationMatrimoniale: vine.string().toUpperCase().trim().optional(),
        residence: vine.string().trim().toUpperCase().optional(),
        badgeAttribue: vine.boolean().optional(),
        qualification: vine.string().trim().toUpperCase().optional().optional(),
        typeStage: vine.string().trim().toUpperCase().optional().optional(),
        statut: vine.string().toUpperCase().trim().optional(),
        entite: vine.number().optional(),
        responsable: vine.number().optional(),
        ageMin: vine.number().positive().optional(),
        ageMax: vine.number().positive().optional(),
        debut: vine.date().optional(),
        fin: vine.date().afterField('debut').optional()
    })
)