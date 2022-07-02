const bcrypt = require('bcrypt')

exports.cryptPassword = async password => {
    return await bcrypt.hash(password, 10)
        .then(hash => {return {hash}})
        .catch(error => {return {error: error.toString()}})
}

exports.comparePassword = async (userPassword,dBPassword) => {
    return await bcrypt.compare(userPassword, dBPassword)
        .then(valid => valid)
        .catch(error => {return {error: error.toString()}})
}