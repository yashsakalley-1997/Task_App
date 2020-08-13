const express = require('express')
const app = express()
const mongoose = require('mongoose')
const port = process.env.port || 3000
const userRouter = require('./routers/users')
const tasksRouter = require('./routers/tasks')

mongoose.connect("mongodb://127.0.0.1:27017/task-manager",{useNewUrlParser:true,useUnifiedTopology:true,useCreateIndex:true})
.then(res=>{
    console.log("Connection Made")
})
.catch(err=>
    {
        console.log(err)
    })

// const function_1 = async ()=>
// {   
//     // Getting the user from the task id
//     // const task = await Task.findById("5f3136cba3644128d9688ead")
//     // await task.populate('owner').execPopulate()
//     // console.log(task)
    
//     // Getting the task id from the user
//     // const user = await User.findById('5f31364100c64428a4f1469e')
//     // await user.populate('task_details').execPopulate()
//     // console.log(user.task_details)
// }

// function_1()
app.use(express.json())
app.use(userRouter)
app.use(tasksRouter)


app.listen(port)