var express = require("express");
var router = express.Router();
const mongoose = require("mongoose");
var Quotation = require("../db/models/quotations");

/* GET quotations listing. */
router.get("/", (req, res, next) => {
  Quotation.find({}, (err, result) => {
    if (err) {
      console.debug("Hey Look! Error", err);
      res.json(err);
    } else {
      // console.log(res);
      res.json(result);
    }
  });
});

// Create new quotation
router.post("/", (req, res, next) => {
  console.debug(req.body);
  const data = req.body;
  const quotation1 = new Quotation({
    date: data.date,
    item: data.item,
    quantity: data.quantity,
    price: data.price,
    total: data.total
  });
  quotation1.save((err, newInstance) => {
    if (err) {
      console.error("Hey look, Error!", err);
      res.json(err);
    } else {
      res.json(newInstance);
    }
  });
});

router.delete("/:id", (req, res, next) => {
  // console.log(req.body)
  // const id = req.body._id;
  const id = req.params['id'] // use ID from the route parameter
  // res.status(200).json(req.params)

  console.log("Delete this id", id)
  console.debug('Product ID to delete',id);

  Quotation.findByIdAndDelete(id, (err, doc) => {
    if (err) {
      console.error("Hey look, Error!", err);
      res.json(err);
    } else {
      res.status(200).json(doc);
    }
  });
});

// Update whole object (PUT) or partially (PATCH->but click PUT)
router.put("/", async (req, res, next) => {
  console.debug(req.body);
  const data = req.body;
  const id = data._id;
  delete data._id;
  console.debug(data);

  // const filter = {_id: data._id};
  // const update = { data };

  Quotation.findByIdAndUpdate(id, data, (err, doc) => {
    if (err) {
      console.error("Hey look, Error!", err);
      res.json(err);
    } else {
      res.status(200).json(doc);
    }
  });

  // Product.findOneAndUpdate({ code: data.code }, data, (err, doc) => {
  //   if (err) {
  //     console.error("Hey look, Error!", err);
  //     res.json(err);
  //   } else {
  //     res.status(200).json(doc);
  //   }
  // });
  // or findOne(), set values, then save()

  // var product1 = await Product.findOne({ _id: data._id });
  // product1.code = data.newCode;
  // product1.name = data.name;
  // product1.price = data.price;
  // await product1.save();
  // res.status(200).json(product1);

});
module.exports = router;
