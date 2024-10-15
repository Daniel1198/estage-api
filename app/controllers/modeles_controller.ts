import Modele from '#models/modele';
import Permission from '#models/permission';
import { editModelValidator, editPermissionsValidator, storeModelValidator } from '#validators/model';
import type { HttpContext } from '@adonisjs/core/http'

export default class ModelesController {
    async store({ request, response }: HttpContext) {
        try {
            const payload = await request.validateUsing(storeModelValidator)
            const modele = await Modele.create(payload);
            return response.status(201).json({ status: 201, message: 'Modèle créé avec succès !', data: modele })
        } catch (error) {
            return response.json(error)
        }
    }

    async read({ response }: HttpContext) {
        try {
            const modeles = await Modele.query().preload('permissions')
            return response.status(201).json(modeles)
        } catch (error) {
            return response.json(error)
        }
    }

    async find({ request, response }: HttpContext) {
        try {
            const modele = await Modele.query().where({ 'id': request.params().id }).preload('permissions').firstOrFail()
            return response.status(201).json(modele)
        } catch (error) {
            return response.json(error)
        }
    }

    async delete({ request, response }: HttpContext) {
        try {
            const modele = await Modele.findOrFail(request.params().id)
            modele.related('permissions').detach()
            modele.delete()
            return response.status(201).json({ status: 201, message: 'Modèle supprimé avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async edit({ request, response }: HttpContext) {
        try {
            const modele = await Modele.findOrFail(request.params().id)
            const payload = await request.validateUsing(editModelValidator)
            // modele.related('permissions').detach()
            modele.intitule = payload.intitule!
            // modele.related('permissions').attach(payload.permissions)
            modele.save()
            return response.status(201).json({ status: 201, message: 'Modèle modifié avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async attachPermissions({ request, response }: HttpContext) {
        try {
            const modele = await Modele.findOrFail(request.params().id)
            const payload = await request.validateUsing(editPermissionsValidator)
            modele.related('permissions').detach()
            modele.related('permissions').attach(payload.permissions)
            modele.save()
            return response.status(201).json({ status: 201, message: 'Permissions ajoutées avec succès !' })
        } catch (error) {
            return response.json(error)
        }
    }

    async getPermissions({ request, response }: HttpContext) {
        try {
            const modele = await Modele.query().where({ 'id': request.params().id }).preload('permissions').firstOrFail()
            const permissions = await Permission.all()
            const access = permissions.map((permission) => {
                const p = {
                    checked: false,
                    id: permission.id,
                    code: permission.code,
                    intitule: permission.intitule
                }
                if (modele.permissions.some((perm) => perm.id === permission.id)) {
                    p.checked = true
                }
                return p
            })
            return response.status(201).json(access)
        } catch (error) {
            return response.json(error)
        }
    }
}