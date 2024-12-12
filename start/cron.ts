import cron from 'node-cron'
import mail from '@adonisjs/mail/services/main'
import Stage from '#models/stage'
import moment from 'moment'
import Stagiaire from '#models/stagiaire'
import env from './env.js'
import Responsable from '#models/responsable'
import NotificationEmail from '#models/notification_email'
import Notification from '#models/notification'

// Fonction de changement du statut d'un stage
async function changeStatus(stage: Stage) {
    const date = new Date()
    if (moment(date).isBetween(stage.debut, stage.fin)) {
        stage.statut = 'ACTIF'
        if (moment(stage.fin).diff(date, 'days') <= 7) {
            stage.statut = 'MOINS 1 SEMAINE'
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
    const stagiaire = await Stagiaire.query().where({ id: stage.stagiaireId }).preload('user').preload('stages', (p) => p.preload('responsable').preload('entite').orderBy('fin', 'desc').first()).first()
    await Stagiaire.query().where({ id: stage.stagiaireId }).update({ statut: stagiaire?.stages[0].statut })

    if (moment(stage.fin).diff(date, 'days') === +env.get('DURATION_BEFORE_ALERT')!) {
        sendReminderMail(+env.get('DURATION_BEFORE_ALERT')!, stagiaire?.email!, 'stagiaire', stagiaire!)
        sendReminderMail(+env.get('DURATION_BEFORE_ALERT')!, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        sendReminderMail(+env.get('DURATION_BEFORE_ALERT')!, '', 'rh', stagiaire!)
    }
    if (moment(stage.fin).diff(date, 'days') === 0) {
        // sendReminderMail(0, stagiaire?.email!, 'stagiaire', stagiaire!)
        sendReminderMail(0, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        // sendReminderMail(0, stagiaire?.user.email!, 'rh', stagiaire!)
    }
}

// Fonction qui envoie un mail
async function sendReminderMail(daysBeforeEnd: number, email: string, personne: 'stagiaire' | 'responsable' | 'rh', stagiaire?: Stagiaire) {
    await mail.send(async (message) => {
        if (personne === 'stagiaire') {
            if (daysBeforeEnd !== 0) {
                message.to(email!).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_intern', { stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom, dateFin: moment(stagiaire?.stages[0].fin).format('DD.MM.YYYY') })
            } else {
                message.to(email!).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_intern_today', { stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom })
            }
        } else if (personne === 'responsable') {
            const directeur = await Responsable.query().where({ estDirecteur: true, entiteId: stagiaire?.stages[0].entiteId }).first()

            if (daysBeforeEnd !== 0) {
                message.to(email!).cc(directeur?.email!).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_manager', { responsable: stagiaire?.stages[0].responsable.nom + ' ' + stagiaire?.stages[0].responsable.prenom, stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom, dateFin: moment(stagiaire?.stages[0].fin).format('DD.MM.YYYY') })
            } else {
                message.to(email!).cc(directeur?.email!).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_manager_today', { responsable: stagiaire?.stages[0].responsable.nom + ' ' + stagiaire?.stages[0].responsable.prenom, stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom })
            }
        } else if (personne === 'rh') {
            const notification = new Notification()
            const emails: string[] = [] as string[];
            const notifEmails = await NotificationEmail.query()
            notifEmails.map((e: NotificationEmail) => emails.push(e.email))
            if (daysBeforeEnd !== 0) {
                notification.titre = 'Rappel : Fin de stage'
                notification.message = 'Le stagiaire suivant a une date de fin proche : ' + stagiaire?.nom + ' ' + stagiaire?.prenom + ' le ' + moment(stagiaire?.stages[0].fin).format('DD.MM.YYYY') + '.'
                message.to(stagiaire?.user.email!)
                .cc(emails)
                .subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_rh', { responsable: stagiaire?.user.fullName, stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom, dateFin: moment(stagiaire?.stages[0].fin).format('DD.MM.YYYY'), nbrJours: daysBeforeEnd })
            } else {
                notification.titre = 'Rappel : Fin de stage'
                notification.message = 'Le stagiaire suivant termine son stage aujourd\'hui : ' + stagiaire?.nom + ' ' + stagiaire?.prenom + '.'
                message.to(stagiaire?.user.email!)
                .cc(emails)
                .subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_rh_today', { responsable: stagiaire?.user.fullName, stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom })
            }
            notification.save()
        }
    })
}

// Planification pour exécuter la tâche tous les jours à minuit
cron.schedule('30 5 * * *', async () => {
    const stages = await Stage.all()
    stages.map(async (stage) => {
        if (stage.statut !== 'TERMINE')
            await changeStatus(stage)
    })
})