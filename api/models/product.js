const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, require: true },
    colors: { type: String, require: true },
    album: { type: String, require:true },
    categorie: { type: String, require: true },
    description: { type: String, require: true },
    livraison: { type: Boolean, require: false}

});

module.exports = mongoose.model('Product', productSchema);


