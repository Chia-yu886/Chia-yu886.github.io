function openTab(evt, tabName) {
    let i, tabcontent, tablinks;
    
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }
    
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }
    
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");
}
document.addEventListener('DOMContentLoaded', function() {
    fetchBooks();
});


const mockBooks = [
    {
        "title": "作業研究案例研究",
        "author": "劉志強",
        "book_condition": "近全新",
        "price": 350,
        "seller_nickname": "紅燈右轉專家",
        "seller_email": "thkfp10@gmail.com",
        "department": "財務金融系",
        "status": "已預訂"
    },
    // ... 其他書籍數據
];

async function fetchBooks() {
    try {
        // 暫時使用模擬數據
        displayBooks(mockBooks);
        
        // 實際 API 連接（等後端準備好後使用）
        /*
        const response = await fetch('你的API網址/api/books');
        const books = await response.json();
        displayBooks(books);
        */
    } catch (error) {
        console.error('Error fetching books:', error);
        document.getElementById('allBookList').innerHTML = 
            '<div class="col-12"><p class="text-danger">載入資料時發生錯誤</p></div>';
    }
}

function displayBooks(books) {
    const container = document.getElementById('allBookList');
    container.innerHTML = '';

    books.forEach(book => {
        const bookElement = `
            <div class="col-12 book-item mb-4 p-3 border rounded">
                <div class="row">
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">書名</span>
                        <h5>${book.title}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">作者</span>
                        <h5>${book.author}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">書籍狀態</span>
                        <h5>${book.book_condition}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">價格</span>
                        <h5>NT$ ${book.price}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">賣家</span>
                        <h5>${book.seller_nickname}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">賣家信箱</span>
                        <h5>${book.seller_email}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">賣家系所</span>
                        <h5>${book.department}</h5>
                    </div>
                    <div class="col-lg-3 col-md-6 mb-2">
                        <span class="fw-bold">販售狀態</span>
                        <h5 class="status-${book.status}">${book.status}</h5>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += bookElement;
    });
}