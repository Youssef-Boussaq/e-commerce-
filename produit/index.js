const express = require("express");
const app = express();
const PORT = 4000;
const Produit = require("./produit");
const  mongoose  = require("mongoose");
app.use(express.json());

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://localhost:27017/produit-service")
.then(() => {
        console.log('produit service DB is runing');
    })
    .catch(error => {
        console.log("error is", error);
    })
app.post("/produit/ajouter", async (req, res, next) => {
    const { nom, description, prix } = req.body;
    const newProduit = new Produit({
        nom,
        description,
        prix
    });

    newProduit.save()
    .then(produit => res.status(201).json(produit))
    .catch(error => res.status(400).json(error));
});

app.get("/produit/acheter", (req, res, next) => {
    const { ids } = req.body;
    Produit.find({_id: { $in: ids } })
        .then(produits => res.status(201).json(produits))
        .catch(error => res.status(400).json(error));
}
)

app.listen(PORT, () => {
    console.log(`produit service is running on port ${PORT}`);
});
