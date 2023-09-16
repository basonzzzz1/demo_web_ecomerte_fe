Chart.defaults.global.defaultFontFamily = 'Nunito', '-apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif';
Chart.defaults.global.defaultFontColor = '#858796';
let token = localStorage.getItem('token');
let id = localStorage.getItem('idAccount');
year = 2023
function logout() {
  localStorage.removeItem("account");
  localStorage.removeItem("token");
  localStorage.removeItem("idAccount")
  window.location.href = "index.html";
}
function getAll() {
  $.ajax({
    type: "GET",
    headers: {
      'Accept': 'application/json',
      "Authorization": "Bearer " + token
    },
    url: "http://localhost:8080/commodity/getAllRevenue/"+id,
    success: function (response) {
      var months = [];
      var revenues = [];
      sumrevenueall = 0;
      response.forEach(function (item) {
        if(item.month === 1){
          months.push("Jan");
        }else if(item.month == 2){
          months.push("Feb")
        }else if(item.month == 3){
          months.push("Mar")
        }else if(item.month == 4){
          months.push("Apr")
        }else if(item.month == 5){
          months.push("May")
        }else if(item.month == 6){
          months.push("Jun")
        }else if(item.month == 7){
          months.push("Jul")
        }else if(item.month == 8){
          months.push("Aug")
        }else if(item.month == 9){
          months.push("Sep")
        }else if(item.month == 10){
          months.push("Oct")
        }else if(item.month == 11){
          months.push("Nov")
        }else if(item.month == 12){
          months.push("Dec")
        }
        revenues.push(item.revenue);
        sumrevenueall = sumrevenueall+ item.revenue;
      });
      myLineChart.data.labels = months;
      myLineChart.data.datasets[0].data = revenues;
      myLineChart.update();
      document.getElementById("revenuemonth").innerHTML = "$"+(sumrevenueall/12);
      document.getElementById("revenueyear").innerHTML = "$"+sumrevenueall;
      percent = percentage(sumrevenueall , 200000);
      localStorage.setItem("widthpercent", percent);
      const progressBar = document.getElementById('progressBar');
      progressBar.style.width = localStorage.getItem('widthpercent') + '%';
      document.getElementById("percent").innerHTML = percent+"%";
    },
    error: function (err) {
      console.log(err)
    }
  });
};
getAll();
function percentage(partialValue, totalValue) {
  return (100 * partialValue) / totalValue;
}
function getPending() {
  // Tạo ra 1 request.
  $.ajax({
    type: "GET",
    headers: {
      'Accept': 'application/json',
      "Authorization": "Bearer " + token
    },
    url: "http://localhost:8080/commodity/pending",
    success: function (response) {
      document.getElementById("pending").innerHTML = response;
    },
    error: function (err) {
      console.log(err)
    }
  });
};
getPending();
// function getBillShop() {
//   $.ajax({
//     type: "GET",
//     headers: {
//       'Accept': 'application/json',
//       "Authorization": "Bearer " + token
//     },
//     url: "http://localhost:8080/commodity/getBill/" + id,
//     success: function (response) {
//       for (const a of response) {
//         console.log(a.nameshop);
//       }
//     },
//     error: function (err) {
//       console.log(err)
//     }
//   });
// };
// getBillShop()
function getNameShop() {
  $.ajax({
    type: "GET",
    headers: {
      'Accept': 'application/json',
      "Authorization": "Bearer " + token
    },
    url: "http://localhost:8080/commodity/getShop/" + id,
    success: function (response) {
        console.log(response.name);
        document.getElementById("nameShop").innerHTML = response.name;
        document.getElementById("nameShop2").innerHTML = response.name;
    },
    error: function (err) {
      console.log(err)
    }
  });
};
getNameShop()

function number_format(number, decimals, dec_point, thousands_sep) {
  // Đây là một hàm JavaScript tùy chỉnh để định dạng số theo kiểu có dấu phân cách hàng nghìn và dấu thập phân, giống như hàm number_format trong PHP. Các tham số của hàm là:
  // *     example: number_format(1234.56, 2, ',', ' ');
  // *     return: '1 234,56'
  // number sẽ là doanh thu tháng
  number = (number + '').replace(',', '').replace(' ', '');
  // là để xử lý đầu vào số. Nó chuyển số thành một chuỗi, sau đó loại bỏ dấu ',' và dấu cách.
  var n = !isFinite(+number) ? 0 : +number,
    //  Dòng này kiểm tra xem biến number có phải là một số hợp lệ hay không. Nếu không phải, nó sẽ gán giá trị 0; nếu là số hợp lệ, nó sẽ gán giá trị số đó cho biến n.
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    //   Tương tự như trên, đây kiểm tra và gán giá trị cho biến prec, biểu thị số thập phân sau dấu thập phân.
    sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
    //    Tương tự như trên, đây là để xác định ký hiệu ngăn cách hàng nghìn. Nếu không được định nghĩa, nó sẽ được đặt thành dấu ',' mặc định.
    dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
    //    Tương tự như trên, đây là để xác định dấu thập phân. Nếu không được định nghĩa, nó sẽ được đặt thành dấu '.' mặc định.
      // var s = '': Tạo một chuỗi rỗng s để chứa kết quả sau khi định dạng.
    s = '',
    toFixedFix = function(n, prec) {
      var k = Math.pow(10, prec);
      return '' + Math.round(n * k) / k;
    };
  // Fix for IE parseFloat(0.55).toFixed(0) = 0;
  s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.');
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || '').length < prec) {
    s[1] = s[1] || '';
    s[1] += new Array(prec - s[1].length + 1).join('0');
  }
  return s.join(dec);
}

// Area Chart Example
var ctx = document.getElementById("myAreaChart");
var myLineChart = new Chart(ctx, {
  type: 'line',
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [{
      label: "Earnings",
      lineTension: 0.3,
      backgroundColor: "rgba(78, 115, 223, 0.05)",
      borderColor: "rgba(78, 115, 223, 1)",
      pointRadius: 3,
      pointBackgroundColor: "rgba(78, 115, 223, 1)",
      pointBorderColor: "rgba(78, 115, 223, 1)",
      pointHoverRadius: 3,
      pointHoverBackgroundColor: "rgba(78, 115, 223, 1)",
      pointHoverBorderColor: "rgba(78, 115, 223, 1)",
      pointHitRadius: 10,
      pointBorderWidth: 2,
      data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    }],
  },
  options: {
    maintainAspectRatio: false,
    layout: {
      padding: {
        left: 10,
        right: 25,
        top: 25,
        bottom: 0
      }
    },
    scales: {
      xAxes: [{
        time: {
          unit: 'date'
        },
        gridLines: {
          display: false,
          drawBorder: false
        },
        ticks: {
          maxTicksLimit: 7
        }
      }],
      yAxes: [{
        ticks: {
          maxTicksLimit: 5,
          padding: 10,
          // Include a dollar sign in the ticks
          callback: function(value, index, values) {
            return '$' + number_format(value);
          }
        },
        gridLines: {
          color: "rgb(234, 236, 244)",
          zeroLineColor: "rgb(234, 236, 244)",
          drawBorder: false,
          borderDash: [2],
          zeroLineBorderDash: [2]
        }
      }],
    },
    legend: {
      display: false
    },
    tooltips: {
      backgroundColor: "rgb(255,255,255)",
      bodyFontColor: "#858796",
      titleMarginBottom: 10,
      titleFontColor: '#6e707e',
      titleFontSize: 14,
      borderColor: '#dddfeb',
      borderWidth: 1,
      xPadding: 15,
      yPadding: 15,
      displayColors: false,
      intersect: false,
      mode: 'index',
      caretPadding: 10,
      callbacks: {
        label: function(tooltipItem, chart) {
          var datasetLabel = chart.datasets[tooltipItem.datasetIndex].label || '';
          return datasetLabel + ': $' + number_format(tooltipItem.yLabel);
        }
      }
    }
  }
});
