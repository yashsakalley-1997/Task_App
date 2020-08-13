const express = require('express')
const router = express.Router()

const User = require('../models/users')
const Task = require('../models/tasks')

const bcrypt = require('bcrypt')
const auth = require('../middlewares/auth')

const { sendWelcomeEmail } = require('../emails/account')
const { sendDeleteEmail } = require('../emails/account')

const sharp = require('sharp')
const multer = require('multer')

const upload = multer
(
    {
        limit:
        {
            fileSize:1000000
        },
        fileFilter(req,file,cb)
        {
            if(!file.originalname.match(/.\(jpg|jpeg|png)/))
            {
                cb(undefined,"Please upload a valid image file")
            }
            cb(undefined,true)
        }
    }
)

// File Upload
router.post('/users/upload',auth,upload.single('upload'),async (req,res)=>
{   
    if(!req.file)
    {
        res.status(400).json
        (
            {
                message:"Please select an image file"
            }
        )
    }
    const buffer = sharp(req.file.buffer).resize({height:250,width:250}).png().toBuffer()
    req.user.avatar = buffer
    await req.user.save()
    res.status(200).json
    (
        {
            message:"Image file Uploaded"
        }
    )
},(err,req,res,next)=>
{
    res.status(400).json
    (
        {
            message:err.message
        }
    )
}

)

// Deleting the avatar
router.delete('/users/upload/delete',auth,async (req,res,next)=>
{
    req.user.avatar = undefined
    try
    {
        await req.user.save()
        res.status(200).json
        (
            {
                message:"Avatar Deleted"
            }
        )
        
    }
    catch(err)
    {
        res.status(400).json
        (
            {
                message:err
            }
        )
    }
})

// Getting the Avatar.
router.get('/users/upload/:id',async (req,res)=>
{
    try
    {
        const user = await User.findById(req.params.id)
        if(!user || !user.avatar)
        {
            throw new Error()
        }
        res.set('Content-Type','image/jpg')
        res.send(user.avatar)
    }
    catch(err)
    {
        res.send(400).json
        (
            {
                message:"Image not available"
            }
        )
    }
})

// Insert the User in DB.
router.post('/users',async (req,res,next)=>{
    try
    {
        const hashed = await bcrypt.hash(req.body.password,10)

        const user = new User
        (
            {
                age:req.body.age,
                name:req.body.name,
                email:req.body.email,
                password:hashed
            }
        )
        const result1 = await user.save()
        sendWelcomeEmail(user.email,user.name)
        const token = await User.generateAuthToken(result1)
        res.status(200).json
        (
            {
                user:result1,
                token:token
            }
        )
    }
    catch(err)
    {
        res.status(400).json
        (
            {
                message:err
            }
        )
    }
})

// Getting all the Users.
router.get('/users',auth,async (req,res,next)=>
{
    try
    {
        const result1 = await User.find().limit(1)
        res.status(200).json
        (
            {
                message:req.user
            }
        )
    }
    catch(err)
    {
        res.status(400).json({
            message:err
        })
    }
})

// Deleting the User.
router.delete("/users",auth,async (req,res,next)=>
{
    try
    {   
        sendDeleteEmail(req.user.email,req.user.name)
        await req.user.remove()
        await Task.deleteMany({user:req.user.id})
        res.status(200).json
        (
            {
                message:"User Deleted"
            }
        )
    }
    catch(err)
    {       
        res.status(400).json
        (
            {
                message:err
            }
        )
    }   
})

// Updating the users
router.patch('/users',auth,async (req,res,next)=>
{   
    try
    {   
        const result1 = await req.user.update({email:req.body.email})
        res.status(200).json
        (
            {
                message:result1
            }
        )
    }
    catch(err)
    {
        res.status(400).json
        (
            {
                message:err
            }
        )
    }
})
 

// User Login
router.post("/users/login",async (req,res,next)=>
{   
    try 
    {
        const user = await User.findByCredentails(req.body.email,req.body.password)
        const token = await User.generateAuthToken(user)
        res.status(200).json
        (
            {   
                user:user,
                token:token
            }
        )
    }    
    catch(err)
    {   
        console.log(err)
        res.status(400).json
        (
            {
                message:"Authentication Failed"
            }
        )
    }
}
)

// Logout of one session,.
router.post('/users/logout',auth,async (req,res,next)=>
{
    try
    {
        req.user.tokens = req.user.tokens.filter(token=>
            {
                return token.token != req.token
            })
        await req.user.save()
        res.status(200).json
        (
            {
                message:"User Logged Out"
            }
        )
    }
    catch(err)
    {
        res.send(400).json
        (
            {
                message:"Unable to log out"
            }
        )
    }
})

// Logout of all sessions.
router.post("/users/logout/all",auth,async (req,res,next)=>
{
    try
    {
        req.user.tokens = undefined
        await req.user.save()
        res.status(200).json
        (
            {
                message:"Logged out of all devices"
            }
        )
    }
    catch(err)
    {
        res.status(400).json
        (
            {
                message:"Error logging out"
            }
        )
    }
})

module.exports = router