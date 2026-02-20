document.addEventListener('DOMContentLoaded', function () {
    showLoading();
    urlapi = 'https://script.google.com/macros/s/AKfycbwSQn-VpYHC6lGntFx3eqZbeGW5_MJhOvT9bynDi7j6wlFpkJILoM1ADjhlz3AuoUVLWQ/exec';
    queryapi = `?id=${localStorage.getItem('uuid')}`;
    fetch(urlapi + queryapi)
        .then(response => response.json())
        .then(data => {
            data.user.forEach(function (user) {
                document.querySelector('#token').value = user.token;
            });
           checkid();
        })
        .catch(error => {
            console.error('Error fetching data:', error);
        });
        
});

function editauth() {
    var myParam = window.location.search;

    if (!myParam || myParam.trim() === '') {
        Swal.fire({
            title: 'กรุณา ออก Token ก่อน!',
            text: 'ค่าพารามิเตอร์ว่างเปล่า',
            icon: 'error'
       }).then((result) => {
            gettoken();
        });
        return; // Exit the function
    }

    var exc = myParam.split('code=')[1].split('&')[0];
    Swal.fire({
        title: 'ยืนยันการบันทึก.!',
        html: exc,
        icon: 'info',
      //  showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
       // cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {
            var urlperson = `https://script.google.com/macros/s/AKfycbxX2rhJcNk-Fek0QzesB9fGe0cVQemEg7QqH0r2beMwknjbKBA0yb4VC7hOqMsTSPM0OQ/exec`;
            var dataperson = `?id=${localStorage.getItem('uuid')}&token=${exc}`;
            fetch(urlperson + dataperson)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Handle the data returned from the server
                    console.log(data);

                    // Show a success message using SweetAlert
                    Swal.fire({
                        title: 'การบันทึกข้อมูลสำเร็จ!',
                        text: 'ปิดหน้าเว็บออกได้เลยครับ',
                        icon: 'success'
                    }).then(() => {
                        window.location.href = 'about:blank';
                    });
                })
                .catch(error => {
                    // Handle any errors that occurred during the fetch
                    console.error('Fetch error:', error);

                    // Show an error message using SweetAlert
                    Swal.fire({
                        title: 'เกิดข้อผิดพลาด',
                        text: 'ไม่สามารถแก้ไขข้อมูลได้',
                        icon: 'error'
                    });
                });
        }
    });
}


function gettoken() {
    let uuid = localStorage.getItem("uuid");
    let tokenvar = document.getElementById("token").value;

    if (tokenvar) {
        Swal.fire({
            title: 'พบ Token ในระบบแล้ว!',
            text: 'ต้องการออก Token ใหม่อีกครั้งใช่หรือไม่',
            icon: 'question',
            showCancelButton: true,
            confirmButtonText: 'ใช่',
            cancelButtonText: 'ไม่'
      }).then((result) => {
                if (result.isConfirmed) {
            tokenapi();
        }
        });
    }else {
        Swal.fire({
            title: 'ดำเนินการ ออก Line Token!',
            text: '',
            icon: 'info',
            confirmButtonText: 'ตกลง',
       }).then((result) => {
            tokenapi();
        });
    }
}

function tokenapi(){
    let uuid = localStorage.getItem("uuid");
    let url = 'https://wisanusenhom.github.io/nu/token.html';
    let cid = 'oXTr5al05irtPoZ9pkWof9';
    let noti = `https://notify-bot.line.me/oauth/authorize?response_type=code&client_id=${cid}&redirect_uri=${url}&scope=notify&state=${uuid}`;
    window.location.replace(noti);
}

function checktoken() {
    let tokenvar = document.getElementById("token").value;
     if (!tokenvar || tokenvar.trim() === '') {
        Swal.fire({
            title: 'ไม่พบ LINE TOKEN ในระบบ!',
            text: 'กรุณาดำเนินการ',
            icon: 'error',
            confirmButtonText: 'ตกลง',
        }).then((result) => {
            gettoken();
        });
  
    }
}

function checkid() {
     hideLoading() ;   
    let myParam = window.location.search;
    if (myParam) {
        Swal.fire({
            title: 'ดำเนินการต่อ',
            text: 'พบค่าสำหรับ บันทึก Token ',
            icon: 'success',
            confirmButtonText: 'ตกลง',
        }).then((result) => {
            editauth();
        });  
    }else{
       checktoken() ;
    }
}

// css loadding
function showLoading() {
    var overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'flex';
  }
  
  function hideLoading() {
    var overlay = document.getElementById('loadingOverlay');
    overlay.style.display = 'none';
  }
