document.addEventListener("DOMContentLoaded", () => {

    const uuid = localStorage.getItem("uuid");

    if (!uuid) {
        window.location.href = "../login.html";
        return;
    }

    setDefaultDate();

});

function setDefaultDate(){

    const now = new Date();

    const month = String(now.getMonth()+1).padStart(2,"0");
    const year  = now.getFullYear();

    document.getElementById("monthSelect").value = month;

    const yearSelect = document.getElementById("yearSelect");

    yearSelect.innerHTML = "";

    const years = [year, year-1];

    years.forEach(y=>{

        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;

        yearSelect.appendChild(opt);

    });

    yearSelect.value = year;

}

async function loadapitoilet(btn) {

    if(btn && btn.dataset.loading === "1") return;
    if(btn) btn.dataset.loading = "1";

    let timerInterval;
    let startTime;

    Swal.fire({
        title: "กำลังดาวน์โหลด...",
        html: 'เวลา <b>0</b> วินาที',
        allowOutsideClick:false,
        showConfirmButton:false,
        didOpen: () => {

            Swal.showLoading();

            const timer = Swal.getHtmlContainer().querySelector("b");
            startTime = Date.now();

            timerInterval = setInterval(() => {

                const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
                timer.textContent = elapsedTime;

            },200);

        },
        willClose: () => {
            clearInterval(timerInterval);
        }
    });

    try {

        const month = document.getElementById("monthSelect").value;
        const year  = document.getElementById("yearSelect").value;

        const office = localStorage.getItem("office");
        const mainsub = localStorage.getItem("mainsub");

        console.log("เดือน:",month);
        console.log("ปี:",year);

        const params = new URLSearchParams({

            office: office,
            dept: mainsub,
            month: month,
            year: year

        });

        const xurl = `https://script.google.com/macros/s/AKfycbwkpPjJYEK3nfKxMhrIbnHDRp7nRs3wq3DgttRJEYg2O2bPWFUK6vHl8f3M5A9v9G2_/exec?${params}`;

        console.log("API:",xurl);

        const records = await fetch(xurl,{
            method:"GET",
            cache:"no-store"
        });

        const data = await records.json();

        console.log(data);

        $('#userTable').DataTable({

            destroy:true,

            data:data.user,

            columns:[

                {data:'date'},
                {data:'office'},
                {data:'room'},
                {data:'range'},
                {data:'score'},
                {data:'floor'},
                {data:'wall'},
                {data:'toilet'},
                {data:'water'},
                {data:'tap'},
                {data:'mirror'},
                {data:'bin'},
                {data:'soap'},
                {data:'towel'},
                {data:'details'},
                {data:'name'},
                {data:'dupdate'},
                {data:'ref'}

            ],

            processing:true,
            responsive:true,

            order:[[17,'asc'],[3,'asc']],

            dom:'lBfrtip',

            lengthMenu:[
                [10,30,70,100,150,200,-1],
                [10,30,70,100,150,200,"ทั้งหมด"]
            ],

            buttons:[
                'excel',
                'print'
            ],

            pageLength:30,

            language:{
                url:'https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json'
            }

        });

        Swal.close();

        Swal.fire({
            icon:"success",
            title:"ดาวน์โหลดสำเร็จ",
            timer:2000,
            showConfirmButton:false
        });

    }catch(err){

        Swal.close();

        Swal.fire({
            icon:"error",
            title:"โหลดข้อมูลไม่สำเร็จ",
            text:err.message
        });

        console.error(err);

    }finally{

        if(btn) btn.dataset.loading = "0";

    }

}

function openWeb() {
  Swal.fire({
      title: 'ยืนยันการดำเนินการ',
      text: 'คลิก "ตกลง" เพื่อเปิดหน้าบันทึกข้อมูล',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
  }).then((result) => {
      if (result.isConfirmed) {
          window.open('toilet.html', '_blank');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
      }
  });
}

// ห้องน้ำ
function opendash() {
  Swal.fire({
      title: 'ยืนยันการดำเนินการ',
      text: 'คลิก "ตกลง" เพื่อเปิดหน้าแสดงข้อมูล',
      icon: 'question',
      showCancelButton: true,
      confirmButtonText: 'ตกลง',
      cancelButtonText: 'ยกเลิก',
  }).then((result) => {
      if (result.isConfirmed) {
          window.open('https://lookerstudio.google.com/reporting/4bb9eb62-ea62-414a-ac54-361840e6b4a1', '_blank');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
      }
  });
}
