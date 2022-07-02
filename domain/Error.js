class Error{
    constructor(error){
        this.error = error
    }
    returnError = (errorCodeHTTP) => {
        return {code: errorCodeHTTP,message:{error: this.error}}
    }
    serverError = () => this.returnError(500)
    badRequest = () => this.returnError(400)
    unauthorized = () => this.returnError(401)
    userNotFound = () => {
        this.error = 'Utilisateur non trouvé !'
        return this.unauthorized()
    }
    wrongPassword = () => {
        this.error = 'Mot de pass incorrect !'
        return this.unauthorized()
    }
}

module.exports = Error