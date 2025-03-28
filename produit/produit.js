const { text } = require("express");
const mongoose = require("mongoose") ;
const ProduitSchema = mongoose.Schema({
    nom : String ,
    description : String ,
    prix  : Number,
    create_at : {
        type:Date,
        default : Date.now
    },
    
})
module.exports = Produit = mongoose.model("produit", ProduitSchema);