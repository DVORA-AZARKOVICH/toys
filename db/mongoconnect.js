
const mongoose = require('mongoose');
const {config} = require("../config/secret");

main().catch(err => console.log(err));

async function main() {
  mongoose.set('strictQuery' , false);

  await mongoose.connect(`mongodb+srv://${config.userDb}:${config.passDb}@cluster0.syquycz.mongodb.net/black23`);
  //await mongoose.connect('mongodb://127.0.0.1:27017/black23');
  console.log("mongo connect started toys-project");
}

