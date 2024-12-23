const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb"); // 引入 MongoClient

const app = express();

// 使用內建的 JSON 請求處理
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const PORT = 3000;

// Middleware
app.use(cors());

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
        process.exit(1); // 如果連接失敗，終止程序
    }
}

// 啟動伺服器並連接到 MongoDB
connectMongoDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
    });
});


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
