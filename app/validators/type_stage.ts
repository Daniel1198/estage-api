import vine from '@vinejs/vine'

export const storeTypeStageValidator = vine.compile(
    vine.object({
        intitule: vine.string().toUpperCase().minLength(3).trim(),
        duree: vine.number().positive().optional()
    })
)

export const editTypeStageValidator = vine.compile(
    vine.object({
        intitule: vine.string().toUpperCase().minLength(3).trim().optional(),
        duree: vine.number().positive().optional().nullable()
    })
)