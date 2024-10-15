import vine from '@vinejs/vine'

export const storeUserValidator = vine.compile(
    vine.object({
        code: vine.string().trim().minLength(4).toUpperCase().alpha(),
        fullName: vine.string().toUpperCase().minLength(5).trim(),
        job: vine.string().trim().toUpperCase(),
        email: vine.string().trim().email().toLowerCase(),
        image: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional()
    })
)

export const editUserValidator = vine.compile(
    vine.object({
        fullName: vine.string().toUpperCase().minLength(5).trim().optional(),
        job: vine.string().trim().toUpperCase().optional(),
        email: vine.string().trim().email().toLowerCase().optional(),
        image: vine.file({
            size: '2mb',
            extnames: ['jpg', 'jpeg', 'png']
        }).nullable().optional()
    })
)

export const updatePasswordValidator = vine.compile(
    vine.object({
        newPassword: vine.string().trim().minLength(6).alphaNumeric()
    })
)