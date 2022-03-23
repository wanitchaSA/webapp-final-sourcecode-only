//Require Mongoose
var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var QuotationSchema = new Schema({
  date: Date,
  item: String,
  quantity: String,
  price: Number,
  total: Number
});

//Export function to create "CustomerSchema" model class
module.exports = mongoose.model("Quotation", QuotationSchema);
