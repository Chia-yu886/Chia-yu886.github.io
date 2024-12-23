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



// 在 DOM 加載完成後執行
document.addEventListener("DOMContentLoaded", function () {
    fetchBooks();
});
