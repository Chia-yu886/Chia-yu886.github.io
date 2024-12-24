function openTab(evt, tabName) {
    let tabcontent, tablinks;

    // 隱藏所有 tabcontent
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // 移除所有 tablinks 的 active 樣式
    tablinks = document.getElementsByClassName("tablinks");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // 顯示選定的 tabcontent 並添加 active 樣式
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}

async function connectMongoDB() {
    try {
        await client.connect();
        const database = client.db("secondhand-books");
        booksCollection = database.collection("books");
        
        // Test the connection
        await database.command({ ping: 1 });
        console.log("Successfully connected to MongoDB!");
        
        // 建立索引（可選）
        await booksCollection.createIndex({ title: "text", author: "text" });
    } catch (error) {
        console.error("MongoDB connection error:", error);
        // Add more specific error handling
        if (error.code === 'ERR_SSL_TLSV1_ALERT_INTERNAL_ERROR') {
            console.error("SSL/TLS connection error. Please check your connection string and certificates.");
        }
        process.exit(1);
    }
}

// 獲取並顯示書籍列表
async function fetchBooks() {
    try {
        const response = await fetch("http://localhost:3000/api/books");
        if (!response.ok) throw new Error("Network response was not ok");

        const books = await response.json();
        displayBooks(books);
    } catch (error) {
        console.error("Error fetching books:", error);
        document.getElementById("allBookList").innerHTML =
            '<div class="col-12"><p class="text-danger">載入資料時發生錯誤</p></div>';
    }
}

// 渲染書籍列表
function displayBooks(books) {
    const container = document.getElementById("allBookList");
    container.innerHTML = "";

    books.forEach(book => {
        const bookElement = `
            <div class="col-12 book-item">
                <div class="row detail">
                    <div class="col-lg-3 col-md-6">
                        <span>書名</span>
                        <h5>${book.title}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>作者</span>
                        <h5>${book.author}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>書籍狀態</span>
                        <h5>${book.book_condition}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>價格</span>
                        <h5>NT$ ${book.price}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>賣家暱稱</span>
                        <h5>${book.seller_nickname}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>賣家信箱</span>
                        <h5>${book.seller_email}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>賣家系所</span>
                        <h5>${book.department}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>販售狀態</span>
                        <h5 class="status-${book.status === "可交易" ? "available" : "reserved"}">
                            ${book.status}
                        </h5>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += bookElement;
    });
}

// 查詢書籍
async function searchBooks() {
    const query = document.getElementById('searchInput').value.trim();
    const resultsContainer = document.getElementById('searchResults');
    resultsContainer.innerHTML = ""; // 清空結果

    if (!query) {
        alert("請輸入查詢條件！");
        return;
    }

    try {
        const response = await fetch(`http://localhost:3000/api/books/search?q=${query}`);
        if (!response.ok) throw new Error("查詢失敗，請檢查伺服器。");

        const books = await response.json();
        displaySearchResults(books);
    } catch (error) {
        console.error("Error fetching search results:", error);
        resultsContainer.innerHTML = '<p class="text-danger">查詢時發生錯誤，請稍後再試。</p>';
    }
}

// 搜尋結果
function displaySearchResults(books) {
    const resultsContainer = document.getElementById("searchResults");

    // 清空現有結果
    resultsContainer.innerHTML = "";

    if (books.length === 0) {
        resultsContainer.innerHTML = "<p>未找到相關書籍。</p>";
        return;
    }

    // 遍歷書籍數據並生成 HTML
    books.forEach(book => {
        const bookElement = `
            <div class="col-12 book-item">
                <div class="row detail">
                    <div class="col-lg-3 col-md-6">
                        <span>書名：</span>
                        <h5>${book.title}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>作者：</span>
                        <h5>${book.author}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>書籍狀態：</span>
                        <h5>${book.book_condition}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>價格：</span>
                        <h5>NT$ ${book.price}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>賣家暱稱：</span>
                        <h5>${book.seller_nickname}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>賣家信箱：</span>
                        <h5>${book.seller_email}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>賣家系所：</span>
                        <h5>${book.department}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6">
                        <span>販售狀態：</span>
                        <h5 class="${book.status === '可交易' ? 'text-success' : 'text-danger'}">
                            ${book.status}
                        </h5>
                    </div>
                </div>
            </div>
        `;
        resultsContainer.innerHTML += bookElement;
    });
}

// // 處理新增書籍表單提交
document.getElementById('bookForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(e.target);
    const bookData = {
        title: formData.get('title'),
        author: formData.get('author'),
        condition: formData.get('condition'),
        price: formData.get('price'),
        seller_nickname: formData.get('seller_nickname'),
        seller_email: formData.get('seller_email'),
        department: formData.get('department'),
        status: formData.get('status')
    };

    try {
        const response = await fetch('http://localhost:3000/api/books', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        if (!response.ok) {
            throw new Error('新增書籍失敗');
        }

        const result = await response.json();
        alert('書籍新增成功！');
        
        // 清空表單
        e.target.reset();
        
        // 重新載入書籍列表
        fetchBooks();
        
    } catch (error) {
        console.error('Error adding book:', error);
        alert('新增書籍時發生錯誤，請稍後再試。');
    }
});

// 新增表單驗證功能
function validateForm() {
    const price = document.querySelector('input[name="price"]').value;
    if (price < 0) {
        alert('價格不能為負數！');
        return false;
    }
    return true;
}

// 為表單添加驗證
document.getElementById('bookForm').onsubmit = function(e) {
    if (!validateForm()) {
        e.preventDefault();
        return false;
    }
    return true;
};


// 在 DOM 加載完成後執行
document.addEventListener("DOMContentLoaded", function () {
    fetchBooks();
});
