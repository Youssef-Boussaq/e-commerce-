const express = require("express");
const app = express();
const PORT = process.env.PORT_ONE || 4001;
const mongoose = require("mongoose");
const Commande = require("./commande");
const axios = require('axios');
const isAuthenticated = require("./isAuthenticated")

mongoose.set('strictQuery', true);
mongoose.connect("mongodb://localhost/commande-service").then(()=>{
    console.log("Commande-service DB Connecter")
}).catch((err)=>console.log(err));

app.use(express.json());

function prixTotal(produits) {
    let total = 0;
    for (let t = 0; t < produits.length; ++t) {
        total += produits[t].prix;
    };
    return total;
}

async function httpRequest(ids) {
    try {
        const URL = "http://localhost:4000/produit/acheter"
        const response = await axios.post(URL, { ids: ids }, {
            headers: {
                'Content-Type': 'application/json'
            }
        });
        return prixTotal(response.data);
    } catch (error) {
        console.error(error);
    }
}


app.post("/commande/ajouter",isAuthenticated , async (req, res, next) => {
    const { ids } = req.body;
    httpRequest(req.body.ids).then(total => {
        const newCommande = new Commande({
            produits :ids,
            email_utilisateur: req.user.email,
            prix_total: total,
        });
        newCommande.save().then(commande => res.status(201).json(commande))
        .catch(err => res.status(400).json({ err }));
    });
});

app.listen(PORT, () => {
    console.log(`commande service is running on port ${PORT}`);
});