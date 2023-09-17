var params = new window.URLSearchParams(window.location.search);
var idP = params.get('id');
let token = localStorage.getItem('token');
let id = localStorage.getItem('idAccount');
var currentTime = new Date();

function getAll() {
    // Tạo ra 1 request.
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
        },
        url: "http://localhost:8080/api/product/" + idP,
        success: function (data) {
            loadComments(idP);
            show(data);
        },
        error: function (err) {
            console.log(err)
            // lỗi
        }
    });
}
getAll();
function show(p) {
    str = `<div class="container">
                <div class="row gx-5">
                    <aside class="col-lg-6">
                        <div class="border rounded-4 mb-3 d-flex justify-content-center">
                            <a data-fslightbox="mygalley" class="rounded-4" data-type="image">
                                <img style="max-width: 100%; max-height: 100vh; margin: auto;" class="rounded-4 fit"
                                     src="${p.imgProduct.thumbnail}"/>
                            </a>
                        </div>
                        <div class="d-flex justify-content-center mb-3">
                            <div data-fslightbox="mygalley" class="border mx-1 rounded-2" data-type="image" 
                               class="item-thumb">
                                <img width="60" height="60" class="rounded-2" id="imgElement" onclick="showImg(this.src)"
                                     src="${p.imgProduct.thumbnail}"/>
                            </div>
                            <div data-fslightbox="mygalley" class="border mx-1 rounded-2" data-type="image"
                               class="item-thumb">
                                <img width="60" height="60" class="rounded-2" id="imgElement" onclick="showImg(this.src)"
                                     src="${p.imgProduct.img1}"/>
                            </div>
                            <div data-fslightbox="mygalley" class="border mx-1 rounded-2" data-type="image"
                               class="item-thumb">
                                <img width="60" height="60" class="rounded-2" id="imgElement" onclick="showImg(this.src)"
                                     src="${p.imgProduct.img2}"/>
                            </div>
                            <div data-fslightbox="mygalley" class="border mx-1 rounded-2" data-type="image"
                               class="item-thumb">
                                <img width="60" height="60" class="rounded-2" id="imgElement" onclick="showImg(this.src)"
                                     src="${p.imgProduct.img3}"/>
                            </div>
                        </div>
                        <!-- thumbs-wrap.// -->
                        <!-- gallery-wrap .end// -->
                    </aside>
                    <main class="col-lg-6">
                        <div class="ps-lg-3">
                            <h4 class="title text-dark">
                                ${p.name}
                            </h4>
                            <div class="d-flex flex-row my-3">
                                <div class="text-warning mb-1 me-2">
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fa fa-star"></i>
                                    <i class="fas fa-star-half-alt"></i>
                                    <span class="ms-1">
                            4.5
                          </span>
                                </div>
                                <span class="text-muted"><i class="fas fa-shopping-basket fa-sm mx-1"></i>154 orders</span>
                                <span class="text-success ms-2">In stock</span>
                            </div>
            
                            <div class="mb-3">
                                <span class="h5">$${p.price}</span>
                                <span class="text-muted">/per box</span>
                            </div>
            
                            <p>
                                ${p.describes}
                            </p>
            
                            <div class="row">
                                <dt class="col-3">Loại:</dt>
                                <dd class="col-9">${p.category.name}</dd>
            
                                <dt class="col-3">Số lượng</dt>
                                <dd class="col-9">${p.quantity}</dd>
                
                                <dt class="col-3 shop-link">Shop</dt>
                                <b class="col-9 shop-link" style="text-decoration: none; color: black" >${p.shop.name}</b>
                            </div>
            
                            <hr/>
            
                            <div class="row mb-4">
                                <div class="col-md-4 col-6">
                                    <label class="mb-2">Size</label>
                                    <select class="form-select border border-secondary" style="height: 35px;">
                                        <option>Small</option>
                                        <option>Medium</option>
                                        <option>Large</option>
                                    </select>
                                </div>
                                <!-- col.// -->
                                <div class="col-md-4 col-6 mb-3">
                                    <label class="mb-2 d-block">Quantity</label>
                                    <div class="input-group mb-3" style="width: 170px;">
                                        <button class="btn btn-white border border-secondary px-3" type="button"
                                                id="button-addon1" data-mdb-ripple-color="dark">
                                            <i class="fas fa-minus"></i>
                                        </button>
                                        <input type="text" class="form-control text-center border border-secondary"
                                               placeholder="14" aria-label="Example text with button addon"
                                               aria-describedby="button-addon1"/>
                                        <button class="btn btn-white border border-secondary px-3" type="button"
                                                id="button-addon2" data-mdb-ripple-color="dark">
                                            <i class="fas fa-plus"></i>
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <a href="#" class="btn btn-warning shadow-0"> Buy now </a>
                            <a href="#" class="btn btn-primary shadow-0"> <i class="me-1 fa fa-shopping-basket"></i> Add to cart
                            </a>
                         <button onclick="getListChat(${p.shop.account.id})" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#chatModal">
                          Chat Shop
                         </button>
                        </div>
                    </main>
                </div>
            </div>

<div class="container">
        <div class="comments-section" id="comments-section">
        </div>
        <div class="comment-form mt-3">
            <h5>Đăng bình luận</h5>
            <textarea class="form-control" rows="3" placeholder="Nhập bình luận của bạn"></textarea>
            <button class="btn btn-primary mt-2" onclick="postComment(this)">Đăng</button>
        </div>
    </div>`

    document.querySelector(".showProduct").innerHTML = str;
    loadComments(idP);
}

function showImg(src) {
    document.getElementById("imgThumbnail").src = src;
}


function loadComments(productId) {
    $.ajax({
        type: "GET",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + token
            },
        url: `http://localhost:8080/comments/product/${productId}`,
        success: function (comments) {
            console.log(comments)
            const commentsSection = document.querySelector(".comments-section");
            commentsSection.innerHTML = '';
            if (comments.length > 0) {
                comments.forEach(function (comment) {
                    const timePosted = calculateTimePosted(comment.createdAt);
                    const commentHtml = `
                        <div class="comment" style="margin-bottom: 15px;border: 1px solid #ddd;padding: 10px;border-radius: 8px;">
                            <div>
                            <span style="display: flex"> <img src="${comment.account.image}" style="width: 35px ; height: 35px ; border-radius: 50% ; border: 3px solid grey"> <h5 style="margin-left: 10px ; margin-top: 7px">${comment.account.username} </h5> <h8 style="margin-left: 15px ; color: grey ; margin-top: 7px">${timePosted}</h8> </span>
                             </div>
                            <div class="comment-content" style="border-radius: 8px;padding: 10px;">
                            <h6>${comment.content}</h6>
                            </div>    
                        </div>
                    `;
                    commentsSection.insertAdjacentHTML('beforeend', commentHtml);
                });
            } else {
                commentsSection.innerHTML = '<p>Chưa có bình luận nào.</p>';
            }
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function postComment(button) {
    const commentText = button.parentElement.querySelector('textarea').value;
    const postData = {
        content: commentText,
        createdBy: id
    };
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: `http://localhost:8080/comments/add/${idP}/${localStorage.getItem('idAccount')}`,
        data: JSON.stringify(postData),
        contentType: "application/json",
        success: function (response) {
                button.parentElement.querySelector('textarea').value = '';
            alert("comment sucsecfly !");
        },
        error: function (err) {
            console.log(err);
        }
    });
}

function calculateTimePosted(createdAt) {
    const currentTime = new Date();
    const postedTime = new Date(createdAt);
    const timeDiff = currentTime - postedTime;

    if (timeDiff < 60000) {
        return Math.floor(timeDiff / 1000) + " giây trước";
    } else if (timeDiff < 3600000) {
        return Math.floor(timeDiff / 60000) + " phút trước";
    } else if (timeDiff < 86400000) {
        return Math.floor(timeDiff / 3600000) + " giờ trước";
    } else if (timeDiff < 2592000000) {
        return Math.floor(timeDiff / 86400000) + " ngày trước";
    } else if (timeDiff < 31536000000) {
        return Math.floor(timeDiff / 2592000000) + " tháng trước";
    } else {
        return Math.floor(timeDiff / 31536000000) + " năm trước";
    }
}
function showChatMessages(messages) {
    let chatList = document.getElementById("chatList");
    chatList.innerHTML = ""; // Xóa nội dung cũ

    messages.forEach(function (message) {
        let li = document.createElement("li");
        li.textContent = message.content;
        chatList.appendChild(li);
    });
}
function getListChat(idAccount2) {
    setIdAccount2(idAccount2)
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        url: `http://localhost:8080/chat/detail/${localStorage.getItem('idAccount')}/${idAccount2}`,
        success: function (data) {
            showListChat(data)
            scrollToBottom();
            console.log(data)
        },
        error: function (err) {
            console.log(err)
        }
    });
}
getListChat()
function setIdAccount2(idAccount2) {
    localStorage.removeItem("idAccount2");
    localStorage.setItem("idAccount2" , idAccount2);
}
function showListChat(arr) {
    let str = "";
    for (const c of arr) {
        const chatTime = calculateTimeChat(c.createdAt);
        if(c.account1.id == localStorage.getItem('idAccount')){
            str += `
           <div style="float: right ; display: flex ">
            <div style="width: 350px">
            <div style="float: right ; background-color: #1877f2 ; color: white ;margin-right: 5px; margin-top: 10px ; border-radius: 10px ; padding: 5px ; text-align: center ; display: flex">
            <h6 style="text-align: right ; margin-top: 5px ; margin-left: 5px ; margin-right: 5px">${c.content}</h6>
             </div>
             </div>
             <div style="width: 35px ; margin-top: 10px">
              <img src="${c.account1.image}" alt="" style="width: 35px ; height: 35px ; border-radius: 50%"> 
            </div>
           </div>
        `
        }else{
            str += `
            <div style="float: left ; display: flex">
            <div style="width: 35px ; margin-top: 10px">
              <img src="${c.account2.image}" alt="" style="width: 35px ; height: 35px ; border-radius: 50%"> 
            </div>
            <div style="width: 350px">
                        <div style="float: left ; background-color: #e4e6eb ; color: black ;margin-left: 5px; margin-top: 10px ; border-radius: 10px ; padding: 5px ; text-align: center ; display: flex">
                <h6 style="text-align: left ; margin-top: 5px ; margin-left: 5px ; margin-right: 5px">${c.content}</h6>
             </div>
            </div>

            </div>
        `
        }
    }
    document.getElementById("chatList").innerHTML = str;
}
function sendMessage() {
    let content = document.getElementById("newMessage").value;
    let chat = {content,account1: {id: localStorage.getItem('idAccount')},account2: {id: localStorage.getItem("idAccount2")}};
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + localStorage.getItem('token'),
        },
        url: "http://localhost:8080/chat",
        data: JSON.stringify(chat),
        contentType: "application/json",
        success: function (data) {
            appendMessageToChatList(data);
            document.getElementById("newMessage").value = "";
        },
        error: function (err) {
            console.log(err);
        }
    });
}
function calculateTimeChat(createdAt) {
    const currentTime = new Date();
    const postedTime = new Date(createdAt);
    const timeDiff = currentTime - postedTime;
    if (timeDiff < 60000) {
        return Math.floor(timeDiff / 1000) + " giây trước";
    } else if (timeDiff < 3600000) {
        return Math.floor(timeDiff / 60000) + " phút trước";
    } else if (timeDiff < 86400000) {
        return Math.floor(timeDiff / 3600000) + " giờ trước";
    } else if (timeDiff < 2592000000) {
        return Math.floor(timeDiff / 86400000) + " ngày trước";
    } else if (timeDiff < 31536000000) {
        return Math.floor(timeDiff / 2592000000) + " tháng trước";
    } else {
        return Math.floor(timeDiff / 31536000000) + " năm trước";
    }
}