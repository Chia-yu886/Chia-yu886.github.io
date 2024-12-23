const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");
require("dotenv").config(); // 加載環境變數

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB 連接
const uri = process.env.MONGO_URI;
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

// 查詢書籍 API
app.get('/api/books/search', async (req, res) => {
    try {
        const query = req.query.q;
        if (!query) return res.status(400).json({ message: '缺少查詢條件' });

        // 使用正則表達式進行模糊查詢
        const results = await booksCollection.find({
            $or: [
                { title: { $regex: query, $options: 'i' } }, // 按書名查詢，忽略大小寫
                { author: { $regex: query, $options: 'i' } } // 按作者查詢，忽略大小寫
            ]
        }).toArray();

        res.json(results);
    } catch (error) {
        console.error('Error searching books:', error);
        res.status(500).json({ message: '查詢書籍時發生錯誤', error });
    }
});

// 新增書籍 API
app.post("/api/books", (req, res) => {
    const book = req.body;
    books.push(book); // 將新書籍加入模擬數據庫
    res.status(201).json({ message: "書籍已成功新增", book });
});

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
