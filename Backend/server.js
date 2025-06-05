const express = require('express');
const app=express();
const mongoose=require('mongoose');
const { Int32 } = require('bson'); // bson is a dependency of mongoose
const cors = require('cors');

app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/sample')
.then(()=>{
    console.log("Mongodeb connected")
})

.catch((err)=>{
    console.log(err);
})


// Create a custom schema type for Int32
const Int32Type = mongoose.Schema.Types.Int32 || Int32;

const todoSchema = new mongoose.Schema({
  student_id: { type: Int32Type },
  tutor_id: { type: Int32Type },
  subject: { type: String }
});

const Todo = mongoose.model('User', todoSchema);

app.post('/add',async (req,res)=>{
    const {student_id,tutor_id,subject}= req.body;


    try {
        const newtodo=Todo({
        student_id,
        tutor_id,
        subject
    })
    // todo.push(newtodo)
    // console.log(newtodo);
    // res.status(200).json(newtodo);
    await newtodo.save();
    console.log("newtodo");
    res.status(200).json(newtodo);
    }
    catch(err){
        console.log(err);
        res.status(400).json(err);

    }
    
})
app.get('/data', async(req,res) =>{
    try{
        const newtodo=await Todo.find();
        console.log("server is running");
        res.status(200).json(newtodo);

    }
    catch(err){
        console.log(err);
        res.status(400).json(err);

    }

    
})


app.put('/data/:id',async(req,res)=>{
    const {student_id,tutor_id,subject}= req.body;
    const id = req.params.id;
    const updateddata= await Todo.findByIdAndUpdate(
        id,
        {student_id,tutor_id,subject},{new:true}
    )
    if (!updateddata){
        return res.status(404).json({message:"todo not avalible"})
    }
    res.json(updateddata)

})

app.delete('/data/:id', async(req,res) =>{
    const id = req.params.id;
    await Todo.findByIdAndDelete(id)
    res.status(200).json("todo successfully deleted")
   

    
})

const port=5000;
app.listen(port, ()=>{
    console.log("server is running" + port);
 })
 