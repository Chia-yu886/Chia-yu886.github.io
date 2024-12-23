const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB 連接字串
const uri = "mongodb+srv://4ISH:Aa04031219@secondhand-books.elqsc.mongodb.net/secondhand_books?retryWrites=true&w=majority";
const client = new MongoClient(uri);

let booksCollection;

// 連接 MongoDB
async function connectMongoDB() {
    try {
        await client.connect();
        const database = client.db("secondhand-books");
        booksCollection = database.collection("books");
        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    }
}

connectMongoDB();

// API 路由：獲取所有書籍
app.get("/api/books", async (req, res) => {
    try {
        const books = await booksCollection.find({}).toArray();
        res.json(books);
    } catch (error) {
        res.status(500).json({ message: "Error retrieving books", error });
    }
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
