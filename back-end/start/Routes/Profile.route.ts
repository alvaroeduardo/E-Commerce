import Route from '@ioc:Adonis/Core/Route'

Route.resource('/profile', 'ProfilesController').middleware({
    '*': ['auth']
})