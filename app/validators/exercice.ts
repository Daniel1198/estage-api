import vine from '@vinejs/vine'

export const storeExerciseValidator = vine.compile(
    vine.object({
        code: vine.string().trim().maxLength(4),
        debut: vine.date(),
        fin: vine.date().afterField('debut')
    })
)

export const editExerciseValidator = vine.compile(
    vine.object({
        debut: vine.date().optional().requiredIfExists('fin'),
        fin: vine.date().afterField('debut').optional().requiredIfExists('debut')
    })
)