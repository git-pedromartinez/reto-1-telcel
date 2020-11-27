const { Schema, model } = require('mongoose');

const radiobaseSchema = new Schema({
    RADIOBASE: String,
    FECHA: Date,
    REGION: Number,
    TRAFICO: Number
});

module.exports = model('radiobase', radiobaseSchema)