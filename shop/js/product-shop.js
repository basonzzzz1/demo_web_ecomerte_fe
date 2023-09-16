let idAccount = localStorage.getItem("idAccount");
function getAll() {
    // Tạo ra 1 request.
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
        },
        url: "http://localhost:8080/api/productsShop/" + idAccount,
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
                          <a href="#!" class="btn btn-primary shadow-0 me-1">Add to cart</a>
                          <a href="#!" class="btn btn-light border px-2 pt-2 icon-hover"><i class="fas fa-heart fa-lg text-secondary px-1"></i></a>
                        </div>
                      </div>
                    </div>
                  </div>
        `
    }
    document.getElementById("body-content").innerHTML = str;
}