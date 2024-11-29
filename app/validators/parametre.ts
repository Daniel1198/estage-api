import vine from '@vinejs/vine'

export const storeOrEditSettingValidator = vine.compile(
    vine.object({
        code: vine.string().trim().toUpperCase(),
        valeur: vine.string().trim()
    })
) 