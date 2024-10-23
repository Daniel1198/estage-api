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
        sendReminderMail(7, stagiaire?.email!, 'stagiaire', stagiaire!)
        sendReminderMail(7, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        sendReminderMail(7, '', 'rh', stagiaire!)
    }
    if (moment(stage.fin).diff(date, 'days') === 3) {
        sendReminderMail(3, stagiaire?.email!, 'stagiaire', stagiaire!)
        sendReminderMail(3, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        sendReminderMail(3, '', 'rh', stagiaire!)
    }
    if (moment(stage.fin).diff(date, 'days') === 1) {  
        sendReminderMail(1, stagiaire?.email!, 'stagiaire', stagiaire!)
        sendReminderMail(1, stagiaire?.stages[0].responsable.email!, 'responsable', stagiaire!)
        sendReminderMail(1, '', 'rh', stagiaire!)
    }
}

// Fonction qui envoie un mail
async function sendReminderMail(daysBeforeEnd: number, email: string, personne: 'stagiaire' | 'responsable' | 'rh', stagiaire?: Stagiaire) {
    await mail.send((message) => {
        if (personne === 'stagiaire') {
            if (daysBeforeEnd !== 0) {
                message.to(email!).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_intern', { stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom, dateFin: moment(stagiaire?.stages[0].fin).format('DD.MM.YYYY')})
            } else {
                message.to(email!).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_intern_today', { stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom })
            }
        } else if (personne === 'responsable') {
            if (daysBeforeEnd !== 0) {
                message.to(email!).cc(['ange.kra@rti.ci']).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_manager', { responsable: stagiaire?.stages[0].responsable.nom + ' ' + stagiaire?.stages[0].responsable.prenom, stagiaire: stagiaire?.nom +' '+ stagiaire?.prenom, dateFin: moment(stagiaire?.stages[0].fin).format('DD.MM.YYYY')})
            } else {
                message.to(email!).cc(['ange.kra@rti.ci']).subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_manager_today', { responsable: stagiaire?.stages[0].responsable.nom + ' ' + stagiaire?.stages[0].responsable.prenom,stagiaire: stagiaire?.nom +' '+ stagiaire?.prenom })
            }
        } else if (personne === 'rh') {
            if (daysBeforeEnd!== 0) {
                message.to('ange.kra@rti.ci').subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_rh', { responsable: 'ASSISTANT RH', stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom, dateFin: moment(stagiaire?.stages[0].fin).format('DD.MM.YYYY'), nbrJours: daysBeforeEnd })
            } else {
                message.to('ange.kra@rti.ci').subject('Rappel : Fin de stage').htmlView('emails/end_internship_for_rh_today', { responsable: 'ASSISTANT RH', stagiaire: stagiaire?.nom + ' ' + stagiaire?.prenom })
            }
        }
    })
}

// Planification pour exécuter la tâche tous les jours à minuit
cron.schedule('0 0 * * *', async () => {
    const stagesActifs = await Stage.all()
    stagesActifs.map(async (stage) => {
        if (stage.statut !== 'TERMINE') 
            await changeStatus(stage)
    })
})
