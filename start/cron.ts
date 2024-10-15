import cron from 'node-cron'
import mail from '@adonisjs/mail/services/main'

// Fonction qui envoie un mail
async function sendReminderMail(daysBeforeEnd: number) {
    await mail.send((message) => {
        message
            .to('ange.kra@rti.ci')
            .subject(`Rappel : Fin de votre stage dans ${daysBeforeEnd} jours`)
            .text('ton stage fini bientôt') // Assurez-vous d'avoir une vue d'email
    })
}

// Planification pour exécuter la tâche tous les jours à minuit
cron.schedule('04 12 * * *', async () => {
    // const today = DateTime.now()
    await sendReminderMail(7)

    // Récupérer tous les stagiaires
    // const stagiaires = await Stagiaire.all()

    // for (const stagiaire of stagiaires) {
    //     const endDate = DateTime.fromISO(stagiaire.stages)

    //     const daysLeft = endDate.diff(today, 'days').days

    //     // Envoie de mail une semaine avant, 3 jours avant et 2 jours avant
    //     if (daysLeft === 7) {
    //         await sendReminderMail(stagiaire, 7)
    //     } else if (daysLeft === 3) {
    //         await sendReminderMail(stagiaire, 3)
    //     } else if (daysLeft === 2) {
    //         await sendReminderMail(stagiaire, 2)
    //     }
    // }
})
