let id = localStorage.getItem('idAccount');
let token = localStorage.getItem('token');
function login() {
    let username = document.getElementById("userNameLogin").value;
    let password = document.getElementById("passwordLogin").value;
    let accountlogin = {username, password};
    $.ajax({
            type: "Post",
            headers: {
                'Content-Type': 'application/json',
            },
            url: "http://localhost:8080/login",
            data: JSON.stringify(accountlogin),
            success: function (data) {
                localStorage.setItem("account", JSON.stringify(data));
                console.log(localStorage.getItem("account"))
                for (const r of data.roles) {
                if (r.name === "ROLE_ADMIN") {
                    location.href = "index.html";
                } else if (r.name === "ROLE_USER") {
                    location.href = "index.html";
                }
                localStorage.setItem("token", data.token);
                    localStorage.setItem("idAccount", data.id);
            }
            },
            error: function (err) {
                console.log(err)
                alert("Đăng nhập không thành công. Vui lòng kiểm tra lại.");
            }
        });
}
function register(){
    const username = $("#username").val();
    const password = $("#password").val();
    const confirmPassword = $("#checkpassword").val();
    const email = $("#email").val();
    const dateOfBirth = $("#birthday").val();
    const image = "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQKgxhwcHlVo9Zv9YUEo6cVWqBZci1cAy4GQg&usqp=CAU";
    const phoneNumber = $("#phone").val();
    const address = $("#address").val();

    if (password !== confirmPassword) {
        alert("Mật khẩu không hợp lệ. Vui lòng kiểm tra lại.");
        return;
    }

    const userData = { username, password, email, dateOfBirth, image, phoneNumber, address, role:{"id": 2}};

    $.ajax({
        url: "http://localhost:8080/apiAccount/creatAccount",
        method: "POST",
        contentType: "application/json",
        data: JSON.stringify(userData),
        success: function (data) {
            alert("Tài khoản được tạo thành công.");
            window.location.href = "login.html";
        },
        error: function (error) {
            console.error(error);
            alert("Đăng ký không thành công. Vui lòng kiểm tra lại.");
        }
    });
}