const crypt = require('../encryption/crypt')
const token = require('../encryption/token')

const userInDB = require('../percistance/user')

class User {
    constructor(email, password){
        this.email = email
        this.password = password
        this.userId = ""      
    }    
    saveUser = async () => {
        this.password = await crypt.cryptPassword(this.password)
        return userInDB.saveUserInDB(this.email, this.password)
    }
    findUser = async () => {
        const isUserInDB = await userInDB.findUserInDB(this.email)
        const userNotFind = 0
        const wrongPassword = -1
        if(!isUserInDB) return userNotFind

        this.userId = isUserInDB._id
        const validPassword = await crypt.comparePassword(this.password, isUserInDB.password)
        if(!validPassword) return wrongPassword

        return {userId: this.userId, token: this.buildToken()}
    }
    
    buildToken = () => {
        return token.signToken(this.userId)
    }
}

module.exports = User