import Route from '@ioc:Adonis/Core/Route'

Route.post("/login", "AuthenticationController.login");
Route.post("/register", "AuthenticationController.register");
Route.get("/logout", "AuthenticationController.logout").middleware(['auth']);