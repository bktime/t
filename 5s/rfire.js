document.addEventListener("DOMContentLoaded", () => {
    const uuid = localStorage.getItem("uuid");
    if (!uuid) {
        // ถ้าไม่มี uuid ให้ login
        window.location.href = "../login.html";
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

async function loadFireData(btn){

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

    try{

        const month = document.getElementById("monthSelect").value;
        const year  = document.getElementById("yearSelect").value;

        const office = localStorage.getItem("office");

        const params = new URLSearchParams({
            office:office,
            month:month,
            year:year
        });

        const api =
        "https://script.google.com/macros/s/AKfycbxf9hYBxF4l_CBuKUg8qEyFlCq0rVi6Z-2s0b4O6rg0wipMamMF7kOIA-NjvQ5HIUs31Q/exec?"
        + params;

        console.log("API:",api);

        const response = await fetch(api,{
            method:"GET",
            cache:"no-store"
        });

        const data = await response.json();

        console.log(data);

        $('#fireTable').DataTable({

            destroy:true,
            data:data.user,

            columns:[
                {data:'date'},
                {data:'fireciful'},
                {data:'spray'},
                {data:'force'},
                {data:'body'},
                {data:'pressure'},
                {data:'obstacle'},
                {data:'details'},
                {data:'name'},
                {data:'score'},
                {data:'dupdate'}
            ],

            processing:true,
            responsive:true,

            order:[[10,'desc']],

            dom:'lBfrtip',

            lengthMenu:[
                [10,30,70,100,-1],
                [10,30,70,100,"ทั้งหมด"]
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

        console.error(err);
        alert("โหลดข้อมูลไม่สำเร็จ");

    }finally{

        if(btn) btn.dataset.loading = "0";

    }

}

function loadAPI() {
    // ให้เรียกใช้ API ที่นี่
    // เมื่อโหลดเสร็จแล้วให้ปิด Swal.fire
    Swal.fire({
        icon: "success",
        title: "ดาวน์โหลดสำเร็จ",
        showConfirmButton: false,
        timer: 3000
      });
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
          window.open('fire.html', '_blank');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
      }
  });
}

// ดับเพลิง
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
          window.open('https://lookerstudio.google.com/reporting/59437449-657d-4dbb-9297-a2e63b2204ae', '_blank');
      } else if (result.dismiss === Swal.DismissReason.cancel) {
          Swal.fire('การดำเนินการถูกยกเลิก', '', 'info');
      }
  });
}
