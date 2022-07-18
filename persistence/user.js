const userModel = require('../models/User')

exports.saveUserInDB = async (email, password) =>{
    const user = new userModel({email: email,password: password})
    return user.save()
        .then(user => user)
        .catch(error => {return {error: error.message}})
}

exports.findUserInDB = async (email) => {
    return userModel.findOne({email})
        .then(user => user)
        .catch(error => {return {error}})
}