const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = async (callback) => {
  try {
    const client =  await MongoClient.connect(
      "mongodb+srv://fatony:3EPo47vXefw7dYZw@cluster0.lqa7wj7.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
    );

    _db = client.db();

    console.log("Connected!");
    callback(client);
  } catch (err) {
    console.log(err);
  }
};

const getDB = () => {
  if(_db){
    return _db;
  }
  throw "No database found!";
}

module.exports = {
  mongoConnect: mongoConnect,
  getDB: getDB,
}
