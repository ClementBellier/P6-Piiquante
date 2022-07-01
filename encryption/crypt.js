const bcrypt = require('bcrypt')
const Error = require('../domain/Error')

exports.cryptPassword = async password => {
    return await bcrypt.hash(password, 10)
        .then(hash => hash)
        .catch(error => new Error(error).serverError())
}

exports.comparePassword = async (userPassword,dBPassword) => {
    return await bcrypt.compare(userPassword, dBPassword)
        .then(valid => valid)
        .catch(error => new Error(error).serverError())
}