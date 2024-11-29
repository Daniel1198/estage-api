import vine from '@vinejs/vine'

export const storeNotificationEmailValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email()
    })
) 