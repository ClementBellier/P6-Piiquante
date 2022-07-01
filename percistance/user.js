const User = require('../models/User')
const userModel = require('../models/User')

exports.saveUserInDB = async (email, password) =>{
    const user = new userModel({email: email,password: password})
    const isAnError = false
    return user.save()
        .then(() => isAnError)
        .catch(error => error)
}

exports.findUserInDB = async (email) => {
    return User.findOne({email})
        .then(user => user)
        .catch(error => error)
}