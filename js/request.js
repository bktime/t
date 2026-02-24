document.addEventListener("DOMContentLoaded", function () {

    // check uuid
    const uuid = localStorage.getItem('uuid');
    const boss = localStorage.getItem('boss');

    if (uuid !== null && uuid !== undefined && uuid !== '') {
        // User is logged in
        checkRetryParams();
        checktoday();
        // Perform actions for logged-in users (e.g., API calls or redirection)

    } else {
        // User is not logged in, redirect to the login page
        console.log('User is not logged in. Redirecting to login page.');
        window.location.href = 'login.html'; // Replace with your login page URL
    }

    if (boss !== null && boss !== undefined && boss !== '') {
        // Boss is assigned
      console.log('User is logged in. Boss :', boss);

    } else {
        // Boss is not assigned
        displayBossNotAssignedError();
    }
async function displayBossNotAssignedError() {
        const refid = localStorage.getItem('refid');
        const mainsub = localStorage.getItem('mainsub');  
        try {
            // แสดงสถานะกำลังดำเนินการก่อนเรียก API
            Swal.fire({
                title: 'กำลังโหลดข้อมูล...',
                text: 'กรุณารอสักครู่',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });
    
            // Fetch options from API
            const response = await fetch(`https://script.google.com/macros/s/AKfycbzlanx_NXl5qy1mlvQP6oMl6zElUxDJ9nLUiZEqIHO0RKP7OcxkHKo5n_XUb-5UEHRN/exec?xmain=${mainsub}&updateby=${localStorage.getItem("name")}`);
    
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
    
            const data = await response.json();
            Swal.close(); // ปิดสถานะกำลังดำเนินการเมื่อโหลดสำเร็จ
    
            // Extract value and label from the fetched data
            const options = {};
            data.role.forEach(itemx => {
                options[itemx.id] = itemx.name;
            });
    
            // Show Swal modal for user selection
            const { value: selectedValue } = await Swal.fire({
                title: `กำหนดผู้บังคับบัญชาของท่าน`,
                input: "select",
                inputOptions: options,
                inputPlaceholder: "โปรดเลือกรายการ",
                allowOutsideClick: false,
                inputValidator: (value) => {
                    return new Promise((resolve) => {
                        if (value) {
                            // แสดงสถานะกำลังดำเนินการก่อนเรียก API แก้ไขข้อมูล
                            Swal.fire({
                                title: 'กำลังบันทึกข้อมูล...',
                                text: 'กรุณารอสักครู่',
                                allowOutsideClick: false,
                                didOpen: () => {
                                    Swal.showLoading();
                                }
                            });
    
                            // Make API call to update selected data
                            fetch(`https://script.google.com/macros/s/AKfycbycQZ5goIDuxiTSnaA6NTGGY5sgmKfVgDAt1wDDXqxn6sGRfDnYODVHJH67BQd_TvADbw/exec?id=${refid}&sts=${value}&updateby=${localStorage.getItem("name")}`)
                                .then(response => {
                                    if (!response.ok) {
                                        throw new Error(`Network response was not ok: ${response.statusText}`);
                                    }
                                    return response.json();
                                })
                                .then(() => {
                                    Swal.close(); // ปิดสถานะกำลังดำเนินการเมื่อบันทึกสำเร็จ
    
                                    // บันทึก boss ลงใน localStorage
                                    localStorage.setItem('boss', value);
    
                                    // Success notification
                                    Swal.fire({
                                        icon: 'success',
                                        title: 'Successful',
                                        text: 'การแก้ไขข้อมูลสำเร็จ.',
                                        allowOutsideClick: false,
                                    }).then(() => {
                                        location.reload();
                                    });
                                    resolve();
                                })
                                .catch(error => {
                                    Swal.close(); // ปิดสถานะกำลังดำเนินการเมื่อเกิดข้อผิดพลาด
    
                                    // Error notification
                                    Swal.fire({
                                        icon: 'error',
                                        title: 'Error',
                                        text: `เกิดข้อผิดพลาด: ${error.message}`
                                    });
                                    resolve();
                                });
                        } else {
                            resolve("กรุณาเลือกหัวหน้า");
                        }
                    });
                }
            });
        } catch (error) {
            Swal.close(); // ปิดสถานะกำลังดำเนินการเมื่อเกิดข้อผิดพลาด
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: `เกิดข้อผิดพลาด: ${error.message}`
            });
        }
    }  
   
});

// จากพี่ดำรงศักดิ์ สสจ.บึงกาฬ
// Function to calculate distance between two points using the Haversine formula
function calculateDistance(lat1, lon1, lat2, lon2) {
    const earthRadius = 6371; // Earth's radius in kilometers

    // Convert latitude and longitude from degrees to radians
    const radLat1 = (Math.PI * lat1) / 180;
    const radLon1 = (Math.PI * lon1) / 180;
    const radLat2 = (Math.PI * lat2) / 180;
    const radLon2 = (Math.PI * lon2) / 180;

    // Calculate the differences between the latitudes and longitudes
    const latDiff = radLat2 - radLat1;
    const lonDiff = radLon2 - radLon1;

    // Calculate the distance using the Haversine formula
    const a =
        Math.sin(latDiff / 2) * Math.sin(latDiff / 2) +
        Math.cos(radLat1) * Math.cos(radLat2) * Math.sin(lonDiff / 2) * Math.sin(lonDiff / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = earthRadius * c; // Distance in kilometers

    return distance;
}

// Function to display distance on the HTML element
function displayDistance(distance) {
    let xdistance = distance.toFixed(2);
    let unit = 'กม.';
    
    if (xdistance < 1) {
        xdistance = (xdistance * 1000).toFixed(0);
        unit = 'ม.';
    }

    const dispDistanceElement = document.getElementById('dispDistance');
    
      dispDistanceElement.textContent = `${localStorage.getItem("office")} : ${xdistance} ${unit}`;

    // Check if xdistance is greater than 1
    if (parseFloat(distance) > 10) {
        // Set the text color to red
        dispDistanceElement.style.color = 'red';
    } else {
        // Reset the text color to its default
        dispDistanceElement.style.color = ''; // or you can use 'black' or any other color you prefer
    }
}


// Get the user's current geolocation
navigator.geolocation.getCurrentPosition((position) => {
    const currentLat = position.coords.latitude;
    const currentLon = position.coords.longitude;

    // Replace these with the latitude and longitude of your target location
    const targetLat = localStorage.getItem('oflat');
    const targetLon = localStorage.getItem('oflong');

    // const targetLat = 18.3747422;
    // const targetLon = 103.6442384;

    const distance = calculateDistance(currentLat, currentLon, targetLat, targetLon);
    displayDistance(distance);
}, (error) => {
    console.error('Error getting geolocation:', error);
});
// สิ้นสุด


function checkin() {
    Swal.fire({
        title: 'คุณต้องการยื่นคำขอหรือไม่?',
        text: 'กรุณากด "ยืนยัน" เพื่อดำเนินการยื่นคำขอลงเวลาปฏิบัติงาน',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
           allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            // เริ่มต้น ลงเวลา


    // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        // ขอค่าพิกัด
        navigator.geolocation.getCurrentPosition(showPositionin, showError);
    } else {
        alert("เบราว์เซอร์ไม่รองรับ Geolocation");
    };
    // กำหนดตัวแปรที่จะใช้เก็บ elements
    const loadingModal = document.getElementById('loadingModal');

    // แสดง loading modal
    loadingModal.style.display = 'block';

    // เมื่อได้รับค่าพิกัด
    async function showPositionin(position) {

        let latitude = position?.coords?.latitude 
        ?? Number(localStorage.getItem("mylat"));

        let longitude = position?.coords?.longitude 
        ?? Number(localStorage.getItem("mylon"));

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        const uuid = localStorage.getItem('uuid');
        const cidhash = localStorage.getItem("cidhash");
        const userid = localStorage.getItem("userid");
        const name = localStorage.getItem("name");
        const job = localStorage.getItem("job");
        const mainsub = localStorage.getItem("mainsub");
        const office = localStorage.getItem("office");
        const latx = localStorage.getItem("oflat");
        const longx = localStorage.getItem("oflong");
        const db1 = localStorage.getItem("db1");
        const token = localStorage.getItem("token");
        //   const status = localStorage.getItem("status");
        const docno = localStorage.getItem("docno");
        const boss = localStorage.getItem("boss");
        const ceo = localStorage.getItem("ceo");
        const refid = localStorage.getItem("refid");

        let typea = document.querySelector('#typea').value;
        let nte = document.querySelector('#nte').value;

        let todays = new Date();
        todays.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        let todayx = todays.toLocaleTimeString('th-TH');
        
        let dt = document.getElementById("daytime").value;
        if (nte === null || nte === 0 || nte.length < 2) {
            Swal.fire({
                title: 'ผิดพลาด!',
                text: 'โปรดระบุเหตุผล หรือคำชี้แจง!',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            }).then(() => {
                // Reload the page
                location.reload();
            });
            return;
        }else if (nte ==='ระบบขัดข้อง'){
            Swal.fire({
                title: 'กรุณาติดต่อผู้พัฒนา',
                html: 'ท่านได้ระบุเหตุผลว่า "ระบบขัดข้อง" กรุณาแจ้งผู้พัฒนาเพื่อให้ดำเนินการแก้ไขปัญหาโดยเร็วที่สุด ขออภัยในความไม่สะดวก',
                icon: 'warning',
                allowOutsideClick: false,
                confirmButtonText: 'ตกลง'
            });    
        }
        // เลือก id "latlong"
             var latlongElement = document.getElementById('latlong');

             // แสดงค่าใน element
        latlongElement.innerHTML = 'พิกัดปัจจุบันของคุณ:<br>ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่ ระบบกำลังประมวลผลข้อมูล...';

        //   console.log(typea);
        let urlin = 'https://script.google.com/macros/s/AKfycbyziNGhQaE2jRgi8LZTDhqOWiWyOV0k9zP9kSK8ontoKM1_oSQZsUSlb9JZP7-cN0UdlA/exec';
        let prmin = `?ctype=In&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&dt=${dt}&token=${token}&job=${job}&docno=${docno}`;

        await fetch(urlin + prmin)
            .then(response => response.json())
            .then(data => {
                loadingModal.style.display = 'none';
                // เพิ่ม option สำหรับแต่ละ subcategory
                data.res.forEach(datas => {
                    let iconx = datas.icon;
                    let header = datas.header;
                    let text = datas.text;
                      Swal.fire({
                        confirmButtonColor: '#1e90ff',
                        icon: iconx,
                        title: header,
                        text: text,
                        allowOutsideClick: false
                    }).then((result) => {
                        // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
if (!result.isConfirmed) return;

// บันทึกวันเวลาเมื่อ success
if (iconx === "success") {
  const now = new Date();
  localStorage.setItem(
    "datecheck",
    now.toLocaleDateString("th-TH")
  );
  localStorage.setItem(
    "datetimecheck",
    now.toTimeString().slice(0, 8)
  );
}

try {
  // กรณีวันหยุด → ส่งรายงาน
  if (iconx === "success" && typea === "วันหยุด") {
    sendOffDayReport(
      "In", uuid, cidhash, userid, name, mainsub, office,
      latx, longx, db1, boss, ceo,
      latitude, longitude, typea, nte, todayx = dt,
      refid, token, job, docno
    );
    return;
  }

  // กรณีทั่วไป → ปิด LIFF
  if (window.liff) {
    liff.closeWindow();
  } else {
    window.close();
  }

} catch (err) {
  console.error("Close window failed:", err);
  setTimeout(() => location.reload(), 500);
}

                    });

                    // ---
                });

            })
    }

    // กรณีเกิดข้อผิดพลาดในการรับค่าพิกัด
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("ผู้ใช้ปฏิเสธการให้สิทธิ์ในการรับค่าพิกัด");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("ข้อมูลตำแหน่งไม่พร้อมใช้งาน");
                break;
            case error.TIMEOUT:
                alert("การร้องขอค่าพิกัดใช้เวลานานเกินไป");
                break;
            case error.UNKNOWN_ERROR:
                alert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
                break;
        }
    }

            // ฟังก์ชั่นลงเวลา
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การยื่นคำขอถูกยกเลิก', '', 'info');
        }
    });

}

function checkout() {
    Swal.fire({
        title: 'คุณต้องการยื่นคำขอหรือไม่?',
        text: 'กรุณากด "ยืนยัน" เพื่อดำเนินการยื่นคำขอลงเวลากลับ',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ยืนยัน',
        cancelButtonText: 'ยกเลิก',
           allowOutsideClick: false,
    }).then((result) => {
        if (result.isConfirmed) {
            // เริ่มต้น ลงเวลา

    // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        // ขอค่าพิกัด
        navigator.geolocation.getCurrentPosition(showPositionin, showError);
    } else {
        alert("เบราว์เซอร์ไม่รองรับ Geolocation");
    };
    // กำหนดตัวแปรที่จะใช้เก็บ elements
    const loadingModal = document.getElementById('loadingModal');

    // แสดง loading modal
    loadingModal.style.display = 'block';

    // เมื่อได้รับค่าพิกัด
    async function showPositionin(position) {

        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        console.log("Latitude: " + latitude);
        console.log("Longitude: " + longitude);

        const uuid = localStorage.getItem('uuid');
        const cidhash = localStorage.getItem("cidhash");
        const userid = localStorage.getItem("userid");
        const name = localStorage.getItem("name");
        const job = localStorage.getItem("job");
        const mainsub = localStorage.getItem("mainsub");
        const office = localStorage.getItem("office");
        const latx = localStorage.getItem("oflat");
        const longx = localStorage.getItem("oflong");
        const db1 = localStorage.getItem("db1");
            const token = localStorage.getItem("token");
      const docno = localStorage.getItem("docno");
        //   const role = localStorage.getItem("role");
        const boss = localStorage.getItem("boss");
        const ceo = localStorage.getItem("ceo");
        const refid = localStorage.getItem("refid");

        let typea = document.querySelector('#typea').value;
        let nte = document.querySelector('#nte').value;
        let todays = new Date();
        todays.toLocaleString('th-TH', { timeZone: 'Asia/Bangkok' })
        let todayx = todays.toLocaleTimeString('th-TH');

        let dt = document.getElementById("daytime").value;
        let dateTime = new Date().toISOString();
        dateTime = dateTime.split(".")[0];
        dateTime = dateTime.slice(0, -8);

        let dtt = dt.substring(dt.length - 5);
        if (dt == dateTime + "08:30" || dt <= dateTime + "11:59") {
            swal.fire({
                position: 'center',
                icon: 'warning',
                confirmButtonColor: '#1450A3',
                confirmButtonText: 'ตกลง',
                html: 'ไม่สามารถลงเวลากลับได้ ในเวลา ' + dtt + ' น.',
            }).then(() => {
                // Reload the page
                location.reload();
            });
        } else {
            if (nte === null || nte === 0 || nte.length < 2) {
                Swal.fire({
                    title: 'ผิดพลาด!',
                    text: 'โปรดระบุเหตุผล หรือคำชี้แจง!',
                    icon: 'error',
                    confirmButtonText: 'ตกลง'
                }).then(() => {
                    // Reload the page
                    location.reload();
                });

                return;
            }
                         // เลือก id "latlong"
             var latlongElement = document.getElementById('latlong');

             // แสดงค่าใน element
             latlongElement.innerHTML = 'พิกัดปัจจุบันของคุณ:<br>ละติจูด: ' + latitude + '<br>ลองจิจูด: ' + longitude + '<br><br>กรุณารอสักครู่ ระบบกำลังประมวลผลข้อมูล...';

       //     console.log(dt);
            let urlout = 'https://script.google.com/macros/s/AKfycbyziNGhQaE2jRgi8LZTDhqOWiWyOV0k9zP9kSK8ontoKM1_oSQZsUSlb9JZP7-cN0UdlA/exec';
            let prmout = `?ctype=Out&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&dt=${dt}&token=${token}&job=${job}&docno=${docno}`;
            await fetch(urlout + prmout)
                .then(response => response.json())
                .then(data => {
                    loadingModal.style.display = 'none';
                    // เพิ่ม option สำหรับแต่ละ subcategory
                    data.res.forEach(datas => {
                        let iconx = datas.icon;
                        let header = datas.header;
                        let text = datas.text;
                         // เพิ่มการตรวจสอบการลงเวลากลับ
                    Swal.fire({
                        confirmButtonColor: '#1e90ff',
                        icon: iconx,
                        title: header,
                        text: text,
                        allowOutsideClick: false
                    }).then((result) => {
                        // ตรวจสอบว่าผู้ใช้กดปุ่มตกลงหรือไม่
                        if (result.isConfirmed) {
                            // กระทำที่ต้องการทำหลังจากกดปุ่มตกลง
                            if (iconx === 'success') {
                                const cktoday = new Date();
                                const ckfd = cktoday.toLocaleDateString('th-TH'); // รูปแบบวันที่แบบไทย
                                const hours = cktoday.getHours().toString().padStart(2, '0');
                                const minutes = cktoday.getMinutes().toString().padStart(2, '0');
                                const seconds = cktoday.getSeconds().toString().padStart(2, '0');
                                const ckfdtime = `${hours}:${minutes}:${seconds}`;
                                localStorage.setItem("datecheckout", ckfd);
                                localStorage.setItem("datetimecheckout", ckfdtime);
                            }
                    
                            try {
                                      if (iconx === "success" && typea === "วันหยุด") {
        sendOffDayReport( "Out", uuid, cidhash, userid, name, mainsub, office, latx, longx, db1,
        boss, ceo, latitude, longitude, typea, nte,  todayx,
        refid, token, job, docno, secureCode, chatId);
      } else {
        window.close();
        liff.closeWindow();
      }
                            } catch (error) {
                                console.error("Failed to close window, refreshing...");
                                location.reload(); // รีเฟรชหน้า
                            }
                    
                            // Use a timeout to refresh the page after trying to close the window
                            setTimeout(() => {
                                location.reload();  // Refresh if liff.closeWindow() does not work
                            }, 500);  // Adjust the delay time as needed (500ms in this case)
                        }
                    });

                    // --- สิ้นสุดการตรวจสอบ

                        // ---
                    });

                })
        }
    }

    // กรณีเกิดข้อผิดพลาดในการรับค่าพิกัด
    function showError(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                alert("ผู้ใช้ปฏิเสธการให้สิทธิ์ในการรับค่าพิกัด");
                break;
            case error.POSITION_UNAVAILABLE:
                alert("ข้อมูลตำแหน่งไม่พร้อมใช้งาน");
                break;
            case error.TIMEOUT:
                alert("การร้องขอค่าพิกัดใช้เวลานานเกินไป");
                break;
            case error.UNKNOWN_ERROR:
                alert("เกิดข้อผิดพลาดที่ไม่รู้จัก");
                break;
        }
    }
           // ฟังก์ชั่นลงเวลา
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การยื่นคำขอถูกยกเลิก', '', 'info');
        }
    });

}


function clearLocal() {
    // เรียกใช้ localStorage.clear() เพื่อลบข้อมูลทั้งหมดใน Local Storage
    Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: 'กด "ตกลง" เพื่อดำเนินการ รีเช็ต เพื่อรับค่าใหม่',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            localStorage.clear();
            Swal.fire({
                confirmButtonColor: '#0ef',
                icon: 'success',
                title: 'รีเซ็ตข้อมูลสำเร็จ'
            }).then((result) => {
                if (result.isConfirmed) {
                    window.location.href = 'login.html';
                }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
        }
    });
}

function openWebAdmin() {
    Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: 'คลิก "ตกลง" เพื่อเข้าสู่ระบบการจัดการการลงเวลาปฏิบัติงาน',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('https://wisanusenhom.github.io/sekatime/', '_blank');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
        }
    });
}


async function checktoday(){
    // Select the element with id "utimeline"
    var utimelineElement = document.getElementById("utimeline");

    // Fetch data from the server (replace 'your_api_endpoint' with the actual API endpoint)
    var gas = 'https://script.google.com/macros/s/AKfycby0bCwNY5tyoVzfb1aM_48Yvs0PInOqUEnb_Aw2Bdyt4t2dBQ-m3FBA4lkMtmgaYHC53w/exec';
    var qdata = `?id=${localStorage.getItem("refid")}&db=${localStorage.getItem("db1")}`;

  await  fetch(gas + qdata)
        .then(response => response.json())
        .then(data => {
            if (data.name) {
                // Assuming the server response has a property named 'cc' and 'intime'
                var timelineData = `วันนี้คุณลงเวลามาแล้ว : การปฏิบัติงาน ${data.intype} \n ลงเวลาเมื่อ ${data.intime}  ระยะ ${data.indistan} ${data.inunit}`; // Assuming you want the first 'intime' value

                // Set the text content of the element with the fetched data
                 utimelineElement.innerText = timelineData;

                const cktoday = new Date();
                const ckfd = cktoday.toLocaleDateString("th-TH"); 
                localStorage.setItem("datecheck", ckfd);
                localStorage.setItem("datetimecheck", data.intime);
                Swal.fire({
                    title: 'พบการลงเวลาในวันนี้',
                    html: `คุณได้ลงเวลาปฏิบัติงานในวันนี้แล้ว <br> หากต้องการยื่นคำขอใหม่ <br> โปรดกด "ดำเนินการ" <br> หรือกด "ปิด" หากไม่ต้องการดำเนินการต่อ`,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: 'ปิด',
                    cancelButtonText: 'ดำเนินการ',
                    confirmButtonColor: "#FF0505", 
                    cancelButtonColor: "#22BB33",
                    allowOutsideClick: false,
                }).then((result) => {
                    if (result.isConfirmed) {
                       window.location.href = 'index.html'; 
                    } else if (result.dismiss === Swal.DismissReason.cancel) {
                        // Swal.fire({
                        //     title: 'การใช้งานได้รับการอนุญาต',
                        //     text: 'คุณสามารถดำเนินการต่อบนอุปกรณ์นี้ได้',
                        //     icon: 'info',
                        //     confirmButtonColor: "#24A1DE",
                        // });
                    }
                });
                
            } else {
                var timelineData = `วันนี้คุณยังไม่ได้ลงเวลามาปฏิบัติงาน`;
                utimelineElement.innerText = timelineData;
              //  console.error('Invalid or empty server response:', data);
           
                // Handle errors or empty responses here
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            // Handle fetch errors here
        });
        // hideLoading();  
}


function openWebToken() {
    Swal.fire({
        title: 'ยืนยันการดำเนินการ',
        text: 'คลิก "ตกลง" เพื่อออกไลน์โทเค็นสำหรับการแจ้งเตือนผ่านไลน์',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก',
    }).then((result) => {
        if (result.isConfirmed) {
            window.open('token.html', '_blank');
        } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
        }
    });
}

function logupdate() {
    Swal.fire({
        title: 'การปรับปรุงล่าสุด',
        html: '<strong>วันที่ 21 ตุลาคม 2567</strong><br>' +
              '1. ยกเลิกการตรวจสอบการลงเวลาที่ระบบหลังบ้านเพื่อเพิ่มความสะดวกในการใช้งาน<br>' +
              '2. เพิ่มฟังก์ชันการตรวจสอบการลงเวลาผ่านระบบหน้าบ้านเพื่อความรวดเร็ว<br>' +
              '3. ตั้งทริกเกอร์ให้ตรวจสอบและลบข้อมูลซ้ำซ้อนในช่วงเวลา 03:00 - 04:00 น.',
        icon: 'info',
        confirmButtonText: 'ยืนยัน',
        showCloseButton: true,
        customClass: {
            title: 'text-success',  // Adding a success color to the title
            content: 'text-dark'  // Darker text for better readability
        }
    });
}




function checkinfo() {
    Swal.fire({
        title: 'การลงเวลา',
        html: 'คุณได้ทำการลงเวลาในการปฏิบัติงานในวันที่ <strong>' + localStorage.getItem("datecheck") + '</strong> เรียบร้อยแล้ว',
        icon: 'info',
        confirmButtonText: 'ยืนยัน',
        showCloseButton: true,
        customClass: {
            title: 'text-primary',  // Adds a primary color to the title
            content: 'text-muted'  // Makes the content a bit more subtle
        }
    });
}

function aboutme() {
  var yourpic = localStorage.getItem("upic");
  Swal.fire({
    imageUrl: yourpic,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: "Custom image",
    title: "ข้อมูลของฉัน",
    html:
      "รหัส : <strong>" +
      localStorage.getItem("refid") +
      "</strong><br>" +
      "ชื่อ : <strong>" +
      localStorage.getItem("name") +
      "</strong><br>" +
      "ตำแหน่ง : <strong>" +
      localStorage.getItem("job") +
      "</strong><br>" +
      "ประเภท : <strong>" +
      localStorage.getItem("rank") +
      "</strong><br>" +
      "หน่วยงาน : <strong>" +
      localStorage.getItem("office") +
      "</strong><br>" +
      "สังกัด : <strong>" +
      localStorage.getItem("mainsub") +
      "</strong><br>",
    icon: "info",
    confirmButtonText: "ตกลง",
    showCloseButton: true,
    confirmButtonColor: "#008000",
    customClass: {
      title: "text-primary", // Adds a primary color to the title
      content: "text-dark", // Makes the content more prominent
    },
    showDenyButton: true,
    denyButtonText: "แก้ไข",
    denyButtonColor: "#007bff",
  }).then((result) => {
    if (result.isDenied) {
      window.location.href = "https://wisanusenhom.github.io/sekatime/setting.html";
    }
  });
}

function editpic() {
    var yourpic = localStorage.getItem("yourpic");
    if (!yourpic || yourpic.trim() === '') {
        // Show a warning message using SweetAlert
        Swal.fire({
            title: 'ไม่พบรูปโปรไฟล์ LINE ของคุณ',
            text: 'ระบบจะลงชื่อออกและนำคุณเข้าสู่ระบบใหม่อีกครั้ง เมื่อคุณกด "ยืนยัน" เพื่อแก้ไขปัญหานี้',
            icon: 'error',
            confirmButtonText: 'ยืนยัน',
            cancelButtonText: 'ยกเลิก',
            showCancelButton: true,
        }).then((result) => {
            if (result.isConfirmed) {
                // เคลียร์ localStorage
                localStorage.clear();
                // รีโหลดหน้าเว็บ
                location.reload();
            }
        });
        
        return; // Exit the function to prevent further execution
    }    
    Swal.fire({
        title: 'ยืนยันการแก้ไข.!',

        imageUrl: yourpic,
        imageWidth: 200,
        imageHeight: 200,
        imageAlt: "Custom image",

        showCancelButton: true,
        confirmButtonColor: '#007bff',
        cancelButtonColor: '#d33',
        confirmButtonText: 'ตกลง',
        cancelButtonText: 'ยกเลิก'
    }).then((result) => {
        if (result.isConfirmed) {

            // Show loading status
            Swal.fire({
                title: 'กำลังปรับปรุงรูปโปรไฟล์...',
                text: 'โปรดรอสักครู่',
                icon: 'info',
                allowOutsideClick: false,
                showConfirmButton: false, // Hide confirm button
                didOpen: () => {
                    Swal.showLoading(); // Show loading spinner
                }
            });

            var urlperson = `https://script.google.com/macros/s/AKfycbyJkVKoVcJV28-1NitWY-WwST5AWHguNDO1aB-l-4ZCCYyNDuBRznMvCbyLxjLi2EJU5Q/exec`;
            var dataperson = `?id=${localStorage.getItem('uuid')}&pic=${yourpic}`;
            fetch(urlperson + dataperson)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    // Show a success message using SweetAlert
                    Swal.fire({
                        title: 'สำเร็จ!',
                        text: 'การแก้ไขข้อมูลเสร็จสิ้น ระบบจะทำการรีเซ็ตอัตโนมัติ',
                        icon: 'success'
                    }).then(() => {
                        localStorage.clear();
                        location.reload();
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



function checkMap() {
    // ตรวจสอบว่าเบราว์เซอร์รองรับ Geolocation หรือไม่
    if (navigator.geolocation) {
        // แสดงสถานะกำลังประมวลผล
        Swal.fire({
            title: 'กำลังประมวลผล...',
            text: 'กำลังตรวจสอบตำแหน่งของคุณ กรุณารอสักครู่',
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
                Swal.showLoading();
            }
        });

        // ขอค่าพิกัด
        navigator.geolocation.getCurrentPosition(showPosition, handleError);
    } else {
        alert("เบราว์เซอร์ไม่รองรับ Geolocation");
    }
}

// เมื่อได้รับค่าพิกัด
async function showPosition(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    const destination = `${localStorage.getItem("oflat")},${localStorage.getItem("oflong")}`;
    const googleMapUrl = `https://www.google.co.th/maps/dir/${destination}/${latitude},${longitude}`;

    // ปิดสถานะกำลังประมวลผลเมื่อได้รับข้อมูล
    Swal.close();

    // แสดงโมดัลเพื่อยืนยันการเปิด Google Maps
    Swal.fire({
        title: 'เปิด Google Maps หรือไม่?',
        text: 'คุณต้องการเปิด Google Maps เพื่อดูระยะห่างระหว่างหน่วยงานกับตำแหน่งปัจจุบันของคุณหรือไม่?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonText: 'ใช่',
        cancelButtonText: 'ไม่'
    }).then((result) => {
        if (result.isConfirmed) {
            // Open the Google Maps link if the user confirms
            window.open(googleMapUrl, '_blank');
        }
    });
}

// ฟังก์ชันจัดการข้อผิดพลาด
function handleError(error) {
    Swal.close(); // ปิดสถานะกำลังประมวลผลในกรณีเกิดข้อผิดพลาด
    switch (error.code) {
        case error.PERMISSION_DENIED:
            Swal.fire({
                title: 'การเข้าถึงถูกปฏิเสธ',
                text: 'ผู้ใช้ปฏิเสธการเข้าถึงตำแหน่งของคุณ',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            break;
        case error.POSITION_UNAVAILABLE:
            Swal.fire({
                title: 'ตำแหน่งไม่พร้อมใช้งาน',
                text: 'ไม่สามารถรับตำแหน่งได้',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            break;
        case error.TIMEOUT:
            Swal.fire({
                title: 'หมดเวลา',
                text: 'การขอข้อมูลใช้เวลานานเกินไป',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            break;
        case error.UNKNOWN_ERROR:
            Swal.fire({
                title: 'ข้อผิดพลาดที่ไม่รู้จัก',
                text: 'เกิดข้อผิดพลาดที่ไม่รู้จัก',
                icon: 'error',
                confirmButtonText: 'ตกลง'
            });
            break;
    }
}

// ยกเลิกการลงเวลาวันนี้
async function canceltoday() {
    const { value: accept } = await Swal.fire({
        title: "หากยกเลิกข้อมูลแล้วไม่สามารถเรียกคืนข้อมูลได้",
        input: "checkbox",
        showCancelButton: true,
        inputValue: 0,
        inputPlaceholder: `ข้าพเจ้ายอมรับและดำเนินการ ยกเลิกการลงเวลาปฏิบัติงานในวันนี้`,
        confirmButtonText: `Continue&nbsp;<i class="fa fa-arrow-right"></i>`,
        inputValidator: (result) => {
            return !result && "กรุณา ติ๊ก ยอมรับหากต้องการดำเนินการ";
        },
    });

    if (accept) {
        // Function to handle CAPTCHA verification
        const handleCaptchaVerification = async () => {
            generateCaptcha();
            let captchaResult;

            do {
                captchaResult = await Swal.fire({
                    title: `กรอกรหัสยืนยัน ในการยกเลิกการลงเวลาท่านของ`,
                    showCancelButton: true,
                    confirmButtonText: `ยืนยัน&nbsp;<i class="fa-solid fa-trash"></i>`,
                    html: `<canvas id="captchaPopupCanvas" width="200" height="50"></canvas><br>
                            <input type="text" id="captchaInput" class="swal2-input" placeholder="Enter the code here">`,
                    didOpen: () => {
                        drawCaptcha("captchaPopupCanvas");
                    },
                    preConfirm: () => {
                        const userInput = document.getElementById("captchaInput").value.toUpperCase();
                        if (!userInput) {
                            Swal.showValidationMessage("กรุณากรอกรหัสยืนยัน");
                            return false;
                        } else if (userInput !== captchaText) {
                            Swal.showValidationMessage("รหัสยืนยันไม่ถูกต้อง กรุณาลองอีกครั้ง");
                            generateCaptcha(); // Generate a new captcha if incorrect
                            drawCaptcha("captchaPopupCanvas");
                            return false;
                        }
                        return userInput;
                    },
                    showDenyButton: true,
                    denyButtonText: `ขอรหัสใหม่`,
                    denyButtonColor: "#039be5"
                });

                // Check if user requested a new CAPTCHA
                if (captchaResult.isDenied) {
                    generateCaptcha();
                }
            } while (!captchaResult.isConfirmed); // Repeat if CAPTCHA is not confirmed

            return captchaResult;
        };

        const captchaResult = await handleCaptchaVerification();

        if (captchaResult.isConfirmed && captchaResult.value === captchaText) {
            // Show loading status
            Swal.fire({
                title: 'กำลังดำเนินการ...',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            const gasUrl = 'https://script.google.com/macros/s/AKfycbyq0lc6EUpmCWS5LB30Yv2M7exyHR6IEf7PeerHLPApFtIPQiRCep9XtDSX4yHAjYvB-w/exec';
            const qdata = `?refid=${localStorage.getItem("refid")}&db1=${localStorage.getItem("db1")}&name=${localStorage.getItem("name")}&token=${localStorage.getItem("token")}&userid=${localStorage.getItem("userid")}`;

            try {
                const response = await fetch(gasUrl + qdata);

                // ตรวจสอบสถานะ HTTP ก่อนแปลงเป็น JSON
                if (!response.ok) {
                    const errorResponse = await response.json(); // ดึง JSON ที่ตอบกลับ
                    console.error('Error fetching data:', errorResponse);
                    
                    // แสดงข้อความผิดพลาดจากการตอบกลับ
                    Swal.fire({
                        icon: 'error',
                        title: 'ข้อผิดพลาด',
                        text: errorResponse.message || 'ไม่สามารถติดต่อเซิร์ฟเวอร์ได้',
                        confirmButtonText: 'ตกลง',
                        showCloseButton: true,
                        customClass: {
                            title: 'text-error',
                            content: 'text-muted'
                        }
                    });
                    return; // หยุดการทำงานเมื่อเกิดข้อผิดพลาด
                }

                const data = await response.json();
          
                Swal.close(); // Close loading

                const status = data.status; 
                const message = data.message;

                if (status === 'success') {
                    Swal.fire({
                        icon: 'success',
                        title: 'สำเร็จ! ยกเลิกลงเวลาในวันนี้แล้ว',
                        text: message,
                        confirmButtonText: 'ตกลง',
                        showCloseButton: true,
                        allowOutsideClick: false,
                        customClass: {
                            title: 'text-success',
                            content: 'text-muted'
                        }
                    }).then((result) => {
                        if (result.isConfirmed) {
                            localStorage.setItem("datecheckout", "");
                            localStorage.setItem("datecheck", "");
                            try {
                                liff.closeWindow();
                            } catch (error) {
                                console.error("Failed to close window, refreshing...");
                                // ใช้ timeout เพื่อหน่วงเวลารีเฟรชหน้าเว็บ
                                setTimeout(() => {
                                    location.reload();  // รีเฟรชหน้าเว็บหาก liff.closeWindow() ไม่ทำงาน
                                }, 500);  // หน่วงเวลา 500 มิลลิวินาที (ปรับได้ตามต้องการ)
                            }
                        }
                    });
                } else if (status === 'warning') {
                    Swal.fire({
                        icon: 'warning',
                        title: 'การดำเนินการยกเลิกลงเวลาในวันนี้',
                        text: message,
                        confirmButtonText: 'ตกลง',
                        showCloseButton: true,
                        customClass: {
                            title: 'text-error',
                            content: 'text-muted'
                        }
                    });
                } else if (status === 'error') {
                    Swal.fire({
                        icon: 'error',
                        title: 'ผิดพลาด',
                        text: message,
                        confirmButtonText: 'ตกลง',
                        showCloseButton: true,
                        customClass: {
                            title: 'text-error',
                            content: 'text-muted'
                        }
                    });
                }
            } catch (error) {
                Swal.close();
                console.error('Error fetching data:', error);
                Swal.fire({
                    icon: 'error',
                    title: 'ข้อผิดพลาด',
                    text: 'ไม่สามารถยกเลิกการลงเวลาในวันนี้ได้ กรุณาลองใหม่อีกครั้ง',
                    confirmButtonText: 'ตกลง',
                    showCloseButton: true,
                    customClass: {
                        title: 'text-error',
                        content: 'text-muted'
                    }
                });
            }
        }
    }
}


// Captcha

let captchaText = "";

function getRandomColor() {
  const letters = "0123456789ABCDEF";
  let color = "#";
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function generateCaptcha() {
  captchaText = Math.random().toString(36).substring(2, 8).toUpperCase();
}

function drawCaptcha(canvasId) {
  const canvas = document.getElementById(canvasId);
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.font = "30px Arial";
  for (let i = 0; i < captchaText.length; i++) {
    ctx.fillStyle = getRandomColor();
    ctx.fillText(captchaText[i], 30 * i + 10, 35);
  }
}





// รับอ้างอิงถึง Collapsible menu
var collapsibleMenu = document.getElementById('collapsibleNavbar');
var menuButton = document.querySelector('.navbar-toggler');

// ฟังก์ชันซ่อนเมนู
function hideMenu() {
    $(collapsibleMenu).collapse('hide');
}

// ซ่อนเมนูเมื่อคลิกนอกเมนู
window.onclick = function(event) {
    if (!menuButton.contains(event.target) && !collapsibleMenu.contains(event.target)) {
        hideMenu();
    }
};

// ตั้งค่าตัวจับเวลาซ่อนเมนูหลังจาก 10 วินาที
var menuTimeout;
function resetMenuTimeout() {
    clearTimeout(menuTimeout);
    menuTimeout = setTimeout(hideMenu, 10000); // ซ่อนเมนูหลัง 10 วินาที
}

// รีเซ็ตตัวจับเวลาเมื่อมีการคลิกที่ปุ่มหรือตัวเมนู
menuButton.onclick = function() {
    resetMenuTimeout(); // รีเซ็ตตัวจับเวลาเมื่อคลิกปุ่ม
};

collapsibleMenu.onclick = function() {
    resetMenuTimeout(); // รีเซ็ตตัวจับเวลาเมื่อมีการคลิกที่เมนู
};


async function generateSecureCode() {
  const date = new Date();
  const data = `${date.getFullYear()}${date.getMonth() + 1}${date.getDate()}`;
  const secretKey = "Impermanent_Suffering_Egolessness";

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secretKey),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  const code = Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return code;
}


// เรียกใช้เมื่อโหลดหน้าเว็บเพื่อเช็ค retry
function checkRetryParams() {
  const retryParams = localStorage.getItem("pendingRetryParams");
  if (!retryParams) return;

  const params = new URLSearchParams(retryParams);
  const ctype = params.get("ctype");
  const lat   = params.get("lat");
  const long  = params.get("long");
  const nte   = params.get("nte");
  const typea = params.get("typea");
  const stampx = params.get("stampx");

  // ตรวจสอบว่า stampx เป็นวันเดียวกับวันนี้หรือไม่
  const now = new Date();
  const bangkokTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));

  const year = bangkokTime.getFullYear();
  const month = String(bangkokTime.getMonth() + 1).padStart(2, "0");
  const date = String(bangkokTime.getDate()).padStart(2, "0");

  // ดึงเฉพาะส่วนวันที่จาก stampx สมมติว่า format เป็น "YYYY/MM/DD HH:mm:ss"
  const stampDatePart = stampx ? stampx.split(" ")[0] : "";

  const todayDateString = `${year}/${month}/${date}`;

  // ถ้า stampx ไม่ใช่วันเดียวกับวันนี้ ให้เคลียร์ข้อมูล retry
  if (stampDatePart !== todayDateString) {
    localStorage.removeItem("pendingRetryParams");
    localStorage.removeItem("checkRetryCount");
    return;
  }

  const ctypeLabel = ctype === "In"
    ? "มา"
    : ctype === "Out"
      ? "กลับ"
      : ctype || "-";

  Swal.close();
  Swal.fire({
    icon: "info",
    title: "พบข้อมูลที่ส่งไม่สำเร็จ",
    html: `การลงเวลา: <b>${ctypeLabel}</b><br>
    ประเภท: <b>${typea}</b><br>
    วันเวลา: <b>${stampx}</b><br>
    ต้องการดำเนินการส่งข้อมูลเดิมหรือไม่?`,
    showCancelButton: true,
    confirmButtonText: "ดำเนินการ",
    cancelButtonText: "ภายหลัง",
    allowOutsideClick: false,
    confirmButtonColor: "#0277bd",
  }).then((result) => {
    if (result.isConfirmed) {
      let retryCheckCount = parseInt(localStorage.getItem("checkRetryCount") || "0", 10);
      retryCheckCount += 1;
      localStorage.setItem("checkRetryCount", retryCheckCount.toString());

      if (retryCheckCount > 1) {
        Swal.fire({
          icon: "warning",
          title: "ขออภัยในความไม่สะดวกในการใช้งาน",
          html: `ระบบพยายามส่งข้อมูลซ้ำเป็นจำนวน ${retryCheckCount} ครั้ง<br>
         เนื่องจากระบบทำงานช้า<br>
         ภายในวันนี้ท่านสามารถดำเนินการส่งข้อมูลในเวลาใดก็ได้<br>(หากลงเวลามาให้ดำเนินการก่อนลงเวลากลับ)<br>
         ระบบได้จำค่าเวลาที่ท่านลงเวลาก่อนหน้านี้ไว้เรียบร้อยแล้ว`,
          confirmButtonText: "ดำเนินการ",
          cancelButtonText: "ภายหลัง",
          showCancelButton: true,
          allowOutsideClick: false,
        }).then((result) => {
          if (result.isConfirmed) {
            processCheckinOrCheckout(ctype, lat, long, nte, true, retryCheckCount);
          } else {
            retryCheckCount = Math.max(0, retryCheckCount - 1);
            localStorage.setItem("checkRetryCount", retryCheckCount.toString());
          }
        });
      } else {
        processCheckinOrCheckout(ctype, lat, long, nte, true, retryCheckCount);
      }
    }
  });
}


async function processCheckinOrCheckout(ctype, latitude, longitude, staff, isRetry = false, retryCount = 1) {
  let swalTimers = []; // เก็บ setTimeout

  try {
    const uuid = localStorage.getItem("uuid");
    const cidhash = localStorage.getItem("cidhash");
    const userid = localStorage.getItem("userid");
    const name = localStorage.getItem("name");
    const mainsub = localStorage.getItem("mainsub");
    const office = localStorage.getItem("office");
    const latx = localStorage.getItem("oflat");
    const longx = localStorage.getItem("oflong");
    const db1 = localStorage.getItem("db1");
    const token = localStorage.getItem("token");
    const docno = localStorage.getItem("docno");
    const job = localStorage.getItem("job");
    const boss = localStorage.getItem("boss");
    const ceo = localStorage.getItem("ceo");
    const refid = localStorage.getItem("refid");
    const chatId = localStorage.getItem("chatId");

    if (!refid || !cidhash || !userid || !name) {
      throw new Error("ไม่พบข้อมูลที่จำเป็นในการลงเวลา กรุณาลองใหม่หรือลงชื่อออกแล้วเข้าสู่ระบบใหม่");
    }

    const secureCode = await generateSecureCode();
    let typea = document.querySelector("#typea")?.value || "ปกติ";
    let nte = document.querySelector("#otherDetails")?.value || (typeof staff !== "undefined" ? staff : "");

    if (typea === "อื่นๆ" && !nte) {
      throw new Error("อื่นๆ โปรดระบุ");
    }

    const now = new Date();
    const bangkokTime = new Date(now.toLocaleString("en-US", { timeZone: "Asia/Bangkok" }));
    
    const year = bangkokTime.getFullYear();
    const month = String(bangkokTime.getMonth() + 1).padStart(2, "0");
    const date = String(bangkokTime.getDate()).padStart(2, "0");
    const hours = String(bangkokTime.getHours()).padStart(2, "0");
    const minutes = String(bangkokTime.getMinutes()).padStart(2, "0");
    const seconds = String(bangkokTime.getSeconds()).padStart(2, "0");
    

    const todayx = `${year}/${month}/${date} ${hours}:${minutes}:${seconds}`;

    let params;
    if (isRetry) {
      const retryString = localStorage.getItem("pendingRetryParams");
      if (!retryString) throw new Error("ไม่พบข้อมูล Retry ที่เก็บไว้");
      params = new URLSearchParams(retryString);
    } else {
      params = new URLSearchParams({
        ctype, uuid, cidhash, userid, name, mainsub, office, latx, longx, db1,
        boss, ceo, lat: latitude, long: longitude, typea, nte, stampx: todayx,
        refid, token, job, docno, secureCode, chatId
      });
    }
    

    // เลือก URL
    let url;

    if (isRetry) {
      switch (db1) {
        case "bkn01":
          url = "https://script.google.com/macros/s/AKfycbyTnF-_JBeih89p5L4h8tj4DY0VM4LymcI6HrM5h5rDdCt6WJ-YiAjXT9ui7ip35P4V7Q/exec";
          break;
        case "sk01":
          url = "https://script.google.com/macros/s/AKfycbzBbkwKk3YKH4zYERvnMUp2GxGCJ9XRVUBv38yFQ9U6l0HtRbLjczYER9XV4c1de5czHA/exec";
          break;
        default:
          url = "https://script.google.com/macros/s/AKfycbzIjG5vSo3eI6pt8B6Y97ZhmlmJ8FWjRFYE5PUEZ83Fs73nnqoc3TiaZlYXAUKhNjea/exec";
      }
    } else {
      switch (db1) {
        case "bkn01":
          url = "https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec";
          break;
        case "sk01":
          url = "https://script.google.com/macros/s/AKfycbwUVnQTg9Zfk-wf9sZ4u21CvI3ozfrp3hoM0Dhs6J5a3YDEQQ8vkaz61I-mTmfBtXWuLA/exec";
          break;
        default:
          url = "https://script.google.com/macros/s/AKfycbwBXn6VhbTiN2eOvwZudXXd1ngEu3ONwAAVSnNG1VsXthQqBGENRloS6zU_34SqRLsH/exec";
      }
    }
    

    const fetchUrl = `${url}?${params.toString()}`;

    // เริ่ม Swal แสดงข้อความระหว่างรอ
    Swal.fire({
      html: `<i class="fas fa-user-shield fa-2x text-primary mb-2"></i><br>กำลังยืนยันตัวตนของคุณ`,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();

        // เพิ่มข้อความขั้นตอนแบบต่อเนื่อง
        swalTimers.push(
          setTimeout(() => {
            Swal.update({
              html: `<i class="fas fa-server fa-2x text-secondary mb-2"></i><br>กำลังเชื่อมต่อกับเซิร์ฟเวอร์`,
            });
            Swal.showLoading();

            swalTimers.push(
              setTimeout(() => {
                Swal.update({
                  html: `<i class="fas fa-network-wired fa-2x text-warning mb-2"></i><br>ขณะนี้ระบบทำงานช้า<br>(ระบบกำลังสลับไปยังเซิร์ฟเวอร์สำรอง)`,
                });
                Swal.showLoading();

                swalTimers.push(
                  setTimeout(() => {
                    Swal.update({
                      html: `<i class="fas fa-database fa-2x text-success mb-2"></i><br>กำลังบันทึกข้อมูล...`,
                    });
                    Swal.showLoading();

                    swalTimers.push(
                      setTimeout(() => {
                        Swal.update({
                          html: `<i class="fas fa-reply fa-2x text-info mb-2"></i><br>ระบบกำลังตอบกลับจากเซิร์ฟเวอร์`,
                        });
                        Swal.showLoading();

                        swalTimers.push(
                          setTimeout(() => {
                            Swal.update({
                              html: `<i class="fas fa-hourglass-half fa-2x text-warning mb-2"></i><br>ดำเนินการใกล้เสร็จสิ้น<br>กรุณารอสักครู่`,
                            });
                            Swal.showLoading();
                          }, 3000)
                        );
                      }, 3000)
                    );
                  }, 3000)
                );
              }, 5000)
            );
          }, 2000)
        );
      },
    });

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 40000 * retryCount);

    let response;
    try {
      response = await fetch(fetchUrl, { signal: controller.signal });
    } catch (error) {
      if (error.name === "AbortError") {
        localStorage.setItem("pendingRetryParams", params.toString());
        throw new Error("การเชื่อมต่อนานเกินไป กรุณาลองใหม่ภายหลัง");
      } else {
        throw error;
      }
    } finally {
      clearTimeout(timeout);
    }

    if (!response.ok) {
      throw new Error(`Failed to process: ${response.statusText}`);
    }

    const data = await response.json();
    swalTimers.forEach((t) => clearTimeout(t));
      swalTimers = [];
      Swal.close();

    data.res.forEach((datas) => {
     
      let iconx = datas.icon;
            let header = datas.header;
            let text = datas.text;
            let timeOnly = datas.timeOnly;
      
            Swal.fire({
              icon: iconx || "success", // ใช้ icon ที่ได้รับจาก API ถ้ามี หรือใช้ "success" เป็นค่าเริ่มต้น
              title: header,
              html: data.message || text,
              confirmButtonText: "ตกลง",
              allowOutsideClick: false,
              customClass: {
                title:
                  iconx === "success"
                    ? "text-success"
                    : iconx === "error"
                    ? "text-danger"
                    : iconx === "warning"
                    ? "text-warning"
                    : "text-info",
                content: "text-muted",
                confirmButton:
                  iconx === "success"
                    ? "btn btn-success"
                    : iconx === "error"
                    ? "btn btn-danger"
                    : iconx === "warning"
                    ? "btn btn-warning"
                    : "btn btn-info",
              },
            }).then((result) => {
              if (result.isConfirmed) {
                const cktoday = new Date();
                const ckfd = cktoday.toLocaleDateString("th-TH");
      
                if (iconx === "success" && ctype === "In") {
                  localStorage.setItem("datecheck", ckfd);
                  localStorage.setItem("datetimecheck", timeOnly);
                  localStorage.removeItem("pendingRetryParams");
                  localStorage.removeItem("checkRetryCount");
                } else if (
                  (iconx === "info" && ctype === "Out") ||
                  (iconx === "success" && ctype === "Out") ||
                  (iconx === "warning" && ctype === "Out")
                ) {
                  localStorage.setItem("datecheck", ckfd);
                  localStorage.setItem("datecheckout", ckfd);
                  localStorage.setItem("datetimecheckout", timeOnlye);
                  localStorage.removeItem("pendingRetryParams");
                  localStorage.removeItem("checkRetryCount");
                }

          try {
            window.close();
            liff.closeWindow();
          } catch {
            window.location.reload();
          }

          setTimeout(() => {
            location.reload();
          }, 500);
        }
      });
    });
  } catch (error) {
    swalTimers.forEach((t) => clearTimeout(t));
    swalTimers = [];
    Swal.close();
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: error.message || error,
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        window.location.reload(); // เพิ่มตรงนี้
      }
    });
  }
}



// ==================== ฟังก์ชันส่งรายงานปฏิบัติงานในวันหยุด ====================

// ===================== CONFIG =====================
const PAYLOAD_KEY = "offDayPayloads";        // payload ค้างก่อนส่ง
const SUCCESS_KEY = "offDaySuccessLogs";    // payload ส่งสำเร็จ
const GAS_URL =
  "https://script.google.com/macros/s/AKfycbxhtJ_nYOJzZ3jVkH8uwzzS2f-BP7MneE9xOOG8Ds7Nifst4UhmuECI26iIVN4DarzE/exec";

let offDayTable = null;


// ===================== LOCAL STORAGE UTILS =====================
function getArray(key) {
  return JSON.parse(localStorage.getItem(key)) || [];
}

function setArray(key, arr) {
  localStorage.setItem(key, JSON.stringify(arr));
}

function addToArray(key, obj) {
  const arr = getArray(key);
  arr.push(obj);
  setArray(key, arr);
}

function clearArray(key) {
  localStorage.removeItem(key);
}

function formatOtTime(date) {
    if (!date || isNaN(date)) return "-";
    return date.toLocaleTimeString("th-TH", {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
    });
}


// อ้างอิง
function generateReferenceH(dateObj = today,  ctype) {
    const refid = localStorage.getItem("refid") || "NOID";

    const yyyy = dateObj.getFullYear();
    const mm = String(dateObj.getMonth() + 1).padStart(2, "0");
    const dd = String(dateObj.getDate()).padStart(2, "0");
  // const hh = String(dateObj.getHours()).padStart(2, "0");
   // const mi = String(dateObj.getMinutes()).padStart(2, "0");

    // รูปแบบ: Holiday-20251229-123456
    return `Holiday-${ctype}-${yyyy}${mm}${dd}-${refid}`;
}

// ตรวจสอบการซ้ำของอ้างอิง
function isDuplicateOT(reference) {
    const usedRefs = JSON.parse(localStorage.getItem("otReferences") || "[]");
    return usedRefs.includes(reference);
}

// บันทึกอ้างอิง
function saveReference(reference) {
    const usedRefs = JSON.parse(localStorage.getItem("otReferences") || "[]");
    usedRefs.push(reference);
    localStorage.setItem("otReferences", JSON.stringify(usedRefs));
}

// ===================== SAVE SUCCESS LOG =====================
function saveSuccessLog(payload) {
  addToArray(SUCCESS_KEY, {
    date: payload.todayx || "",
    name: payload.name || "",
    office: payload.office || "",
    type: payload.typea || "",
    note: payload.nte || "",
    ref: payload.reference || "",
    savedAt: new Date().toISOString()
  });
}


// ===================== SEND OFF DAY REPORT =====================
function sendOffDayReport(
  ctype, uuid, cidhash, userid, name, mainsub, office, latx, longx, db1,
  boss, ceo, latitude, longitude, typea, nte, todayx,
  refid, job, chatId
) {

  const payload = {
    ctype, uuid, cidhash, userid, name, mainsub, office, latx, longx, db1,
    boss, ceo, latitude, longitude, typea, nte, todayx,
    refid, job, chatId,
    _savedAt: new Date().toISOString()
  };

  // เก็บ payload ค้าง (array)
  addToArray(PAYLOAD_KEY, payload);

  Swal.fire({
    title: "คุณต้องการส่งรายงานปฏิบัติงานในวันหยุดหรือไม่?",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ส่งรายงาน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false
  }).then((res) => {
    if (!res.isConfirmed) return;

    Swal.fire({
      title: "กำลังส่งรายงาน...",
      html: "กรุณารอสักครู่",
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
        const lastPayload = getArray(PAYLOAD_KEY).slice(-1)[0];
        saveOffDayToGAS(lastPayload);
      }
    });
  });
}


// ===================== SEND TO GAS =====================
async function saveOffDayToGAS(payload) {

  // ================== Validate payload ==================
  if (!payload || typeof payload !== "object") {
    Swal.fire("ไม่พบข้อมูล", "payload ว่าง", "warning");
    return;
  }

  if (!payload.name) {
    Swal.fire("ไม่พบข้อมูล", "ไม่พบข้อมูล", "warning");
    return;
  }

  if (!payload.todayx) {
    Swal.fire("ไม่พบข้อมูล", "ไม่พบข้อมูล", "warning");
    return;
  }

  // แปลง todayx ให้เป็น Date เสมอ
  const today = payload.todayx instanceof Date
    ? payload.todayx
    : new Date(payload.todayx);

  if (isNaN(today.getTime())) {
    Swal.fire("ข้อมูลไม่ถูกต้อง", "รูปแบบวันที่ไม่ถูกต้อง", "error");
    return;
  }

  // ================== Prepare date/time ==================
  const date = today.toISOString().slice(0, 10);
  const timeStr = payload.ctype === "In" ? formatOtTime(today) : "";
  const timeEnd = payload.ctype !== "In" ? formatOtTime(today) : "";

  // ================== Generate reference ==================
  const ref = generateReferenceH(today, payload.ctype);

  if (isDuplicateOT(ref)) {
    // resetOTState();
    Swal.fire("แจ้งเตือน", "มีการลงเวลานอกเวลาในวันหยุดซ้ำแล้ว", "warning");
    return;
  }

  saveReference(ref);

  // ================== เติมข้อมูลจาก localStorage ==================
  payload.userName    = localStorage.getItem("name") || "unknown";
  payload.userJob     = localStorage.getItem("job") || "";
  payload.userID      = localStorage.getItem("refid") || "";
  payload.userBoss    = localStorage.getItem("boss") || "";
  payload.otstaffName = localStorage.getItem("otStaffName") || "-";
  payload.otapprover  = localStorage.getItem("otApproverName") || "-";
  payload.otpayer     = localStorage.getItem("otPayerName") || "-";
  payload.otbank      = localStorage.getItem("otbank") || "-";
  payload.otRateDay   = localStorage.getItem("otRateDay") || "";
  payload.reference   = ref;
  payload.date        = date;
  payload.timeStr     = timeStr;
  payload.timeEnd     = timeEnd;

  // ================== ตรวจอัตรา OT ==================
  if (!payload.otRateDay) {
    Swal.fire({
      title: "กรุณากำหนดอัตราค่าตอบแทน",
      icon: "warning",
      confirmButtonText: "ตกลง"
    }).then(() => {
      new bootstrap.Modal(
        document.getElementById("otConfigModal")
      ).show();
    });
    return;
  }

  // ================== ส่งข้อมูล ==================
  try {
    Swal.fire({
      title: "กำลังส่งข้อมูล",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    await fetch(GAS_URL, {
      method: "POST",
      mode: "no-cors",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    saveSuccessLog(payload);
    clearArray(PAYLOAD_KEY);

    Swal.fire({
      icon: "success",
      title: "ส่งข้อมูลสำเร็จ",
      timer: 1500,
      showConfirmButton: false,
      didClose: () => location.reload()
    });

  } catch (err) {
    console.error(err);
    Swal.fire("เกิดข้อผิดพลาด", err.message || "ไม่สามารถส่งข้อมูลได้", "error");
  }
}






function backtoindex() {
  Swal.fire({
    title: "ยืนยันการออก",
    text: "คุณต้องการปิดและกลับหน้าหลักใช่หรือไม่?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "ใช่",
    cancelButtonText: "ยกเลิก"
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "index.html";
    }
  });
}
