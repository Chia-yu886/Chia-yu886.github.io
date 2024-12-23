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

// 獲取並顯示書籍列表
async function fetchBooks() {
    try {
        const response = await fetch("http://localhost:3000/api/books"); // 後端 API 地址
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
                        <span>賣家</span>
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

// 在 DOM 加載完成後觸發
document.addEventListener("DOMContentLoaded", function () {
    fetchBooks();
});