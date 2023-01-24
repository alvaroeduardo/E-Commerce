import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'

import Profile from 'App/Models/Profile'
import User from 'App/Models/User';

export default class ProfilesController {
    async index({ auth, response }: HttpContextContract){
        if(auth.isLoggedIn && !!auth.user){
            const userProfile = await Profile.query()
                .where('user_id', auth.user.id)
                .preload('user')
                .first()

            if(!userProfile){
                return response.abort({
                    status: 'warning',
                    message: 'Parece que suas informações de conta ainda não estão completas. Por favor, complete o cadastro para acessar todos os recursos do nosso sistema.',
                    redirect: true
                });
            }

            return response.ok({
                status: 'success',
                profile: userProfile
            });
        } else {
            return response.abort({
                status: 'warning',
                message: 'É necessário fazer login para acessar esta página. Por favor, faça login com suas informações de conta ou crie uma conta se ainda não tiver uma.'
            });
        }
    }

    async store({ auth, request, response }: HttpContextContract){
        const { nome, genero, enderecoPrincipal, enderecoSecundario, celular, cpf } = request.only(['nome', 'genero', 'enderecoPrincipal', 'enderecoSecundario', 'celular', 'cpf'])

        if(auth.isLoggedIn && !!auth.user){
            
            const existsProfile = await Profile.query()
                .where('cpf', cpf)
                .andWhere('user_id', auth.user.id)
                .first()

            if(!!existsProfile){
                return response.unauthorized({
                    status: 'error',
                    message: 'Os dados informados já estão cadastrados no sistema, por favor verifique se os dados estão corretos ou entre em contato com o suporte para mais informações.',
                    redirect: true
                });
            }

            await Profile.create({
                userId: auth.user.id,
                name: nome,
                genre: genero,
                enderecoPrincipal,
                enderecoSecundario,
                celular,
                cpf
            });

            return response.created({
                status: 'success',
                message: 'Olá! Esperamos que você tenha uma excelente experiência com nossos produtos e serviços. Se precisar de qualquer ajuda, não hesite em entrar em contato conosco. Boas compras!'
            });

        } else {
            return response.abort({
                status: 'warning',
                message: 'É necessário fazer login para acessar esta página. Por favor, faça login com suas informações de conta ou crie uma conta se ainda não tiver uma.'
            });
        }
    }

    async update({ auth, params, request, response }: HttpContextContract){
        const { nome, genero, enderecoPrincipal, enderecoSecundario, celular, cpf, email, password } = request.only(['nome', 'genero','enderecoPrincipal', 'enderecoSecundario', 'celular', 'cpf', 'email', 'password'])

        if(auth.isLoggedIn && !!auth.user){
            
            const profile = await Profile.query()
                .where('secure_id', params.id)
                .first()

            const user = await User.query()
                .where('id', auth.user.id)
                .first()

            if(!user){
                return response.abort({
                    status: 'warning',
                    message: 'Não foi possível encontrar suas informações de conta. Por favor, crie uma nova conta para continuar usando nosso sistema.',
                    redirect: true
                });
            }

            if(!profile){
                return response.abort({
                    status: 'warning',
                    message: 'Parece que suas informações de conta ainda não estão completas. Por favor, complete o cadastro para acessar todos os recursos do nosso sistema.',
                    redirect: true
                });
            }

            await profile.merge({
                name: !nome ? profile.name : nome,
                genre: !genero ? profile.genre : genero,
                enderecoPrincipal: !enderecoPrincipal ? profile.enderecoPrincipal : enderecoPrincipal,
                enderecoSecundario: !enderecoSecundario ? profile.enderecoSecundario : enderecoSecundario,
                celular: !celular ? profile.celular : celular,
                cpf: !cpf ? profile.cpf : cpf
            });

            await user.merge({
                email: !email ? user.email : email,
                password: !password ? user.password : password
            });

            return response.ok({
                status: 'success',
                message: 'Suas informações foram atualizadas com sucesso! Obrigado por manter seus dados atualizados.'
            });

        } else {
            return response.abort({
                status: 'warning',
                message: 'É necessário fazer login para acessar esta página. Por favor, faça login com suas informações de conta ou crie uma conta se ainda não tiver uma.'
            });
        }
    }
}
