import vine from '@vinejs/vine'

export const storeStageValidator = vine.compile(
    vine.object({
        type: vine.string().toUpperCase().trim(),
        debut: vine.date(),
        fin: vine.date().afterField('debut'),
        renouvellement: vine.boolean().optional(),
        statut: vine.string().toUpperCase().trim(),
        stagiaireMatricule: vine.string(),
        entiteId: vine.number(),
        responsableId: vine.number().optional().nullable()
    })
)

export const editStageValidator = vine.compile(
    vine.object({
        type: vine.string().toUpperCase().trim().optional(),
        debut: vine.date().optional().requiredIfExists('fin'),
        fin: vine.date().afterField('debut').optional().requiredIfExists('debut'),
        renouvellement: vine.boolean().optional(),
        responsableId: vine.number().optional().nullable(),
        entiteId: vine.number().optional()
    })
)