class Success{
    constructor(){
    }
    returnSuccess = (successCodeHTTP, message) => {
        return {code: successCodeHTTP, message}
    }
    userCreated = () => this.returnSuccess(201, {message: "Utilisateur-rice créé-e"})
    userFound = (userId, token) => this.returnSuccess(200, {userId: userId,token:token})
    sauceCreated = () => this.returnSuccess(201, {message: "Sauce créée"})
    sauceModified = () => this.returnSuccess(200, {message: "Sauce modifiée"})
    sauceDeleted = () => this.returnSuccess(200, {message: "Sauce suprrimée"})
    likeRecord = () => this.returnSuccess(200, {message: "Vote ajouté à la sauce"})
    unlikeRecord = () => this.returnSuccess(200, {message: "Vote supprimé de la sauce"})
    sauceFound = (sauce) => this.returnSuccess(200, sauce)
}

module.exports = Success