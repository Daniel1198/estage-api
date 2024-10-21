import cron from 'node-cron'
import mail from '@adonisjs/mail/services/main'
import Stage from '#models/stage'
import moment from 'moment'
import Stagiaire from '#models/stagiaire'

// Fonction de changement du statut d'un stage
async function changeStatus(stage: Stage) {
    const date = new Date()
    if (moment(date).isBetween(stage.debut, stage.fin)) {
        if (moment(stage.fin).diff(date, 'days') <= 7) {
            stage.statut = 'MOINS 1 SEMAINE'
        } else {
            stage.statut = 'ACTIF'
        }
        stage.save()
    } else if (moment(date).isAfter(stage.fin)) {
        stage.statut = 'TERMINE'
        stage.save()
    }
    updateStagiaireStatut(stage)
}

// Fonction de changement du statut stagiaire
async function updateStagiaireStatut(stage: Stage) {
    const date = new Date()
    const stagiaire = await Stagiaire.query().where({ id: stage.stagiaireId }).preload('stages', (p) => p.preload('responsable').preload('entite').orderBy('fin', 'desc').first()).first()
    await Stagiaire.query().where({ id: stage.stagiaireId }).update({ statut: stagiaire?.stages[0].statut })
    if (moment(stage.fin).diff(date, 'days') === 7) {
        cron.schedule('30 12 * * *', async () => {
            sendReminderMail(7, stagiaire?.email!, 'stagiaire')
            sendReminderMail(7, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        })
    }
    if (moment(stage.fin).diff(date, 'days') === 3) {
        cron.schedule('30 17 * * *', async () => {
            sendReminderMail(3, stagiaire?.email!, 'stagiaire')
            sendReminderMail(3, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        })
    }
    if (moment(stage.fin).diff(date, 'days') === 0) {
        cron.schedule('30 12 * * *', async () => {
            sendReminderMail(0, stagiaire?.email!, 'stagiaire')
            sendReminderMail(0, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        })
    }
}

// Fonction qui envoie un mail
async function sendReminderMail(daysBeforeEnd: number, email: string, personne: 'stagiaire' | 'responsable', stagiaire?: Stagiaire) {
    await mail.send((message) => {
        message
            .to(email)
            .subject('Rappel : Fin de stage')
            .text(
                personne ==='stagiaire' ? 
                ( daysBeforeEnd !== 0 ? `Rappel : Fin de votre stage dans ${daysBeforeEnd} jours` : `Rappel : Votre stage finit aujourd'hui`) : 
                ( daysBeforeEnd !== 0 ? `Rappel : le stagiaire ${stagiaire?.nom} ${stagiaire?.prenom} à la direction ${stagiaire?.stages[0].entite.intitule} termine son stage dans ${daysBeforeEnd} jours` : 
                    `Rappel : le stagiaire ${stagiaire?.nom} ${stagiaire?.prenom} à la direction ${stagiaire?.stages[0].entite.intitule} termine son stage aujourd'hui.`)
            )
    })
}

// Planification pour exécuter la tâche tous les jours à minuit
cron.schedule('* * * * *', async () => {
    const stagesActifs = await Stage.all()
    stagesActifs.forEach(async (stage) => {
        if (stage.statut !== 'TERMINE') 
            await changeStatus(stage)
    })
})
