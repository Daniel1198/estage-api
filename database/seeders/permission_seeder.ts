import Permission from '#models/permission'
import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class extends BaseSeeder {
  async run() {
    await Permission.createMany([
      { code: 'EDIT_EXERCISE', intitule: 'Modifier un exercice' },
      { code: 'DELETE_EXERCISE', intitule: 'Supprimer un exercice' },
      { code: 'ACTIVE_EXERCISE', intitule: 'Activer un exercice' },
      { code: 'SHOW_EXERCISES', intitule: 'Afficher tous les exercices' },
      { code: 'SHOW_MODELS', intitule: 'Afficher tous les modèles' },
      { code: 'EDIT_MODEL', intitule: 'Modifier un modèle' },
      { code: 'DELETE_MODEL', intitule: 'Supprimer un modèle' },
      { code: 'ATTACH_PERMISSION_MODEL', intitule: 'Attribuer des permissions à un modèle' },
      { code: 'SHOW_USERS', intitule: 'Afficher tous les utilisateurs' },
      { code: 'EDIT_USER', intitule: 'Modifier un utilisateur' },
      { code: 'DELETE_USER', intitule: 'Supprimer un utilisateur' },
      { code: 'ATTACH_PERMISSIONS_USER', intitule: 'Attribuer des permissions à un utilisateur' },
      { code: 'SET_MODEL_PERMISSION_TO_USER', intitule: 'Définir la permission de modèle pour un utilisateur' },
      { code: 'RESET_PASSWORD', intitule: 'Réinitialiser le mot de passe' },
      { code: 'EDIT_ENTITY', intitule: 'Modifier une entité' },
      { code: 'SHOW_ENTITIES', intitule: 'Afficher toutes les entités' },
      { code: 'DELETE_ENTITY', intitule: 'Supprimer une entité' },
      { code: 'EDIT_TEACHER', intitule: 'Modifier un enseignant' },
      { code: 'SHOW_TEACHERS', intitule: 'Afficher tous les enseignants' },
      { code: 'DELETE_TEACHER', intitule: 'Supprimer un enseignant' },
      { code: 'EDIT_INTERN', intitule: 'Modifier un stagiaire' },
      { code: 'SHOW_ACTIVES_INTERNS', intitule: 'Afficher les stagiaires actifs' },
      { code: 'SHOW_INPUTS_INTERNS', intitule: 'Afficher les entrées des stagiaires' },
      { code: 'SHOW_INTERNS_AT_END', intitule: 'Afficher les stagiaires en fin de stage' },
      { code: 'SHOW_INTERNS_ARCHIVE', intitule: 'Afficher les archives des stagiaires' },
      { code: 'DELETE_INTERN', intitule: 'Supprimer un stagiaire' },
      { code: 'PRINT_INTERNSHIP_NOTE', intitule: 'Imprimer la note de stage' },
      { code: 'PRINT_END_INTERNSHIP_NOTE', intitule: 'Imprimer la note de fin de stage' },
      { code: 'SHOW_DETAILS_INTERN', intitule: 'Afficher les détails d’un stagiaire' },
      { code: 'SHOW_DOCUMENTS', intitule: 'Afficher les documents' },
      { code: 'EDIT_INTERNSHIP', intitule: 'Modifier un stage' },
      { code: 'SHOW_INTERNSHIPS', intitule: 'Afficher tous les stages' },
      { code: 'DELETE_INTERNSHIP', intitule: 'Supprimer un stage' },
      { code: 'SHOW_DETAILS_INTERNSHIP', intitule: 'Afficher les détails d’un stage' },
      { code: 'ACCESS_DASHBOARD', intitule: 'Accéder au tableau de bord' },
      { code: 'ACCESS_SEARCH', intitule: 'Accéder à la recherche' },
    ])
  }
}