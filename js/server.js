// // server.js
// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const app = express();

// app.use(cors());
// app.use(express.json());

// // MongoDB 連接
// mongoose.connect('mongodb://localhost:27017/secondhand-books', {
//     useNewUrlParser: true,
//     useUnifiedTopology: true
// });

// // 定義書籍模型
// const Book = mongoose.model('Book', {
//     title: String,
//     author: String,
//     book_condition: String,
//     price: Number,
//     seller_nickname: String,
//     seller_email: String,
//     department: String,
//     status: String
// });

// // API 端點
// app.get('/api/books', async (req, res) => {
//     try {
//         const books = await Book.find();
//         res.json(books);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// app.listen(3000, () => {
//     console.log('Server running on port 3000');
// });