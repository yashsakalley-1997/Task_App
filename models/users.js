const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const userSchema = new mongoose.Schema
(
    {
        'name':{type:String},
        'age':
        {
            type:Number,
            default:0,
            validate(value)
            {
                if(value<0)
                {
                    throw new Error("Age Must be a positive Number")
                }
            }
        },
        'email':
        { 
            type:String,
            unique:true,
            required:true,
            trim:true,
            lowercase:true,
    
            validate(value)
            {
                if(!validator.isEmail(value))
                {
                    throw new Error("Enter a valid email id")
                }
            }
        }
        ,
        'password':
        {
            type:String
        }
        ,
        'tokens':[
            {
                token:{
                    type:String,
                    required:true
                }
            }
        ]
        ,
        'avatar':
        {
            type:Buffer
        }
        
    }
    ,
    {
        timestamps:true
    }
)

userSchema.virtual('task_details',{
    ref:'tasks',
    localField:'_id',
    foreignField:'user'
})

userSchema.methods.toJSON = function ()
{   
    const user = this
    const userObject = user.toObject()
    delete userObject.password
    delete userObject.tokens
    delete userObject.avatar
    return userObject
}

userSchema.statics.generateAuthToken = async (user)=>
{
    const token = jwt.sign({_id:user._id.toString()},"this_is_a_hidden_string",{expiresIn:"1h"})
    user.tokens = user.tokens.concat({token:token})
    user.save()
    return token
}

userSchema.statics.generateAuthToken = async (user)=>
{
    const token = jwt.sign({_id:user._id.toString()},"this_is_a_hidden_string",{expiresIn:"1h"})
    user.tokens = user.tokens.concat({token:token})
    user.save()
    return token
}

userSchema.statics.findByCredentails = async (email,password)=>
{
    const user = await User.findOne({email:email})
    if(!user)
    {
        throw new Error("Auth Failed")
    }
    const isMatch = await bcrypt.compare(password,user.password)
    if(!isMatch)
    {
        throw new Error("Authentication Failed")
    }
    return user
}


const User = mongoose.model('User',userSchema)

module.exports = User