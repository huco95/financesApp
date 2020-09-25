const  mongoose  = require("mongoose");

// cloud uri
// const uri = "mongodb+srv://admin:<password>@cluster0.c5xxy.mongodb.net/<dbname>?retryWrites=true&w=majority";
// local uri
const uri = "mongodb://localhost:27017/finances";

module.exports = () => {
    return mongoose.connect("mongodb://localhost:27017/finances",
     { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false});
}