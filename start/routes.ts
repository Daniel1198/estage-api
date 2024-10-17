import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import app from '@adonisjs/core/services/app'
const ExercicesController = () => import('#controllers/exercices_controller')
const ResponsablesController = () => import('#controllers/responsables_controller')
const ModelesController = () => import('#controllers/modeles_controller')
const UsersController = () => import('#controllers/users_controller')
const StagesController = () => import('#controllers/stages_controller')
const AuthController = () => import('#controllers/auth_controller')
const PermissionsController = () => import('#controllers/permissions_controller')
const EntitesController = () => import('#controllers/entites_controller')
const StagiairesController = () => import('#controllers/stagiaires_controller')

router.group(() => {
  // exercices routes
  router.group(() => {
    router.post('', [ExercicesController, 'store'])
    router.get('', [ExercicesController, 'read'])
    router.get('/:id', [ExercicesController, 'find']).where('id', router.matchers.number())
    router.put('/:id', [ExercicesController, 'edit']).where('id', router.matchers.number())
    router.get('/active/:id', [ExercicesController, 'active']).where('id', router.matchers.number())
    router.get('/active', [ExercicesController, 'findActive'])
    router.delete('/:id', [ExercicesController, 'delete']).where('id', router.matchers.number())
  }).prefix('/exercices')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // entites routes
  router.group(() => {
    router.post('', [EntitesController, 'store'])
    router.get('', [EntitesController, 'read'])
    router.get('/:id', [EntitesController, 'find']).where('id', router.matchers.number())
    router.put('/:id', [EntitesController, 'edit']).where('id', router.matchers.number())
    router.delete('/:id', [EntitesController, 'delete']).where('id', router.matchers.number())
  }).prefix('/entites')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // encadreurs routes
  router.group(() => {
    router.post('', [ResponsablesController, 'store'])
    router.get('', [ResponsablesController, 'read'])
    router.get('/:id', [ResponsablesController, 'find']).where('id', router.matchers.number())
    router.put('/:id', [ResponsablesController, 'edit']).where('id', router.matchers.number())
    router.delete('/:id', [ResponsablesController, 'delete']).where('id', router.matchers.number())
  }).prefix('/responsables')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // modèles routes
  router.group(() => {
    router.post('', [ModelesController, 'store'])
    router.post('/:id/permissions', [ModelesController, 'attachPermissions'])
    router.get('/:id/permissions', [ModelesController, 'getPermissions'])
    router.get('', [ModelesController, 'read'])
    router.get('/:id', [ModelesController, 'find']).where('id', router.matchers.number())
    router.put('/:id', [ModelesController, 'edit']).where('id', router.matchers.number())
    router.delete('/:id', [ModelesController, 'delete']).where('id', router.matchers.number())
  }).prefix('/modeles')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // permissions routes
  router.group(() => {
    router.get('', [PermissionsController, 'read'])
  }).prefix('/permissions')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // avatar routes
  router.get('/uploads/:filename', async ({ params, response }) => {
    const imagePath = app.publicPath(`uploads/avatars/${params.filename}`)
    return response.download(imagePath)
  })

  // utilisateurs routes
  router.group(() => {
    router.post('', [UsersController, 'store'])
    router.get('', [UsersController, 'read'])
    router.post('/:id/permissions', [UsersController, 'attachPermissions'])
    router.get('/:id/permissions', [UsersController, 'getPermissions'])
    router.get('/:id', [UsersController, 'find']).where('id', router.matchers.number())
    router.put('/:id', [UsersController, 'edit']).where('id', router.matchers.number())
    router.delete('/:id', [UsersController, 'delete']).where('id', router.matchers.number())
  }).prefix('/users')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // stages routes
  router.group(() => {
    router.post('', [StagesController, 'store'])
    router.get('', [StagesController, 'read'])
    router.get('/:id', [StagesController, 'find']).where('id', router.matchers.number())
    router.put('/:id', [StagesController, 'edit']).where('id', router.matchers.number())
    router.delete('/:id', [StagesController, 'delete']).where('id', router.matchers.number())
  }).prefix('/stages')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // stagiaires routes
  router.group(() => {
    router.post('', [StagiairesController, 'store'])
    router.get('', [StagiairesController, 'read'])
    router.get('/:id', [StagiairesController, 'find']).where('id', router.matchers.number())
    router.put('/:id', [StagiairesController, 'edit']).where('id', router.matchers.number())
    router.delete('/:id', [StagiairesController, 'delete']).where('id', router.matchers.number())
  }).prefix('/stagiaires')
  .use(middleware.auth({
    guards: ['api'],
  }))

  // auth routes
  router.group(() => {
    router.post('', [AuthController, 'login'])
    router.get('/reset-password/:id', [AuthController, 'resetPassword']).where('id', router.matchers.number())
    .use(middleware.auth({
      guards: ['api'],
    }))
    router.put('/update-password', [AuthController, 'updatePassword'])
    .use(middleware.auth({
      guards: ['api'],
    }))
  }).prefix('/auth')
}).prefix('/api/v1')
