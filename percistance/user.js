const userModel = require('../models/User')

exports.saveUserInDB = async (email, password) =>{
    const user = new userModel({email: email,password: password})
    const FalseOrErrorMessage = false
    return user.save()
        .then(() => FalseOrErrorMessage)
        .catch(error => error)
}

exports.findUserInDB = async (email) => {
    return userModel.findOne({email})
        .then(user => user)
        .catch(error => error)
}