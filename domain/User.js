const crypt = require('../encryption/crypt')
const token = require('../encryption/token')

const Error = require('../domain/Error')
const Success = require('../domain/Success')

const userInDB = require('../percistance/user')

class User {
    constructor(email, password){
        this.email = email
        this.password = password
        this.userId = ""
    }
    saveUser = async () => {
        const password = await crypt.cryptPassword(this.password)
        if(password.error) return new Error(this.password.error).serverError()
        this.password = password.hash
        const isAnError = await userInDB.saveUserInDB(this.email, this.password)
        if(!isAnError) return new Success().userCreated()
        return new Error(isAnError).badRequest()
        
    }
    findUser = async () => {
        const isUserInDB = await userInDB.findUserInDB((this.email))

        if(!isUserInDB) return new Error().userNotFound()

        this.userId = isUserInDB._id
        const validPassword = await crypt.comparePassword(this.password, isUserInDB.password)

        if(!validPassword) return new Error().wrongPassword()

        return new Success().userFound({userId: this.userId, token: this.buildToken()})
    }
    
    buildToken = () => {
        return token.signToken(this.userId)
    }
}

module.exports = User