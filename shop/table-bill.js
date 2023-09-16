let token = localStorage.getItem('token');
let id = localStorage.getItem('idAccount');
$(document).ready(function () {
    var dataTable = $('#dataTable').DataTable({
    });
    function getAllBill() {
        $.ajax({
            type: "GET",
            headers: {
                'Accept': 'application/json',
                "Authorization": "Bearer " + token
            },
            url: "http://localhost:8080/commodity/getBill/" + id,
            success: function (response) {
                show(response);
            },
            error: function (err) {
                console.log(err)
            }
        });
    };
    function show(arr) {
        dataTable.clear().draw(); // Xóa dữ liệu cũ
        for (const a of arr) {
            var formattedBillInvoice = "$" + number_format(a.billInvoice, 0, ',', ' .   '); // Định dạng số
            dataTable.row.add([
                a.idorder,
                a.name,
                a.nameproduct,
                a.orderquantity,
                a.orderDate,
                formattedBillInvoice,
            ]).draw();
        }
    }
    getAllBill();
});
function number_format(number, decimals, dec_point, thousands_sep) {
    // *     example: number_format(1234.56, 2, ',', ' ');
    // *     return: '1 234,56'
    number = (number + '').replace(',', '').replace(' ', '');
    var n = !isFinite(+number) ? 0 : +number,
        prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
        sep = (typeof thousands_sep === 'undefined') ? ',' : thousands_sep,
        dec = (typeof dec_point === 'undefined') ? '.' : dec_point,
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