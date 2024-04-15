const mongodb = require("mongodb");

const MongoClient = mongodb.MongoClient;

let _db;
const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://etoo:sS3ItE9DIwBBUMVO@cluster0.zrumrqq.mongodb.net/shop?retryWrites=true&w=majority&appName=Cluster0"
  )
    .then((client) => {
      console.log("Connected");
      _db = client.db();
      callback(client);
    })
    .catch((err) => {
      console.log(err);
    });
};
const getDb = () => {
  if (_db) return _db;
  throw "There is no databse";
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
