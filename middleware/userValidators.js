const validator = require('validator')
const passwordValidator = require('password-validator')

module.exports = (req, res, next) => {
    if(!validator.isEmail(req.body.email)) return res.status(400).json({error: "L'email n'est pas au format mon@email.com"})
    const passwordSchema = new passwordValidator()
        .min(8, 'Le mot de passe doit contenir au moins 8 caractères')
        .uppercase(1, 'Le mot de passe doit contenir au moins une majuscule')
        .lowercase(1, 'Le mot de passe doit contenir au moins une minuscule')
        .digits(2, 'Le mot de passe doit contenir au moins 2 chiffres')
        .symbols(1, 'Le mot de passe doit contenir au moins un caractère spécial')
        .not().spaces(0,"Le mot de passe NE doit PAS contenir d'espaces")
    
    errorArray = passwordSchema.validate(req.body.password,{details: true})
    if(errorArray.length !== 0)  return res.status(400).json({error: errorArray})
    next()
}