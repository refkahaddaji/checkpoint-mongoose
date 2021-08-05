const express = require('express');
const app = express();
var bodyParser=require('body-parser');
var mongoose=require('mongoose');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

var Person=require('./Person.model')

const port =3000;
mongoose.connect("mongodb+srv://refka:0000@cluster0.z3o6m.mongodb.net/myFirstDatabase?retryWrites=true&w=majority",{ useNewUrlParser: true,useUnifiedTopology: true ,useFindAndModify:false},(err)=>{
    if(!err)
        console.log("server connected to mongoDB")
});


let arrayOfPeople=[
    {name:"mariem",age:26, favoriteFoods:["chicken wings","pizza","burritos"]},
    {name:"mohamed",age:22, favoriteFoods:["spaghetti","pizza"]},
    {name:"sarah",age:29, favoriteFoods:["apple","watermelon","burritos"]}
]
let refka=new Person({name:'Refka',age:22,favoriteFoods:['pizza','ships']})

app.post('/addPerson',(req,res)=>{
    console.log("Adding new person");
    
    refka.save((err,person)=>{
        if(err) res.status(400).send("there is an error while adding new person");
        else res.status(200).json(person);
    })
})
app.post('/addPeople',(req,res)=>{
    console.log("Adding people");
    Person.create(arrayOfPeople)
    .then(people=>res.send(people))

})

app.get('/people',(req,res)=>{
    console.log("getting people..")
    Person.find().exec((err,people)=>{
        if(err) res.status(400).send(err);
        else res.status(200).json(people);
    })
}) 
app.get('/findRefka',(req,res)=>{
    console.log("getting people with name 'Refka' ..")
    Person.find({name : "Refka" }).exec((err,person)=>{
        if(err) res.status(400).send(err);
        else res.status(200).json(person);
    })
})
app.get('/pizzaLover',(req,res)=>{
    console.log("getting first person who love pizza..")
    Person.findOne({favoriteFoods : "pizza" }).exec((err,persons)=>{
        if(err) res.status(400).send(err);
        else res.status(200).json(persons);
    })
})
app.get('/findById',(req,res)=>{
    console.log("find person by ID..")
    Person.findById("61095cbeeb66ee20d40be7c1").exec((err,person)=>{
        if(err) res.status(400).send(err);
        else res.status(200).json(person);
    })
})
app.put('/updateById',(req,res)=>{
    console.log("update person by ID..")
    Person.findById("61095cbeeb66ee20d40be7c1")
    .then(person=>{
        person.favoriteFood.push('hamburger')
        person.save().then(pers=>res.send(pers))
    })
})

app.put('/findOneAndUpdate',(req,res)=>{
    console.log("find person by name and update age to 20..")
    
    Person.findOneAndUpdate({name:'mariem'},{age:20}, {new:true})
    .then(person=>{
        person.save().then(pers=>res.send(pers))
    })
})

app.delete('/findOneAndRemove',(req,res)=>{
    console.log("find person by id and remove..")
    
    Person.findOneAndRemove({_id:'61095cbeeb66ee20d40be7c3'}).exec((err,person)=>{
        if(err) res.status(400).send(err);
        else res.status(200).json(person);
    })
    
})
app.delete('/removeMany',(req,res)=>{
    console.log("remove people with name is Refka..")
    
    Person.deleteMany({name:'Refka'}).exec((err,person)=>{
        if(err) res.status(400).send(err);
        else res.status(200).json(person);
    })
    
})


app.get('/chainSearch',(req,res)=>{
    console.log("chain search query..")
    Person.find({favoriteFoods : "burritos" })
        .select({age:0})                
        .limit(2)              
        .sort({name: 1})    //      .sort({name: 'asc'})        
        .select({age:0}) 
        .exec((err,person)=>{
            if(err) res.status(400).send(err);
            else res.status(200).json(person);
        })                   
            
}) 


/* app.get('/findById',async (req,res)=>{
    console.log("find person by ID..")
    const person=await Person.findById("61095cbeeb66ee20d40be7c1")
    person.favoriteFood.push('hamburger')
    const editedPerson= await person.save()
})
 */
app.get('/', (req,res)=>{
    res.send("home page");
})

app.listen(port,()=> {
    console.log("app is running in port:",port)
})