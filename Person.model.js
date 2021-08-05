var mongoose =require('mongoose');
var Schema=mongoose.Schema;

module.exports=mongoose.model('Person',Schema({
   // _id: Schema.Types.ObjectId,
    name: {
        type: String,
        required:true 
    },
    age: {
        type: Number
    },
    favoriteFoods: {
        type: [String]
    }
}))