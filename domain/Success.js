class Success{
    constructor(){
    }
    returnSuccess = (successCodeHTTP, message) => {
        return {code: successCodeHTTP, message}
    }
    userCreated = () => this.returnSuccess(201, {message: "Utilisateur créé"})
    userFound = (userId, token) => this.returnSuccess(200, {userId: userId,token:token})
    sauceCreated = () => this.returnSuccess(201, {message: "Sauce créée"})
    sauceDeleted = () => this.returnSuccess(200, {message: "Sauce suprrimée"})
    sauceFound = (sauce) => this.returnSuccess(200, sauce)
}

module.exports = Success