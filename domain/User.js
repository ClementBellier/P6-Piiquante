const crypt = require('../encryption/crypt')
const tokenBuilder = require('../encryption/token')

const Errors = require('../domain/Error')
const Success = require('../domain/Success')

const userInDB = require('../percistance/user')

class User {
    constructor(email, password){
        this.email = email
        this.password = password
        this.userId = ""
    }
    saveUser = async () => {
        const encryptPassword = await crypt.cryptPassword(this.password)
        if(encryptPassword.error) return new Errors(encryptPassword.error).serverError()
        this.password = encryptPassword.hash
        const FalseOrErrorMessage = await userInDB.saveUserInDB(this.email, this.password)
        if(!FalseOrErrorMessage) return new Success().userCreated()
        return new Errors(FalseOrErrorMessage).badRequest()
        
    }
    findUser = async () => {
        const isUserInDB = await userInDB.findUserInDB((this.email))

        if(!isUserInDB) return new Errors().userNotFound()

        this.userId = isUserInDB._id
        const validPassword = await crypt.comparePassword(this.password, isUserInDB.password)

        if(!validPassword) return new Errors().wrongPassword()

        const token = tokenBuilder.signToken(this.userId)
        return new Success().userFound(this.userId, token)
    }
    authorize = (token) => {
        const decodedToken = tokenBuilder.verifyToken(token)
        if(!decodedToken) return new Errors('Requête non authentifiée !').unauthorize()
        return {code: 200, userId: decodedToken.userId}
    }
}

module.exports = User