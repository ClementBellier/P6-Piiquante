class Success{
    constructor(){
    }
    returnSuccess = (successCodeHTTP, message) => {
        return {code: successCodeHTTP,message:{message: message}}
    }
    userCreated = () => this.returnSuccess(201, "Utilisateur créé")
    userFound = (user) => this.returnSuccess(200, user)
}

module.exports = Success