import vine from '@vinejs/vine'

export const storeStageValidator = vine.compile(
    vine.object({
        type: vine.enum(['PERFECTIONNEMENT', 'VALIDATION', 'IMMERSION']),
        debut: vine.date(),
        fin: vine.date().afterField('debut'),
        statut: vine.string().toUpperCase().trim(),
        stagiaireId: vine.number(),
        exerciceId: vine.number(),
        responsableId: vine.number().optional()
    })
)

export const editStageValidator = vine.compile(
    vine.object({
        type: vine.enum(['PERFECTIONNEMENT', 'VALIDATION', 'IMMERSION']).optional(),
        debut: vine.date().optional().requiredIfExists('fin'),
        fin: vine.date().afterField('debut').optional().requiredIfExists('debut'),
        responsableId: vine.number().optional()
    })
)