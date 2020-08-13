const jwt = require('jsonwebtoken')
const User = require('../models/users')

const auth = async (req,res,next)=>
{
    try
    {
        const token = req.header('Authorization')
        const decoded = jwt.verify(token,"this_is_a_hidden_string")
        const user = await User.findOne({_id:decoded._id,"tokens.token":token})
        if(!user)
        {
            throw new Error()
        }
        req.user = user
        req.token = token
        next()
    }
    catch(err)
    {
        res.status(401).json
        (
            {
                message:"Please Authenticate"
            }
        )
    }
}

module.exports = auth