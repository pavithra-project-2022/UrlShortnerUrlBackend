const express = require("express");
const app = express();
const cors = require("cors");
const mongodb = require("mongodb")
const mongoClient = mongodb.MongoClient;
const URL = 'mongodb+srv://pavi:pavi@cluster0.ydkuj.mongodb.net/UrlShortnerAuth?retryWrites=true&w=majority';
app.use(express.json());
app.use(cors({
    origin: "*",
}))


//get all urls

app.get("/getUrls", async (req, res) => {
    try {
        let connection = await mongoClient.connect(URL)
        let db = connection.db("url")
        let urls = await db.collection("urls").find({}).toArray()
        await connection.close();
        res.json(urls)
    } catch (error) {
        console.log(error)
    }

})


//create urls
app.post("/create-url", async (req, res) => {

    try {
        //connect to db
        let connection = await mongoClient.connect(URL)
        // select db
        let db = connection.db("url")
        // select collection and do operation
        await db.collection("urls").insertOne({
            url: req.body.url,
            shortUrl: generateUrl()
        })
        await connection.close();
        res.json({ message: "url added" })
    } catch (error) {
        console.log(error)
    }
})

//Generating Url
function generateUrl() {
    var randomUrl = [];
    var characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    var charactersLength = characters.length;

    for (i = 0; i <= 5; i++) {
        randomUrl += characters.charAt(Math.floor(Math.random() * charactersLength))
    };
    return randomUrl
}

app.delete("/url/:id" ,async (req,res) =>{
    try {
        let connection = await mongoClient.connect(URL);
        let db = connection.db("url");
        let objId = mongodb.ObjectId(req.params.id)
        await db.collection("urls").deleteOne({ _id: objId })
        await connection.close();
        res.json({ message: "User Deleted" })
    } catch (error) {
        
    }
})

app.get("/", (request, response) => {
    response.send("URL-SHORTNER-APPLICATION");
  });


app.listen(process.env.PORT || 5000,()=>{
    console.log("Server Started Successfully at"+" "+5000)
})