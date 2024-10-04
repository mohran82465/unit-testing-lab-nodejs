const mongoose=require('mongoose')


var todoSchema=mongoose.Schema({
    title:{
        type:String,
        minLength:[3,"title min lenght is 3 plz provide some more charaters "],
        maxLength:50,
        required:true,
        trim:true

    },
    status:{
        type:String,
        enum:["to do","doing","done"],
        default:"to do"
    },
    userId:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:'User',
        required:true
    }
})


var todosModel= mongoose.model('Todo',todoSchema)

module.exports=todosModel