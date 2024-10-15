import vine from '@vinejs/vine'

export const storeEntiteValidator = vine.compile(
    vine.object({
        code: vine.string().trim().minLength(2).toUpperCase(),
        intitule: vine.string().trim().toUpperCase(),
        type: vine.string().trim().toUpperCase(),
        entiteId: vine.number().optional().nullable()
    })
) 

export const editEntiteValidator = vine.compile(
    vine.object({
        type: vine.string().trim().toUpperCase().optional(),
        intitule: vine.string().trim().toUpperCase().optional(),
        entiteId: vine.number().optional().nullable()
    })
)