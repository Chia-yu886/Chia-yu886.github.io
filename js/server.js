const { MongoClient } = require('mongodb');

// mongo連接字串
const uri = "mongodb+srv://4ISH:Aa04031219@secondhand-books.elqsc.mongodb.net/secondhand_books?retryWrites=true&w=majority";

// 創建 MongoClient 實例
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

async function connectMongoDB() {
    try {
        // 連接到 MongoDB
        await client.connect();
        console.log("Connected to MongoDB!");

        // 選擇資料庫和集合
        const database = client.db("secondhand_books");
        const collection = database.collection("books");

        // 測試查詢集合中的資料
        const results = await collection.find({}).toArray();
        console.log("Documents retrieved:", results);
    } catch (error) {
        console.error("Error connecting to MongoDB:", error);
    } finally {
        // 關閉連接
        await client.close();
    }
}

connectMongoDB();
