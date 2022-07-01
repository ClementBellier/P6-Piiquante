class Error{
    constructor(error){
        this.error = error
    }
    returnError = (errorCodeHTTP) =>{
        res.status(errorCodeHTTP).json({error: this.error})
    }
    serverError(){returnError(500)}
}

module.exports = Error