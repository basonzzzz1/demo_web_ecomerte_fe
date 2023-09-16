let myCart = JSON.parse(localStorage.getItem("cart")) || [];
// let idAccount = localStorage.getItem('idAccount');


function addToCart(id) {
    const account = JSON.parse(localStorage.getItem("account"));

    if (!account || !account.id) {
        alert("Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng.");
        return;
    }
    $.ajax({
        type: "GET",
        headers: {
            'Accept': 'application/json',
        },
        url: `http://localhost:8080/api/product/${id}`,
        success: function (data) {
            if (data.quantity > 0) {
                let existingItem = myCart.find(function (cart) {
                    return cart.id === data.id;
                });

                if (existingItem) {
                    if (existingItem.cartQuantity < existingItem.quantity) {
                        existingItem.cartQuantity++;
                    } else {
                        alert(`"${existingItem.name}" chỉ còn ${existingItem.quantity} sản phẩm, bạn không thể thêm quá số lượng vào giỏ hàng `);
                        return;
                    }
                } else {
                    myCart.push({...data, cartQuantity: 1, productId: data.id});
                }

                updateCartDisplay();
                localStorage.setItem("cart", JSON.stringify(myCart));
                const notificationText = `Đã thêm sản phẩm ${data.name} vào giỏ hàng.`;
                alert(notificationText);
            } else {
                alert(`Sản phẩm "${data.name}" đã hết hàng.`);
            }
        },
        error: function (err) {
            console.log(err)
            // Xử lý lỗi
        }
    });
}

function updateCartDisplay() {
    const cartHtml = `<h2>Giỏ hàng của bạn</h2>
                         ${myCart.length === 0 ? "<p>Giỏ hàng của bạn đang trống.</p>" :
        `<ul>
                            ${myCart.map((item, index) => `
                                <li class="row mb-2">
                                    <div class="col-lg-5">
                                        <div class="me-lg-5">
                                            <div class="d-flex">
                                                <img src="${item.imgProduct.thumbnail}"
                                                     class="border rounded me-3" style="width: 96px; height: 96px;"/>
                                                <h6 class=""> ${item.name}</h6>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="col-lg-2 col-sm-6 col-6 d-flex flex-row flex-lg-column flex-xl-row text-nowrap">
                                        <h6 class=""> Số Lượng: 
                                            <button class="btn btn-light border text-danger btn-sm" onclick="decreaseQuantity(${index})">-</button>
                                            ${item.cartQuantity}  
                                            <button class="btn btn-light border text-success btn-sm" onclick="increaseQuantity(${index})">+</button>
                                        </h6>
                                        <p> Thành tiền: ${item.cartQuantity * item.price} $</p>
                                    </div>
                                    <div class="col-lg col-sm-6 d-flex justify-content-sm-center justify-content-md-start justify-content-lg-center justify-content-xl-end mb-2">
                                        <div class="float-md-end">
                                            <a href="#!" class="btn btn-light border px-2 icon-hover-primary"><i
                                                    class="fas fa-heart fa-lg px-1 text-secondary"></i></a>
                                            <button class="btn btn-light border text-danger icon-hover-danger" onclick="deleteProductCard(${index})">Xoá khỏi giỏ hàng</button>
                                        </div>
                                    </div>
                                </li>
                            `).join('')}
                         </ul>`}`;

    document.getElementById("cartHtml").innerHTML = cartHtml;
}

updateCartDisplay()

function decreaseQuantity(index) {
    if (myCart[index].cartQuantity > 1) {
        myCart[index].cartQuantity--;
        updateCartDisplay();
        pay();
        localStorage.setItem("cart", JSON.stringify(myCart));
    }
}

function increaseQuantity(index) {
    const item = myCart[index];
    if (item.cartQuantity < item.quantity) {
        item.cartQuantity++;
        updateCartDisplay();
        pay();
        localStorage.setItem("cart", JSON.stringify(myCart));
    } else {
        alert(`"${item.name}" chỉ còn ${item.quantity} sản phẩm, bạn không thể thêm quá số lượng vào giỏ hàng`);
    }
}

function deleteProductCard(index) {
    const confirmation = confirm("Bạn có chắc chắn muốn xoá sản phẩm này khỏi giỏ hàng?");
    if (confirmation) {
        myCart.splice(index, 1);
        updateCartDisplay();
        pay();
        localStorage.setItem("cart", JSON.stringify(myCart));
    }
}


function pay() {
    let total = 0;

    const productsForPayment = [];

    myCart.forEach(item => {
        total += item.cartQuantity * item.price;
        productsForPayment.push({
            name: item.name,
            quantity: item.cartQuantity,
            price: item.cartQuantity * item.price
        });
    });

    const payHTML = `
            ${myCart.length === 0 ? "<p>Bạn chưa có sản phẩm nào để thanh toán</p>" :
        `<ul>
                    ${productsForPayment.map((item, index) => `
                    `).join('')}
                    <li class="row mb-2">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <p class="mb-2">Tổng Tiền hàng</p>
                                <p class="mb-2">${total} $</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="mb-2">Giảm giá:</p>
                                <p class="mb-2 text-success"> 10%</p>
                            </div>
                            <div class="d-flex justify-content-between">
                                <p class="mb-2">Phí vận chuyển:</p>
                                <p class="mb-2">+ $14.00 $</p>
                            </div>
                            <hr/>
                            <div class="d-flex justify-content-between">
                                <p class="mb-2">Tổng thanh toán</p>
                                <p class="mb-2 fw-bold">${total - total*10/100 + 14} $</p>
                            </div>
                        </div>
                         <div class="mt-3">
                                <button class="btn btn-success w-100 shadow-0 mb-2" onclick="buy()"> Mua Hàng </button>
                                <a href="http://localhost:63342/FE/index.html#" class="btn btn-light w-100 border mt-2"> Quay trở lại </a>
                         </div>
                    </li>
                </ul>`}`;

    document.getElementById("payHTML").innerHTML = payHTML;
}

pay();
function buy() {
    const account = JSON.parse(localStorage.getItem("account"));

    if (!account || !account.id) {
        alert("Vui lòng đăng nhập để thực hiện thanh toán.");
        return;
    }

    const currentDatetime = new Date();
    const formattedDatetime = currentDatetime.toISOString();

    const orders = {
        account: {id: account.id},
        datetime: formattedDatetime,
    };
    $.ajax({
        type: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        url: "http://localhost:8080/orders",
        data: JSON.stringify(orders),
        success: function (response) {
            // console.log(response);
            localStorage.setItem("orderId", JSON.stringify(response.id));
            updateCartDisplay();
            pay();
            createOrderDetail(0);
            alert("Mua hàng thành công, bạn sẽ nhận được sau 3-5 ngày. Cảm ơn bạn đã ủng hộ")
        },
        error: function (err) {
            console.log(err);
            alert("Đã xảy ra lỗi khi tạo đơn hàng.");
        }
    });
}

function createOrderDetail(index) {
    const orderId = JSON.parse(localStorage.getItem("orderId"));

    if (index < myCart.length) {
        const initialQuantity = myCart[index].quantity;
        const soldQuantity = myCart[index].cartQuantity;
        const remainingQuantity = initialQuantity - soldQuantity;

        const updatedProduct = {
            quantity: remainingQuantity
        };

        $.ajax({
            type: "PUT",
            headers: {
                'Content-Type': 'application/json',
            },
            url: `http://localhost:8080/api/${myCart[index].id}`,
            data: JSON.stringify(updatedProduct),
            success: function () {
                const orderDetail = {
                    quantity: soldQuantity,
                    product: {
                        id: myCart[index].id
                    },
                    orders: {
                        id: orderId
                    }
                };
                $.ajax({
                    type: "POST",
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    url: "http://localhost:8080/api/order-details",
                    data: JSON.stringify(orderDetail),
                    success: function () {
                        myCart.splice(index, 1);
                        localStorage.setItem("cart", JSON.stringify(myCart));
                        updateCartDisplay();
                        pay();
                        createOrderDetail(index);
                    },
                    error: function (err) {
                        console.log(err);
                        alert("Đã xảy ra lỗi khi tạo chi tiết đơn hàng.");
                    }
                });
            },
            error: function (err) {
                console.log(err);
                alert("Đã xảy ra lỗi khi cập nhật thông tin sản phẩm.");
            }
        });
    }
}