import type { HttpContext } from '@adonisjs/core/http'
import { errors as authErrors } from '@adonisjs/auth'
import jsreport from '@jsreport/nodejs-client'

export default class NotesController {
    async generate({ request, response }: HttpContext) {
        try {
            const client = jsreport("http://localhost:5488")
            const report = await client.render(request.body())
            const reportBuffer = await report.body()

            // Configurer l'en-tête pour un fichier PDF
            response.header('Content-Type', 'application/pdf')

            // Envoyer le contenu du PDF en tant que buffer
            return response.send(reportBuffer)
        } catch (error) {
            if (error instanceof authErrors.E_UNAUTHORIZED_ACCESS) {
                response.json({ status: 401, message: error.message })
            } else {
                response.json(error)
            }
        }
    }
}