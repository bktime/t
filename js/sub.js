document.addEventListener("DOMContentLoaded", async function () {
  Swal.fire({
    icon: "info",
    title: "คำชี้แจง",
    text: "เลขบัตรประจำตัวประชาชนมีการเข้ารหัสที่ไม่สามารถถอดได้ เพื่อใช้ในการยื่นยันตัวตนบุคคล ในกรณีใช้มากกว่า 1 ไอดี",
  });
  // เมื่อหน้าเว็บโหลดเสร็จ, ดึงข้อมูล category และใส่ใน dropdown
  await fetch(
    "https://script.google.com/macros/s/AKfycbxqDazVhojy3PDLD2asS6Dp2dh-5zqiE9SVJr15BBh2nddc00ehKQNTC7_H1KXM6EhJFA/exec"
  )
    .then((response) => response.json())
    .then((data) => {
      const categoryDropdown = document.getElementById("category");

      // เพิ่ม option สำหรับแต่ละ category
      data.category.forEach((category) => {
        const option = document.createElement("option");
        option.value = category.id;
        option.text = category.name;
        categoryDropdown.add(option);
      });

      // โหลด subcategories สำหรับ category แรก
      loadSubcategories();
    })
    .catch((error) => console.error("Error fetching categories:", error));
});

async function loadSubcategories() {
  const categoryDropdown = document.getElementById("category");
  const subcategoryDropdown = document.getElementById("subcategory");

  // ดึงค่าที่ถูกเลือกใน dropdown ของ category
  const selectedCategoryId = categoryDropdown.value;
  // console.log(selectedCategoryId);

  // ดึงข้อมูล subcategories จาก API โดยใช้ selectedCategoryId
  await fetch(
    `https://script.google.com/macros/s/AKfycbwYUMzfkbM_B2fdgoGaJ7QKx_ACzg7cr0jn8I_x9yJdqHyWLurD_4IE5uX9tu_DW98/exec?categories=${selectedCategoryId}`
  )
    .then((response) => response.json())
    .then((data) => {
      // ลบค่าเก่าใน dropdown ของ subcategory
      subcategoryDropdown.innerHTML = "";

      // เพิ่ม option สำหรับแต่ละ subcategory
      data.category.forEach((subcategory) => {
        const option = document.createElement("option");
        option.value = subcategory.id;
        option.text = subcategory.name;
        subcategoryDropdown.add(option);
      });
      loadSubdatas();
    })
    .catch((error) => console.error("Error fetching subcategories:", error));
}

async function loadSubdatas() {
  const subcategoryDropdowns = document.getElementById("subcategory");

  // ดึงค่าที่ถูกเลือกใน dropdown ของ category
  const selecteddatas = subcategoryDropdowns.value;
  // console.log(selecteddatas);
  // ดึงข้อมูล subcategories จาก API โดยใช้ selectedCategoryId
  await fetch(
    `https://script.google.com/macros/s/AKfycbxRMzDKnw3HwBzYZxxKUiRSQKYIUWhi6Le9-cY09zdgZ1uE1HUMkntKRkATNT8INBu3/exec?datas=${selecteddatas}`
  )
    .then((response) => response.json())
    .then((data) => {
      // ลบค่าเก่าใน dropdown ของ subcategory
      document.querySelector("#latitude").innerHTML = "";
      document.querySelector("#longitude").innerHTML = "";
      document.querySelector("#db1").innerHTML = "";
      document.querySelector("#db2").innerHTML = "";
      document.querySelector("#db3").innerHTML = "";
      document.querySelector("#maincode").innerHTML = "";
      document.querySelector("#subcode").innerHTML = "";
      //  console.log(data);
      // เพิ่ม option สำหรับแต่ละ subcategory
      data.datas.forEach((subdatas) => {
        document.querySelector("#latitude").value = subdatas.lat;
        document.querySelector("#longitude").value = subdatas.long;
        document.querySelector("#db1").value = subdatas.db1;
        document.querySelector("#db2").value = subdatas.db2;
        document.querySelector("#db3").value = subdatas.db3;
        document.querySelector("#maincode").value = subdatas.maincode;
        document.querySelector("#subcode").value = subdatas.subcode;
      });
      main();
    })
    .catch((error) => console.error("Error fetching subcategories:", error));
}

async function getProfile() {
  const profile = await liff.getProfile();
  document.querySelector("#userid").value = profile.userId;
  document.querySelector("#userimg").value = profile.pictureUrl;
  document.querySelector("#username").value = profile.displayName;
  document.querySelector("#useros").value = liff.getOS();
  // document.querySelector('#useremail').value = liff.getDecodedIDToken().email;
  document.querySelector("#upic").src = profile.pictureUrl;
}

async function main() {
  await liff.init({ liffId: "1654797991-nkGwelwo" });
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login();
  }
}
main();

async function insertdata() {

  let userid = document.querySelector("#userid").value;
  if (userid.length < 2) {
    Swal.fire("ผิดพลาด!", "ไม่พบ UserId ของ Line กรุณาอนุญาตการเข้าถึงข้อมูลของ Line แล้วสมัครใหม่อีกครั้ง!", "error");
    return;
  }

  let ucid = document.querySelector("#cid").value;
  // ตรวจสอบความยาวของรหัส PIN
  if (ucid.length !== 13) {
    Swal.fire("ผิดพลาด!", "เลขบัตรประจำตัวประชาชน ต้องยาว 13 หลัก!", "error");
    return;
  }

  // ตรวจสอบว่ารหัส PIN ประกอบด้วยตัวเลขเท่านั้น
  for (const char of ucid) {
    if (!/[0-9]/.test(char)) {
      Swal.fire(
        "ผิดพลาด!",
        "เลขบัตรประจำตัวประชาชน ต้องเป็นตัวเลขเท่านั้น!",
        "error"
      );

      return;
    }
  }
  let hash_cid = md5(document.querySelector("#cid").value);
  let pname = document.querySelector("#pname").value;
  if (pname.length < 1) {
    Swal.fire("ผิดพลาด!", "โปรดกรอกคำนำหน้าชื่อ!", "error");
    return;
  }
  let fname = document.querySelector("#fname").value;
  if (fname.length < 2) {
    Swal.fire("ผิดพลาด!", "โปรดกรอกชื่อ!", "error");
    return;
  }
  let lname = document.querySelector("#lname").value;
  if (lname.length < 2) {
    Swal.fire("ผิดพลาด!", "โปรดกรอกนามสกุล!", "error");
    return;
  }
  let job = document.querySelector("#job").value;
  if (job.length < 2) {
    Swal.fire("ผิดพลาด!", "โปรดกรอกตำแหน่ง!", "error");
    return;
  }

  let rank = document.querySelector("#rank").value;
  if (rank.length < 2) {
    Swal.fire("ผิดพลาด!", "โปรดเลือกประเภท!", "error");
    return;
  }

  let category = document.querySelector("#category").value;

  let subcategory = document.querySelector("#subcategory").value;
  let username = document.querySelector("#username").value;
  let userimg = document.querySelector("#userimg").value;
  let useros = document.querySelector("#useros").value;
  let latitude = document.querySelector("#latitude").value;
  let longitude = document.querySelector("#longitude").value;
  let db1 = document.querySelector("#db1").value;
  let db2 = document.querySelector("#db2").value;
  let db3 = document.querySelector("#db3").value;
  let maincode = document.querySelector("#maincode").value;
  let subcode = document.querySelector("#subcode").value;

  let message = `
สังกัด : ${category}
หน่วยงาน : ${subcategory}
เลขบัตร(เข้ารหัส) : ${hash_cid}
ชื่อ - สกุล : ${pname}${fname} ${lname}
ตำแหน่ง : ${job}
Main Code: ${maincode}
Sub Code: ${subcode}
`;

Swal.fire({
    title: "โปรดตรวจสอบความถูกต้อง",
    text: message,
    icon: "info",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "แก้ไข",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      let timerInterval;
      Swal.fire({
        title: "กำลังดำเนินการโปรดรอสักครู่...",
        allowOutsideClick: false,
        timerProgressBar: true,
        didOpen: () => {
          Swal.showLoading();
          timerInterval = setInterval(() => {
            const timer = Swal.getPopup().querySelector("b");
            if (timer) timer.textContent = `${Swal.getTimerLeft()}`;
          }, 100);
        },
        willClose: () => {
          clearInterval(timerInterval);
        },
      });
  
      // ส่งค่า และดึงข้อมูลจาก API
      fetch(
        `https://script.google.com/macros/s/AKfycbzsWNRX6L0lfXRqmFeehqrmuNsPTUMBBa9IDSnU6tJEKLs0Q7qlRmClbqNkHmUOqX19uA/exec?hash_cid=${hash_cid}&pname=${pname}&fname=${fname}&lname=${lname}&job=${job}&category=${category}&subcategory=${subcategory}&username=${username}&userid=${userid}&userimg=${userimg}&useros=${useros}&latitude=${latitude}&longitude=${longitude}&db1=${db1}&db2=${db2}&db3=${db3}&maincode=${maincode}&subcode=${subcode}&rank=${rank}`
      )
        .then((response) => {
          if (!response.ok) {
            throw new Error("เกิดข้อผิดพลาดในการเชื่อมต่อกับเซิร์ฟเวอร์");
          }
          return response.json();
        })
        .then((data) => {
          if (!data || !data.data) {
            throw new Error("ไม่มีข้อมูลที่ได้รับจากเซิร์ฟเวอร์");
          }
  
          // แสดง Swal สำหรับแต่ละ subcategory
          data.data.forEach((datas) => {
            Swal.fire({
              confirmButtonColor: "#1e90ff",
              icon: datas.icon,
              title: datas.header,
              text: datas.text,
              allowOutsideClick: false,
            }).then((result) => {
              if (result.isConfirmed) {
                window.location.href = "login.html";
              }
            });
          });
        })
        .catch((error) => {
          Swal.fire({
            icon: "error",
            title: "เกิดข้อผิดพลาด",
            text: error.message,
          });
          console.error("Error fetching subcategories:", error);
        });
    }
  });  
}

jQuery(document).ready(function ($) {
  $("#cid").on("keyup", function () {
    if ($.trim($(this).val()) != "" && $(this).val().length == 13) {
      id = $(this).val().replace(/-/g, "");
      let result = Script_checkID(id);
      if (result === false) {
        $("span.error").removeClass("true").text("ผิด โปรดตรวจสอบ");
      } else {
        $("span.error").addClass("true").text("ถูกต้อง");
      }
    } else {
      $("span.error").removeClass("true").text("");
    }
  });
});

function Script_checkID(id) {
  if (id.substring(0, 1) == 0) return false;
  if (id.length != 13) return false;
  for (i = 0, sum = 0; i < 12; i++) sum += parseFloat(id.charAt(i)) * (13 - i);
  if ((11 - (sum % 11)) % 10 != parseFloat(id.charAt(12))) return false;
  return true;
}
