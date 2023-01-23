import Hash from '@ioc:Adonis/Core/Hash'
import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import User from 'App/Models/User';

export default class AuthenticationController {
    async login({ auth, request, response }: HttpContextContract){
        const { email, password } = request.only(['email', 'password']);

        const userData = await User.query()
            .where("email", email)
            .first()

        if(!!userData){
            if(!(await Hash.verify(userData.password, password))){
                return response.unauthorized({
                    status: "warning",
                    message: "E-mail ou senha incorretos."
                });
            }
    
            const token = await auth.use('api').generate(userData, {
                expiresIn: '1 day'
            });
    
            return response.ok({
                token,
                user: userData,
                status: "success",
                message: "Logado com sucesso."
            });
        } else {
            return response.unauthorized({
                status: "warning",
                message: "Usuário inexistente."
            });
        }

    }

    async register({ auth, request, response }: HttpContextContract){
        const { email, password } = request.only(['email', 'password']);

        const userExists = await User.query()
            .where("email", email)
            .first()

        if(!!userExists){
            return response.unauthorized({
                status: "warning",
                message: "Usuário já existente. Tente outro E-Mail."
            });
        }

        const userRegistered = await User.create({
            email,
            password
        });

        const token = await auth.use('api').generate(userRegistered, {
            expiresIn: '1 day'
        });

        return response.created({
            status: "success",
            message: "Usuário criado com sucesso.",
            user: userRegistered,
            token
        });
    }

    async logout({ auth, response }: HttpContextContract){
        await auth.use('api').revoke()

        return response.ok({
            status: "success",
            message: "Deslogado com sucesso."
        });
    }
}
