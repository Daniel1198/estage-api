/*
|--------------------------------------------------------------------------
| HTTP kernel file
|--------------------------------------------------------------------------
|
| The HTTP kernel file is used to register the middleware with the server
| or the router.
|
*/

import Parametre from '#models/parametre'
import router from '@adonisjs/core/services/router'
import server from '@adonisjs/core/services/server'
import env from './env.js'
import encryption from '@adonisjs/core/services/encryption'

/**
 * The error handler is used to convert an exception
 * to a HTTP response.
 */
server.errorHandler(() => import('#exceptions/handler'))

/**
 * The server middleware stack runs middleware on all the HTTP
 * requests, even if there is no route registered for
 * the request URL.
 */
server.use([
  () => import('#middleware/container_bindings_middleware'),
  () => import('#middleware/force_json_response_middleware'),
  () => import('@adonisjs/cors/cors_middleware'),
])

/**
 * The router middleware stack runs middleware on all the HTTP
 * requests with a registered route.
 */
router.use([() => import('@adonisjs/core/bodyparser_middleware'), () => import('@adonisjs/auth/initialize_auth_middleware')])

/**
 * Named middleware collection must be explicitly assigned to
 * the routes or the routes group.
 */
export const middleware = router.named({
  auth: () => import('#middleware/auth_middleware')
})

async function configEnv() {
  const parametres = await Parametre.query()

  if (parametres.length > 0) {
    parametres.map(param => {
      if (param.code === 'MAIL_CONFIG') {
        const p = (encryption.decrypt(param.valeur) as string)
        env.set('SMTP_HOST', p.split(',')[0])
        env.set('SMTP_PORT', p.split(',')[1])
        env.set('SMTP_NAME', p.split(',')[2])
        env.set('SMTP_USERNAME', p.split(',')[3])
        env.set('SMTP_PASSWORD', p.split(',')[4])
      } else {
        env.set(param.code, param.valeur)
      }
    })
  }
}

configEnv()
