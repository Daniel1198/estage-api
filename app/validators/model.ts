import vine from '@vinejs/vine'

export const storeModelValidator = vine.compile(
    vine.object({
        intitule: vine.string().toUpperCase().minLength(4).trim()
    })
)

export const editModelValidator = vine.compile(
    vine.object({
        intitule: vine.string().toUpperCase().minLength(4).trim().optional()
    })
)

export const editPermissionsValidator = vine.compile(
    vine.object({
        permissions: vine.array(vine.number())
    })
)