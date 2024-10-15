import vine from '@vinejs/vine'

export const storeChiefValidator = vine.compile(
    vine.object({
        nom: vine.string().trim().minLength(2).toUpperCase(),
        prenom: vine.string().trim().toUpperCase().minLength(2),
        fonction: vine.string().trim().toUpperCase().minLength(3),
        poste: vine.string().trim().toUpperCase().minLength(3).optional(),
        email: vine.string().trim().toLowerCase().email().minLength(6),
        telephone: vine.string().trim().fixedLength(10).alphaNumeric().optional().nullable(),
        estDirecteur: vine.boolean().optional(),
        entiteId: vine.number()
    })
) 

export const editChiefValidator = vine.compile(
    vine.object({
        fonction: vine.string().trim().toUpperCase().minLength(3).optional(),
        poste: vine.string().trim().toUpperCase().minLength(3).optional().nullable(),
        email: vine.string().trim().toLowerCase().email().minLength(6).optional(),
        telephone: vine.string().trim().fixedLength(10).alphaNumeric().nullable().optional(),
        estDirecteur: vine.boolean().optional(),
        entiteId: vine.number().optional()
    })
)