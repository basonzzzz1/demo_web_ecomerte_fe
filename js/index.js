// let token = localStorage.getItem('token');
// let id = localStorage.getItem('idAccount');
function getAll() {
    // Tạo ra 1 request.
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
        },
        url: "http://localhost:8080/api/products",
        success: function (data) {
            show(data);
        },
        error: function (err) {
            console.log(err)
            // lỗi
        }
    });
}

getAll();

function show(arr) {
    let str = "";
    for (const p of arr) {
        str += `
                  <div class="col-lg-3 col-md-6 col-sm-6 d-flex">
                    <div class="card w-100 my-2 shadow-2-strong">
                      <img src="${p.imgProduct.thumbnail}" class="card-img-top cursor-pointer" onclick="showProduct(${p.id})" style="aspect-ratio: 1 / 1" />
                      <div class="card-body d-flex flex-column">
                        <h5 class="card-title name-product cursor-pointer" onclick="showProduct(${p.id})">${p.name}</h5>
                        <p class="card-text">$${p.price}</p>
                        <div class="card-footer d-flex align-items-end pt-3 px-0 pb-0 mt-auto">
                           <button type="button" class="btn btn-success" onclick="addToCart(${p.id})">Thêm vào Giỏ Hàng</button>
                          <button class="btn btn-light border px-2 pt-2 icon-hover" style="background-color: " id="likeProduct${p.id}" onclick="LikeProduct(${p.id})">
                          <i class="fas fa-heart fa-lg text-secondary px-1" style="color: blue"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
        `
        function likePost() {
            const likeButton = document.getElementById(`likeProduct${p.id}`);
            $.ajax({
                type: "GET",
                headers: {
                    'Accept': 'application/json',
                    "Authorization": "Bearer " + localStorage.getItem('token')
                },
                url: `http://localhost:8080/api/like/${p.id}/`+localStorage.getItem('idAccount'),
                success: function (response) {
                    console.log(response);
                    if (response === true) {
                        document.getElementById(`likeProduct${p.id}`).style.backgroundColor = "pink";
                    } else {
                        document.getElementById(`likeProduct${p.id}`).style.backgroundColor = "white";
                    }
                },
                error: function (err) {
                    console.error("Error liking the post:", err);
                }
            });
        }
        likePost();
        document.getElementById("body-content").innerHTML = str;
    }
}
function LikeProduct(productId) {
    let idP = productId
    $.ajax({
        type: "POST",
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json', // Set the content type
            "Authorization": "Bearer " + token
        },
        url: `http://localhost:8080/api/like/${idP}/${localStorage.getItem('idAccount')}`,
        success: function (response) {
            console.log(response);
            alert(response);
            getAll();

        },
        error: function (err) {
            console.error("Error adding like:", err);
        }
    });
}

function search(){
    let search = document.getElementById("form1").value;
    if (search === "") {
        getAll();
        return;
    }
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
            "Authorization": "Bearer " + token
        },
        url: "http://localhost:8080/api/products/search/"+search,
        success: function (data) {
            show(data);
        },
        error: function (err) {
            console.log(err)
        }
    });
}

function showProduct(idP){
    window.location = "product_detail.html?id=" + idP;
}

function showUserProfile(idA){
    window.location = "user_profile.html?id=" + idA;
}