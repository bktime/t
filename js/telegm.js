let CONFIG = null;

async function getConfig(){
 const cache = localStorage.getItem("CONFIG");
 if(cache){
    CONFIG = JSON.parse(cache);
    return;
 }
 const res = await fetch("/config");
 CONFIG = await res.json();
 localStorage.setItem("CONFIG",JSON.stringify(CONFIG));
}
getConfig();

document.addEventListener("DOMContentLoaded", function () { 
const uuid = localStorage.getItem("uuid");
  if (!uuid) {
      console.log("User is not logged in. Redirecting to login page.");
      window.location.href = "login.html";
      return;
  }
});

function getchatID() {
  const chatId = localStorage.getItem("chatId");
  if (chatId) {
    Swal.fire({
      icon: "info",
      title: "พบการเชื่อมต่อ Telegram แล้ว",
      allowOutsideClick: false,
      confirmButtonText: "เชื่อมต่อใหม่",
      cancelButtonText: "ยกเลิก",
      showCloseButton: true,
      showCancelButton: true,
      confirmButtonColor: "#24A1DE",
      customClass: {
        title: "text-info",
        content: "text-muted",
      },
      html: `<i class="fa-brands fa-telegram"></i> Telegram_ID : <strong> ${chatId} </strong>`,
  // footer: `<a href="https://t.me/TimestampNotifybot" target="_blank">
  //           <i class="fa-solid fa-message"></i> เปิดแชท Telegram
  //        </a><br>
  //        <a href="https://t.me/setlanguage/thaith" target="_blank">
  //           <i class="fa-solid fa-language"></i> กำหนดภาษาไทยสำหรับ Telegram
  //        </a>`,
    }).then((result) => {
      if (result.isConfirmed) {
        showTelegramGuideSteps();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        // เมื่อกดปุ่มยกเลิก ให้เปลี่ยนหน้าไปยัง index.html
        window.location.href = "index.html";
      }
    });
  } else {
    showTelegramGuideSteps();
  }
}


function sendMessageToTelegram(chatId) {
  const message = "การเชื่อมต่อสำเร็จแล้ว";
  const botToken = CONFIG.telegram_bot_token;
  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${message}`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      const status = data.ok ? 'สำเร็จ' : 'ข้อผิดพลาด';
      const text = data.ok ? 'ส่งข้อความสำเร็จ!' : `เกิดข้อผิดพลาด: ${data.description}`;
      Swal.fire({ icon: data.ok ? 'success' : 'error', title: status, text }).then(() => window.location.href = "index.html");
    })
    .catch(() => {
      Swal.fire({
        icon: 'error',
        title: 'ข้อผิดพลาด',
        text: 'เกิดข้อผิดพลาดในการส่งข้อความ กรุณาลองใหม่อีกครั้ง'
      }).then(() => window.location.href = "index.html");
    });
}



// อัพเดพข้อมูลลง sheet
function updateChatId(chatId, usName) {
  if (!chatId) {
    showNoMessageAlert();
    return; // Exit the function to prevent further execution
  }
      Swal.fire({
        title: "กำลังเชื่อมต่อกับ Telegram...",
        text: "โปรดรอสักครู่",
        icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false, // Hide confirm button
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });

      var urlperson = `https://script.google.com/macros/s/AKfycbwQHbXJ4KxeyS_ZWEPTHRxnVsBisgHCI5C6uE_SMS_NbIoAq42L6cyCWrJh_855_huE/exec`;
      var dataperson = `?id=${localStorage.getItem(
        "uuid"
      )}&chatId=${chatId}&usName=${usName}`;
      fetch(urlperson + dataperson)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Show a success message using SweetAlert
          const telegramqr = "https://lh5.googleusercontent.com/d/1aC5SsCMqeGgYIBzwNRdXnrjTZCyANIg-"; 
          Swal.fire({
            title: "การเชื่อมต่อสำเร็จ!",
            text: "การเชื่อมต่อกับ Telegram สำเร็จ",
            icon: "success",
            imageUrl: telegramqr,
            imageWidth: 200,
            imageHeight: 240,
            imageAlt: "QR Code",
            confirmButtonColor: "#008000",
            allowOutsideClick: false, // ไม่อนุญาตให้คลิกนอกกล่องข้อความ
          }).then(() => {
            // เก็บ chatId ใน localStorage
            localStorage.setItem("chatId", chatId);
          
            // เปิดแชท Telegram
            window.open("https://t.me/TimestampNotifyBot", "_blank");
          
            // ส่งข้อความไปยัง Telegram
            sendMessageToTelegram(chatId);
          
            // เปลี่ยนหน้าไปที่ index.html
            window.location.href = "index.html";
          });
          
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch
          // console.error("Fetch error:", error);

          // Show an error message using SweetAlert
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถแก้ไขข้อมูลได้",
            icon: "error",
            confirmButtonColor: "#bb2124",
          });
        });
    }

function showNoMessageAlert() {
  const telegramqr =
    "https://lh5.googleusercontent.com/d/1aC5SsCMqeGgYIBzwNRdXnrjTZCyANIg-";
  Swal.fire({
    title: "ไม่พบ message.chat.id",
    html: `
        <p>กรุณาตรวจสอบว่าคุณได้เพิ่มเพื่อน "<strong>ลงเวลา</strong>" แล้วหรือยัง</p>
        <p>หากยังไม่ได้เพิ่มเพื่อน กรุณาเพิ่มเพื่อนก่อนโดยคลิกที่ปุ่มด้านล่าง:</p>
      `,
    imageUrl: telegramqr,
    imageWidth: 200,
    imageHeight: 240,
    imageAlt: "QR Code",
    icon: "error",
    confirmButtonText: "เพิ่มเพื่อน",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#24A1DE",
    cancelButtonColor: "#6F7378",
    showCancelButton: true,
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("https://t.me/TimestampNotifyBot", "_blank");
    }
  });
}

// telegram login

const botUsername = CONFIG.botName;
const botId = CONFIG.botId;

function getLatestUpdate() {
  Swal.fire({
    title: "กำลังเข้าสู่ระบบเทเลแกรม...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
  // const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${window.location.origin}&embed=1`;
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=https://t-7k0.pages.dev/authen.html&embed=1`;
  window.open(authUrl, "_self"); // Open Telegram login page

}

window.addEventListener("load", handleTelegramCallback);
 
async function handleTelegramCallback(){
  const urlHash = window.location.hash; // ดึงข้อมูลจาก fragment (หลัง #)
  // console.log("URL Hash:", urlHash); // พิมพ์ข้อมูลที่ดึงจาก fragment

  const telegramDataBase64 = urlHash.replace("#tgAuthResult=", ""); // ลบ '#tgAuthResult=' ออก
  // console.log("Telegram Data (Base64):", telegramDataBase64); // ตรวจสอบข้อมูลที่ได้เป็น Base64

  if (telegramDataBase64) {
    try {
      // ถอดรหัส Base64
      const telegramData = atob(telegramDataBase64);
      // console.log("Decoded Telegram Data:", telegramData); // ตรวจสอบข้อมูลที่ถอดรหัส

      // แปลงข้อมูลเป็น JSON
      const user = JSON.parse(telegramData);
      const { id, first_name, last_name, photo_url,username } = user;

      // console.log("Telegram User Data:", user);

      const result = await Swal.fire({
        title: `ยินดีต้อนรับ \n ${first_name} ${last_name}`,
        text: `คุณต้องการดำเนินการต่อด้วยบัญชี ${username} หรือไม่?`,
        imageUrl: photo_url,
        imageWidth: 100,
        imageHeight: 100,
        imageAlt: "User Photo",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#24A1DE",
        cancelButtonColor: "#d33",
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        // หากผู้ใช้กดยืนยัน ให้ดำเนินการกับข้อมูล user
        localStorage.setItem("chatId", id);
        updateChatId(id, username);
      } else {
        Swal.fire({
          icon: "info",
          title: "การดำเนินการถูกยกเลิก",
          confirmButtonColor: "#0ef",
        }).then(() => {
          window.location.href = "index.html";
        });
      }
      window.location.hash = '';
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาดในการประมวลผลข้อมูลจาก Telegram กรุณาลองใหม่อีกครั้ง",
        text: error.message,
        confirmButtonColor: "#0ef",
    });
    }
  }else{
    getchatID()
  }
}


function showTelegramGuideSteps() {
  const steps = [1, 2, 2.1, 2.2, 3, "END"];
  const Queue = Swal.mixin({
    progressSteps: steps,
    confirmButtonText: 'ถัดไป >',
    showClass: { backdrop: 'swal2-noanimation' },
    hideClass: { backdrop: 'swal2-noanimation' },
  });

  (async () => {
    await Queue.fire({
      title: '1️⃣ ป้อน <b>เบอร์โทรศัพท์</b> ที่ลงทะเบียนกับ Telegram (+66)<br> กดปุ่ม NEXT',
      html: `<img src="https://lh5.googleusercontent.com/d/1kz55Gewy-1WH1jRlhiW4v6U5EoqqHww0" alt="ตัวอย่างการกดยืนยันใน Telegram" 
        style="width: 100%; max-width: 300px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">`,
      currentProgressStep: 0,
    });

    await Queue.fire({
      title: '2️⃣ กด <b> Confirm</b> ที่การแจ้งเตือน<br>',
      html: `<img src="https://lh5.googleusercontent.com/d/132Snp9ebrhkdl7aSz3NXy21RilIluxbO" alt="ตัวอย่างการกดยืนยันใน Telegram" 
        style="width: 100%; max-width: 300px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">`,
      currentProgressStep: 1,
    });

    await Queue.fire({
      html: `หาก Telegram ไม่แจ้งเตือน เปิดแอพ/แชท Telegram <br>
        <img src="https://lh5.googleusercontent.com/d/1MA-oSuWWLdixZXEK2ChzfEBxitWRJ6O0" alt="ตัวอย่างการกดยืนยันใน Telegram" 
        style="width: 100%; max-width: 300px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">`,
      currentProgressStep: 2,
    });

    await Queue.fire({
      html: `กด <b>ปุ่ม Confirm</b> ในแชท "Telegram" <br>
        <img src="https://lh5.googleusercontent.com/d/1GKlu8MJkJoBzePGG7LV_Id7GD9mvbMzd" alt="ตัวอย่างการกดยืนยันใน Telegram" 
        style="width: 100%; max-width: 300px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">`,
      currentProgressStep: 3,
    });

    await Queue.fire({
      title: '3️⃣ เปิดแอพลงเวลาแล้ว กด <b> ยืนยัน</b> <br>',
      html: ` <img src="https://lh5.googleusercontent.com/d/1v0azTKUmDwu7nmphiPpeJtpbJ-0F8fa2" alt="ตัวอย่างการกดยืนยันใน Telegram" 
        style="width: 100%; max-width: 300px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);">`,
      currentProgressStep: 4,
    });

    await Queue.fire({
      title: 'วิธีใช้เพิ่มเติม',
      html: `
        <p style="text-align: left;">
          <p><a href="javascript:void(0);" onclick="checkAppTelegram()" style="color: lightblue;">
               ตรวจสอบการติดตั้ง Telegram 
             </a></p>
         <p> <a href="https://youtube.com/shorts/U1Eto_Sl2FE?feature=share" style="color: lightblue;">
               🎥 วิดีโอสอนเชื่อมต่อ Telegram กับระบบลงเวลา
             </a></p>
        <p>  <a href="https://t.me/TimestampNotifybot" target="_blank" style="color: lightblue;">
               💬 เปิดแชท Telegram
             </a></p>
          <p><a href="https://t.me/setlanguage/thaith" target="_blank" style="color: lightblue;">
               🌍 ตั้งค่า Telegram เป็นภาษาไทย
             </a></p>
        </p>
      `,
      currentProgressStep: 5,
      confirmButtonText: 'ตกลง',
    }).then(() => {
      getLatestUpdate();
    });
  })();
}


function coseWindow() {
  // Redirect to index.html
  window.location.href = 'index.html';
}

// ck tlg
function checkAppTelegram() {
  const userAgent = navigator.userAgent.toLowerCase();
  const telegramUrl = 'tg://resolve?domain=telegram';
  const downloadUrl = /android/.test(userAgent)
      ? 'https://play.google.com/store/apps/details?id=org.telegram.messenger'
      : /iphone|ipad|ipod/.test(userAgent)
      ? 'https://apps.apple.com/app/telegram-messenger/id686449807'
      : 'https://desktop.telegram.org/';

  const timeout = setTimeout(() => {
      Swal.fire({
          icon: 'warning',
          html: '<i class="fa-brands fa-telegram"></i> Telegram ไม่ได้ติดตั้ง',
          text: 'กรุณาดาวน์โหลดแอพ Telegram เพื่อใช้งาน',
          confirmButtonText: 'ดาวน์โหลด',
          confirmButtonColor: "#24A1DE",
      }).then(() => window.location.href = downloadUrl);
  }, 500);

  // ตรวจสอบการติดตั้ง
  const iframe = document.createElement('iframe');
  iframe.src = telegramUrl;
  iframe.style.display = 'none';
  document.body.appendChild(iframe);

  window.addEventListener('blur', () => {
      clearTimeout(timeout);
      getchatID(); // เรียกเมื่อ Telegram ถูกติดตั้ง
  });
}
