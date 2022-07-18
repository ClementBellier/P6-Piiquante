const crypt = require('../encryption/crypt')
const tokenBuilder = require('../encryption/token')

const ApiErrors = require('../domain/ApiErrors')
const Success = require('../domain/Success')

const userInDB = require('../persistence/user')

class User {
    constructor(email, password){
        this.email = email
        this.password = password
        this.userId = ""
    }
    saveUser = async () => {
        const encryptPassword = await crypt.cryptPassword(this.password)
        if(encryptPassword.error) return new ApiErrors(encryptPassword.error).serverError()
        this.password = encryptPassword.hash
        const savedUser = await userInDB.saveUserInDB(this.email, this.password)
        if(savedUser.error) return new ApiErrors(savedUser.error).badRequest()
        return new Success().userCreated()        
    }
    findUser = async () => {
        const isUserInDB = await userInDB.findUserInDB((this.email))

        if(!isUserInDB) return new ApiErrors().userNotFound()
        if(isUserInDB.error) return new ApiErrors(isUserInDB.error).serverError()

        this.userId = isUserInDB._id
        const validPassword = await crypt.comparePassword(this.password, isUserInDB.password)

        if(!validPassword) return new ApiErrors().wrongPassword()

        const token = tokenBuilder.signToken(this.userId)
        return new Success().userFound(this.userId, token)
    }
    authorize = (token) => {
        const decodedToken = tokenBuilder.verifyToken(token)
        if(!decodedToken || decodedToken.error) return new ApiErrors('Requête non authentifiée !').unauthorized()
        return {code: 200, userId: decodedToken.userId}
    }
}

module.exports = User