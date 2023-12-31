const express = require("express");
const {auth, authAdmin} = require("../middlewares/auth");
const { ToyModel, validateToy } = require("../models/toyModel");
const router = express.Router();

router.get("/", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let data = await ToyModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err });
  }
});

router.get("/search", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let queryS = req.query.s;
    let searchReg = new RegExp(queryS, "i")
    let data = await ToyModel.find({ $or: [{ name: searchReg }, { info: searchReg }] })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }
})


//http://localhost:3000/toys/category/:games
router.get("/prices", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let minPrice = req.query.min;
    let maxPrice = req.query.max;
    if(minPrice&maxPrice){
      let data = await ToyModel.find({$and:[{price:{$gte:minPrice}},{price:{$lte:maxPrice}}]})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
       res.json(data);
    }
    else if(minPrice){
      let data = await ToyModel.find({price:{$gte:minPrice}})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
       res.json(data);
    }
    else if(maxPrice){
      let data = await ToyModel.find({price:{$lte:maxPrice}})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
       res.json(data);
    }
    else{
      let data = await ToyModel.find({})
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
       res.json(data);
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});


router.get("/category/:catname", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let category = req.params.catname;
    let searchReg = new RegExp(category, "i")
    let data = await ToyModel.find({ category: searchReg })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 })
    res.json(data);
  }
  catch (err) {
    console.log(err);
    res.status(500).json({ msg: "there error try again later", err })
  }

})

router.get("/single/:id", async (req, res) => {
  let perPage = req.query.perPage || 10;
  let page = req.query.page || 1;
  try {
    let idT = req.params.id;
    let data = await ToyModel.find({ _id: idT })
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

router.post("/", auth, async(req,res) => {
  let valdiateBody = validateToy(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details);
  }
  try {
    let toy = new ToyModel(req.body);
      toy.user_id = req.tokenData._id;
    await toy.save();
    res.status(201).json(toy);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});
router.put("/:idEdit",auth, async(req,res) => {
  let valdiateBody = validateToy(req.body);
  if (valdiateBody.error) {
    return res.status(400).json(valdiateBody.error.details);
  }
  try {
    let idEdit = req.params.idEdit;
    let data = await ToyModel.updateOne({ _id: idEdit }, req.body);
    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "err", err });
  }
});

/*{
  "name":"uaa",
  "info":"7 players",
  "category": "box game",
  "price": 84,
  "img": "https://images.pexels.com/photos/206959/pexels-photo-206959.jpeg?auto=compress&cs=tinysrgb&w=300"
}
 */

router.delete("/:delId", auth, async (req, res) => {
  try {
      let delId = req.params.delId;
      let data;
      if (req.tokenData.role == "admin") {
          data = await UserModel.deleteOne({ _id: delId })
      }
      else {
          data = [{ status: "failed", msg: "You are not admin" }]
      }
      res.json(data);
  }
  catch (err) {
      console.log(err);
      res.status(500).json({ msg: "There error to delete, try again later", err })
  }
});

module.exports = router;
