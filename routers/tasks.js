const express = require('express')
const router = express.Router()
const Post = require('../models/tasks')
const auth = require('../middlewares/auth')

// Inserting the task in DB
router.post('/tasks',auth,async (req,res,next)=>
{
    try
    {   
        const post = new Post
        (
            {
                ...req.body,
                "user":req.user._id
            }
        )
        const result1 = await post.save()
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



// Getting the tasks.
router.get('/tasks',auth,async (req,res,next)=>
{
    try
    {
        const result1 = await Post.find({user:req.user.id}).limit(parseInt(req.query.limit)).skip(parseInt(req.query.skip))
        .sort
        (
            {
                createdAt:-1
            }
        )
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

// Getting the tasks by id
router.get('/tasks/:id',auth,async (req,res,next)=>
{   
    try
    {   
        const result1 = await Post.findOne({_id:req.params.id,user:req.user.id})
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


// Deleting the Task.
router.delete('/tasks/:id',auth,async (req,res,next)=>
{
    try
    {
        const result1 = await Post.findOneAndDelete({_id:req.params.id,user:req.user.id })
        if(!result1)
        {
            res.status(404).send()
        }
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

// Updating the task
router.post('/tasks/:id',auth,async (req,res,next)=>
{
    try
    {   
        console.log(req.body.completed)
        const result1 = await Post.where({_id:req.params.id,user:req.user.id}).update({completed:req.body.completed})
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


module.exports = router
