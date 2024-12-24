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
if (!uri) {
    console.error("MONGO_URI is not defined in .env file");
    process.exit(1); // 終止程序
}
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    tls: true,
    tlsAllowInvalidCertificates: true, // 僅用於測試，不建議在生產環境使用
});

let booksCollection;

// 連接 MongoDB
async function connectMongoDB() {
    try {
        await client.connect();
        const database = client.db("secondhand-books");
        booksCollection = database.collection("books");

        // 建立索引（可選）
        await booksCollection.createIndex({ title: "text", author: "text" });

        console.log("Connected to MongoDB!");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
        process.exit(1); // 終止程序
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

// 啟動伺服器
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

// 處理伺服器關閉
process.on("SIGINT", async () => {
    console.log("Closing MongoDB connection...");
    await client.close();
    process.exit(0);
});
