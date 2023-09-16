
function getAll() {
$.ajax({
    type: "GET",
    headers: {
        'Accept': 'application/json',
        "Authorization": "Bearer " + localStorage.getItem('token'),
    },
    url: `http://localhost:8080/chat/new/${localStorage.getItem('idAccount')}`,
    success: function (data) {
        console.log(data)
        show(data);
    },
    error: function (err) {
        console.log(err)
    }
});
}

getAll();
function show(arr) {
    let str = "";
    for (const c of arr) {
        const chatTime = calculateTimeChat(c.createdAt);
        str += `
<div style="border: 1px solid #d5d4d4 ; border-radius: 7px ; margin-top: 1px">
 <button  onclick="getListChat(${c.account2.id})" className="dropdown-item d-flex align-items-center" style="height: 60px ; border: 1px solid white ; background-color: white ; border-radius: 6px" data-toggle="modal" data-target="#chatModal">
    <div className="dropdown-list-image mr-3" style="display: flex">
        <img className="rounded-circle" src="${c.account2.image}" style="width: 35px ; height: 35px ;border: 3px solid grey; border-radius: 50%">
            <div className="status-indicator bg-success"><h5 style="margin-top: 6px ; color: black ; margin-left: 5px">${c.account2.username}</h5></div>
    </div>
    <div className="font-weight-bold" style="display: flex">
        <div className="text-truncate" style="width: 239.9px;font-family: inherit ; white-space: nowrap ; overflow-x: hidden; position: relative; display: block ; overflow-y: hidden ; text-overflow: ellipsis; text-align: left">${c.content}
        </div>
        <div className="small text-gray-500">${chatTime}</div>
    </div>
</button>
</div>
        `
    }
    document.getElementById("showChat").innerHTML = str;
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
        //     hãy tìm cách để tim nhắn hiển thị ngay lập tức ở đây
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
function showChatMessages(messages) {
    let chatList = document.getElementById("chatList");
    chatList.innerHTML = ""; // Xóa nội dung cũ

    messages.forEach(function (message) {
        let li = document.createElement("li");
        li.textContent = message.content;
        chatList.appendChild(li);
    });
}
function appendMessageToChatList(message) {
    const chatTime = calculateTimeChat(message.createdAt);
    const chatList = document.getElementById("chatList");

    let chatDiv = document.createElement("div");
    chatDiv.className = "chat-message";

    if (message.account1.id == localStorage.getItem('idAccount')) {
        chatDiv.classList.add("right-chat"); // Tin nhắn của người dùng hiện tại
    } else {
        chatDiv.classList.add("left-chat"); // Tin nhắn của người khác
    }

    let contentDiv = document.createElement("div");
    contentDiv.textContent = message.content;
    contentDiv.className = "chat-content";

    let timeDiv = document.createElement("div");
    timeDiv.textContent = chatTime;
    timeDiv.className = "chat-time";

    chatDiv.appendChild(contentDiv);
    chatDiv.appendChild(timeDiv);
    chatList.appendChild(chatDiv);
}
function scrollToBottom() {
    // Lấy phần tử chứa tin nhắn
    const chatContent = document.getElementById("chatList");

    // Lấy chiều cao của phần tử chứa tin nhắn
    const chatContentHeight = chatContent.scrollHeight;

    // Lấy chiều cao của phần tử cha (modal-content)
    const modalContentHeight = document.querySelector(".modal-body").offsetHeight;

    // Tính toán giá trị scrollTop
    const scrollTop = chatContentHeight - modalContentHeight;

    // Đặt giá trị scrollTop để cuộn đến cuối cùng
    chatContent.scrollTop = scrollTop;
}