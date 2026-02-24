document.addEventListener("DOMContentLoaded", function () {
  // Check operating system
  // const isWindows = /Windows/i.test(navigator.userAgent);
  // const isMacOS = /Macintosh|MacIntel|MacPPC|Mac68K/i.test(navigator.userAgent);

  // if (isWindows || isMacOS) {
  //     Swal.fire({
  //         title: 'อุปกรณ์นี้ไม่ใช่สมาร์ทโฟน',
  //         text: 'กรุณาใช้สมาร์ทโฟน (Android หรือ iPhone) ในการลงเวลาปฏิบัติงาน เพื่อความแม่นยำของตำแหน่งพิกัด',
  //         icon: 'warning',
  //         showCancelButton: true,
  //         confirmButtonText: 'ออกจากระบบ',
  //         cancelButtonText: 'ดำเนินการต่อ',
  //         confirmButtonColor: "#22BB33",
  //         cancelButtonColor: "#FF0505",
  //         allowOutsideClick: false,
  //     }).then((result) => {
  //         if (result.isConfirmed) {
  //           localStorage.clear();
  //             window.location.href = 'about:blank'; // Exit system
  //         } else if (result.dismiss === Swal.DismissReason.cancel) {
  //             Swal.fire({
  //                 title: 'การใช้งานได้รับการอนุญาต',
  //                 text: 'คุณสามารถดำเนินการต่อบนอุปกรณ์นี้ได้',
  //                 icon: 'info',
  //                 confirmButtonColor: "#24A1DE",
  //             });
  //         }
  //     });
  // }

  // Swal.fire({
  //   title: "กรุณารอสักครู่...",
  //   allowOutsideClick: false,
  //   didOpen: () => {
  //     Swal.showLoading();
  //   },
  // });

  // Check for UUID in localStorage
  const uuid = localStorage.getItem("uuid");
  if (!uuid) {
    console.log("User is not logged in. Redirecting to login page.");
    window.location.href = "login.html";
    return;
  }
  // Update user information
  // Swal.close();
  updateUser(uuid);
});

function clearLocal() {
  // เรียกใช้ localStorage.clear() เพื่อลบข้อมูลทั้งหมดใน Local Storage
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'กด "ตกลง" เพื่อดำเนินการออกจากระบบ',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      Swal.fire({
        confirmButtonColor: "#0ef",
        icon: "success",
        title: "ออกจากระบบสำเร็จ",
        allowOutsideClick: false,
        confirmButtonColor: "#008000",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "login.html";
        }
      });
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
    }
  });
}

function checktoken() {
  urlapi =
    "https://script.google.com/macros/s/AKfycbwSQn-VpYHC6lGntFx3eqZbeGW5_MJhOvT9bynDi7j6wlFpkJILoM1ADjhlz3AuoUVLWQ/exec";
  queryapi = `?id=${localStorage.getItem("uuid")}`;
  fetch(urlapi + queryapi)
    .then((response) => response.json())
    .then((data) => {
      data.user.forEach(function (user) {
        if (user.token && user.token.trim() !== "") {
          liff.closeWindow();
        } else {
          // If user.token is empty or undefined, call fn
          createtoken();
        }
      });
    })
    .catch((error) => {
      console.error("Error fetching data:", error);
    });
}

function createtoken() {
  Swal.fire({
    title: "ไม่พบ LINE TOKEN ในระบบ",
    text: "กด ตกลง เพื่อออก Line Token หรือกดรับค่าใหม่ในกรณีออก Token แล้ว",
    icon: "warning",
    confirmButtonText: "ตกลง",
    cancelButtonText: "รับค่าใหม่",
    showCancelButton: true,
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
    imageUrl:
      "https://lh5.googleusercontent.com/d/1vCuMH9g4FDHdqoi3hOJi7YY005fBpx9a",
    imageWidth: 350,
    imageHeight: 550,
    imageAlt: "Custom image",
  }).then((result) => {
    if (result.isConfirmed) {
      // Redirect to the specified URL
      window.location.href = "token.html";
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // Clear local storage
      localStorage.clear();
    }
  });
}

function openWebAdmin() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'คลิก "ตกลง" เพื่อเข้าสู่ระบบการจัดการการลงเวลาปฏิบัติงาน',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("https://wisanusenhom.github.io/sekatime/", "_blank");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
    }
  });
}

function openWeb5s() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'คลิก "ตกลง" เพื่อเข้าสู่ระบบการจัดการงาน 5 ส.',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("https://wisanusenhom.github.io/5s/", "_blank");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
    }
  });
}

async function updateUser(uuid) {
  let gas = `https://script.google.com/macros/s/AKfycbziO9f62v0bfAz2bmPFQzuYibCxyamxDLOE08TZBcXx_UxzEqWvtGRIkSQQvYeV23Ko/exec?id=${uuid}`;
  const records = await fetch(gas);
  const data = await records.json();
  data.user.forEach(function (user) {
    localStorage.setItem("name", user.name);
    localStorage.setItem("job", user.job);
    localStorage.setItem("mainsub", user.mainsub);
    localStorage.setItem("office", user.office);
    localStorage.setItem("oflat", user.oflat);
    localStorage.setItem("oflong", user.oflong);
    localStorage.setItem("db1", user.db1);
    localStorage.setItem("token", user.token);
    localStorage.setItem("status", user.status);
    localStorage.setItem("role", user.role);
    localStorage.setItem("boss", user.boss);
    localStorage.setItem("ceo", user.ceo);
    localStorage.setItem("upic", user.upic);
    localStorage.setItem("refid", user.refid);
    localStorage.setItem("docno", user.docno);
  });
  //  checktoday();
}

async function checktoday() {
  // แสดงสถานะกำลังโหลดข้อมูล
  Swal.fire({
    title: "กำลังโหลดข้อมูล...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  var gas =
    "https://script.google.com/macros/s/AKfycby0bCwNY5tyoVzfb1aM_48Yvs0PInOqUEnb_Aw2Bdyt4t2dBQ-m3FBA4lkMtmgaYHC53w/exec";
  var qdata = `?id=${localStorage.getItem("refid")}&db=${localStorage.getItem(
    "db1"
  )}`;

  try {
    let response = await fetch(gas + qdata);
    let data = await response.json();

    // ปิดการแสดงสถานะการโหลด
    Swal.close();

    if (data.name) {
      // กรณีมีข้อมูลการลงเวลา
      let timelineData = `วันนี้คุณลงเวลามาแล้ว : การปฏิบัติงาน ${data.intype} \nลงเวลาเมื่อ ${data.intime}  ระยะ ${data.indistan} ${data.inunit}`;
      const cktoday = new Date();
      const ckfd = cktoday.toLocaleDateString("th-TH");
      localStorage.setItem("datecheck", ckfd);
      localStorage.setItem("datetimecheck", data.intime);

      Swal.fire({
        icon: "success",
        title: "ตรวจสอบการลงเวลา",
        text: timelineData,
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#008000",
      });
    } else {
      // กรณีไม่มีข้อมูลการลงเวลา
      Swal.fire({
        icon: "warning",
        title: "ตรวจสอบการลงเวลา",
        text: "วันนี้คุณยังไม่ได้ลงเวลามาปฏิบัติงาน",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#DBA800",
      });
    }
  } catch (error) {
    // ปิดการแสดงสถานะการโหลด
    Swal.close();

    console.error("Error fetching data:", error);

    Swal.fire({
      icon: "error",
      title: "ข้อผิดพลาด",
      text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#bb2124",
    });
  }
}

function openWebToken() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: 'คลิก "ตกลง" เพื่อออกไลน์โทเค็นสำหรับการแจ้งเตือนผ่านไลน์',
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("token.html", "_blank");
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire("การดำเนินการถูกยกเลิก", "", "info");
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
    // icon: "info",
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
      window.location.href =
        "https://wisanusenhom.github.io/sekatime/setting.html";
    }
  });
}

function editpic() {
  var yourpic = localStorage.getItem("yourpic");
  if (!yourpic || yourpic.trim() === "" || yourpic === "undefined") {
    // Show a warning message using SweetAlert
    Swal.fire({
      title: "ไม่พบรูปโปรไฟล์ LINE ของคุณ",
      text: 'ระบบจะลงชื่อออกและนำคุณเข้าสู่ระบบใหม่อีกครั้ง เมื่อคุณกด "ยืนยัน" เพื่อแก้ไขปัญหานี้',
      icon: "error",
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#008000",
      cancelButtonColor: "#6F7378",
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
    title: "แก้ไขรูปภาพประจำตัวของคุณ.!",

    imageUrl: yourpic,
    imageWidth: 200,
    imageHeight: 200,
    imageAlt: "Custom image",

    showCancelButton: true,
    allowOutsideClick: false,
    confirmButtonColor: "#008000",
    cancelButtonColor: "#6F7378",
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      // Show loading status
      Swal.fire({
        title: "กำลังปรับปรุงรูปโปรไฟล์...",
        text: "โปรดรอสักครู่",
        // icon: "info",
        allowOutsideClick: false,
        showConfirmButton: false, // Hide confirm button
        didOpen: () => {
          Swal.showLoading(); // Show loading spinner
        },
      });

      var urlperson = `https://script.google.com/macros/s/AKfycbyJkVKoVcJV28-1NitWY-WwST5AWHguNDO1aB-l-4ZCCYyNDuBRznMvCbyLxjLi2EJU5Q/exec`;
      var dataperson = `?id=${localStorage.getItem("uuid")}&pic=${yourpic}`;
      fetch(urlperson + dataperson)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
          return response.json();
        })
        .then((data) => {
          // Show a success message using SweetAlert
          Swal.fire({
            title: "สำเร็จ!",
            text: "การแก้ไขข้อมูลเสร็จสิ้น ระบบจะทำการรีเซ็ตอัตโนมัติ",
            icon: "success",
            confirmButtonColor: "#008000",
            allowOutsideClick: false,
          }).then(() => {
            localStorage.clear();
            location.reload();
          });
        })
        .catch((error) => {
          // Handle any errors that occurred during the fetch
          console.error("Fetch error:", error);

          // Show an error message using SweetAlert
          Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถแก้ไขข้อมูลได้",
            icon: "error",
            confirmButtonColor: "#bb2124",
          });
        });
    }
  });
}

// ยกเลิกการลงเวลาวันนี้
async function canceltoday() {
  const { value: accept } = await Swal.fire({
    title: "หากยกเลิกข้อมูลแล้วไม่สามารถเรียกคืนข้อมูลได้",
    input: "checkbox",
    showCancelButton: true,
    inputValue: 0,
    confirmButtonColor: "#bb2124",
    cancelButtonColor: "#6F7378",
    inputPlaceholder: `ข้าพเจ้ายอมรับและดำเนินการ ยกเลิกการลงเวลาปฏิบัติงานในวันนี้`,
    confirmButtonText: `Continue&nbsp;<i class="fa fa-arrow-right"></i>`,
    inputValidator: (result) => {
      return !result && "กรุณา ติ๊ก ยอมรับหากต้องการดำเนินการ";
    },
  });

  if (accept) {
    const captchaResult = await handleCaptchaVerification();

    if (captchaResult.isConfirmed && captchaResult.value === captchaText) {
      // แสดงสถานะกำลังดำเนินการ
      Swal.fire({
        title: "กำลังดำเนินการ...",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
      });

      const gasUrl =
        "https://script.google.com/macros/s/AKfycbyq0lc6EUpmCWS5LB30Yv2M7exyHR6IEf7PeerHLPApFtIPQiRCep9XtDSX4yHAjYvB-w/exec";
      const qdata = `?refid=${localStorage.getItem(
        "refid"
      )}&db1=${localStorage.getItem("db1")}&name=${localStorage.getItem(
        "name"
      )}&token=${localStorage.getItem("token")}&userid=${localStorage.getItem(
        "userid"
      )}`;

      try {
        const response = await fetch(gasUrl + qdata);

        if (!response.ok) {
          const errorResponse = await response.json();
          console.error("Error fetching data:", errorResponse);

          Swal.fire({
            icon: "error",
            title: "ข้อผิดพลาด",
            text: errorResponse.message || "ไม่สามารถติดต่อเซิร์ฟเวอร์ได้",
            confirmButtonText: "ตกลง",
            showCloseButton: true,
            confirmButtonColor: "#bb2124",
            customClass: {
              title: "text-error",
              content: "text-muted",
            },
          });
          return;
        }

        const data = await response.json();
        Swal.close();

        const status = data.status;
        const message = data.message;

        if (status === "success") {
          Swal.fire({
            icon: "success",
            title: "สำเร็จ! ยกเลิกลงเวลาในวันนี้แล้ว",
            text: message,
            confirmButtonText: "ตกลง",
            showCloseButton: true,
            allowOutsideClick: false,
            confirmButtonColor: "#008000",
            customClass: {
              title: "text-success",
              content: "text-muted",
            },
          }).then((result) => {
            if (result.isConfirmed) {
              localStorage.setItem("datecheckout", "");
              localStorage.setItem("datecheck", "");
              try {
                liff.closeWindow();
              } catch (error) {
                console.error("Failed to close window, refreshing...");
                setTimeout(() => {
                  location.reload();
                }, 500);
              }
            }
          });
        } else if (status === "warning") {
          Swal.fire({
            icon: "warning",
            title: "การดำเนินการยกเลิกลงเวลาในวันนี้",
            text: message,
            confirmButtonText: "ตกลง",
            showCloseButton: true,
            confirmButtonColor: "#DBA800",
            customClass: {
              title: "text-warning",
              content: "text-muted",
            },
          });
        } else if (status === "error") {
          Swal.fire({
            icon: "error",
            title: "ผิดพลาด",
            text: message,
            confirmButtonText: "ตกลง",
            showCloseButton: true,
            confirmButtonColor: "#bb2124",
            customClass: {
              title: "text-error",
              content: "text-muted",
            },
          });
        }
      } catch (error) {
        Swal.close();
        console.error("Error fetching data:", error);
        Swal.fire({
          icon: "error",
          title: "ข้อผิดพลาด",
          text: "ไม่สามารถยกเลิกการลงเวลาในวันนี้ได้ กรุณาลองใหม่อีกครั้ง",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#BB2124",
          showCloseButton: true,
          customClass: {
            title: "text-error",
            content: "text-muted",
          },
        });
      }
    }
  }
}

// Function to handle CAPTCHA verification
async function handleCaptchaVerification() {
  generateCaptcha();
  let captchaResult;

  do {
    captchaResult = await Swal.fire({
      title: `กรอกรหัสยืนยันในการยกเลิกการลงเวลาของท่าน`,
      showCancelButton: true,
      confirmButtonText: `ยืนยัน&nbsp;<i class="fa-solid fa-trash"></i>`,
      html: `<canvas id="captchaPopupCanvas" width="200" height="50"></canvas><br>
                                <input type="text" id="captchaInput" class="swal2-input" placeholder="Enter the code here">`,
      confirmButtonColor: "#bb2124",
      didOpen: () => {
        drawCaptcha("captchaPopupCanvas");
      },
      preConfirm: () => {
        const userInput = document
          .getElementById("captchaInput")
          .value.toUpperCase();
        if (!userInput) {
          Swal.showValidationMessage("กรุณากรอกรหัสยืนยัน");
          return false;
        } else if (userInput !== captchaText) {
          Swal.showValidationMessage("รหัสยืนยันไม่ถูกต้อง กรุณาลองอีกครั้ง");
          generateCaptcha();
          drawCaptcha("captchaPopupCanvas");
          return false;
        }
        return userInput;
      },
      showDenyButton: true,
      denyButtonText: `ขอรหัสใหม่`,
      denyButtonColor: "#039be5",
    });

    // Check if the deny button was clicked
    if (captchaResult.isDenied) {
      generateCaptcha();
    }
    // Check if the cancel button was clicked
    else if (captchaResult.isDismissed) {
      location.reload(); // Refresh the page if the cancel button is pressed
    }
  } while (!captchaResult.isConfirmed);

  return captchaResult;
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

function logupdate() {
  Swal.fire({
    title: "การปรับปรุงล่าสุด",
    html:
         "<strong>25 ธ.ค. 2568</strong><br>" +
      "เพิ่มระบบบันทึกปฏิบัติงานนอกเวลา) <br><br>" +
      "<strong>16 พ.ค. 2568</strong><br>" +
      "แยก API ในการบันทึก (3 API) <br><br>" +
      "<strong>5 ก.พ. 2568</strong><br>" +
      "เพิ่มระบบลงเวลาด้วย QR-code<br><br>" +
      "<strong>10 ม.ค. 2568</strong><br>" +
      "ออกแบบหน้าลงเวลาใหม่<br><br>" +
      "<strong>19 พ.ย. 2567</strong><br>" +
      "เพิ่มการแจ้งเตือนผ่าน Telegram<br><br>" +
      "<strong>1 พ.ย. 2567</strong><br>" +
      "1. เพิ่มระบบรหัสยืนยันข้อมูล<br>" +
      "2. เพิ่มฟังก์ชันยกเลิกการลงเวลา<br>" +
      "3. ปรับปรุง UI ให้ใช้งานสะดวกยิ่งขึ้น<br><br>" +
      "<strong>21 ต.ค. 2567</strong><br>" +
      "1. ยกเลิกการตรวจสอบการลงเวลามาที่ระบบหลังบ้าน<br>" +
      "2. เพิ่มฟังก์ชันตรวจสอบผ่านระบบหน้าบ้าน<br>" +
      "3. ตั้งทริกเกอร์ลบข้อมูลซ้ำซ้อนอัตโนมัติ",
    icon: "info",
    confirmButtonText: "ตกลง",
    showCloseButton: true,
    confirmButtonColor: "#008000",
  });
}

// ฟังก์ชันสำหรับตั้งค่าภาพพื้นหลังจาก LocalStorage
function applyBackgroundImage() {
  const storedImage = localStorage.getItem("backgroundImage");
  const currentTheme = document.body.getAttribute("data-theme"); // ดึงธีมปัจจุบัน

  // หากมีค่า storedImage ใช้ภาพนั้น
  if (storedImage) {
    document.body.style.backgroundImage = `url('${storedImage}')`;
  } else {
    // กำหนดภาพพื้นหลังเริ่มต้นตามธีม
    const defaultBackgrounds = {
      light:
        "url('https://cdn.pixabay.com/photo/2020/12/27/22/39/clock-5865407_1280.jpg')",
      dark: "url('https://cdn.pixabay.com/photo/2021/09/10/14/24/sky-6613380_1280.jpg')",
      pink: "url('https://cdn.pixabay.com/photo/2024/03/15/18/53/magnolia-flower-8635583_1280.jpg')",
      green:
        "url('https://cdn.pixabay.com/photo/2020/01/08/19/53/chamomile-4751118_1280.jpg')",
      blue: "url('https://cdn.pixabay.com/photo/2025/03/24/07/37/ai-generated-9490260_1280.png')",
      purple:
        "url('https://cdn.pixabay.com/photo/2015/01/14/17/29/flowers-599344_1280.jpg')",
      yellow:
        "url('https://cdn.pixabay.com/photo/2020/04/17/23/41/macro-5057196_1280.jpg')",
      gray: "url('https://cdn.pixabay.com/photo/2023/05/29/00/24/blue-tit-8024809_1280.jpg')",
      red: "url('https://cdn.pixabay.com/photo/2019/09/17/05/42/red-rose-4482541_1280.jpg')",
    };

    document.body.style.backgroundImage =
      defaultBackgrounds[currentTheme] || "none";
  }
  // เปลี่ยน URL ของ iframe ตามธีม
  const iframe = document.querySelector("iframe[title='datetime']");
  const themeClockURLs = {
    light:
      "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc666666/tct/pct/ftb/tt0/td1/th1/tb4",
    dark: "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fcf9f9f9/tct/pct/ftb/tt0/td1/th1/tb4",
    pink: "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc944b6b/tct/pct/ftb/tt0/td1/th1/tb4",
    green:
      "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc394b39/tct/pct/ftb/tt0/td1/th1/tb4",
    blue: "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc1a3d63/tct/pct/ftb/tt0/td1/th1/tb4",
    purple:
      "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc9B59B6/tct/pct/ftb/tt0/td1/th1/tb4",
    yellow:
      "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc5a511e/tct/pct/ftb/tt0/td1/th1/tb4",
    gray: "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fc37474f/tct/pct/ftb/tt0/td1/th1/tb4",
    red: "https://free.timeanddate.com/clock/i9pxn797/n3376/tlth39/fs18/fcb71c1c/tct/pct/ftb/tt0/td1/th1/tb4",
  };

  // ตั้งค่า iframe URL ตามธีม
  iframe.src = themeClockURLs[currentTheme] || iframe.src;
}

// ฟังก์ชันลดขนาดภาพ
function resizeImage(file, maxWidth, maxHeight, callback) {
  const reader = new FileReader();
  reader.onload = (e) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      let width = img.width;
      let height = img.height;

      // คำนวณขนาดใหม่เพื่อรักษาสัดส่วนของภาพ
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }
      }

      // ตั้งค่าขนาด canvas
      canvas.width = width;
      canvas.height = height;

      // วาดภาพลงใน canvas
      ctx.drawImage(img, 0, 0, width, height);

      // แปลง canvas เป็น Data URL
      const resizedImage = canvas.toDataURL("image/jpeg", 0.8); // ลดคุณภาพเล็กน้อย (0.8)
      callback(resizedImage);
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

// ฟังก์ชันสำหรับอัปโหลดภาพด้วย SweetAlert
async function uploadImage() {
  const { value: file } = await Swal.fire({
    title: "เลือกภาพเพื่อเปลี่ยนพื้นหลัง",
    text: "กรุณาเลือกภาพที่มีขนาดพอดีกับหน้าจอ",
    input: "file",
    inputAttributes: {
      accept: "image/*",
      "aria-label": "บันทึกภาพพื้นหลัง",
    },
    showDenyButton: true,
    showCancelButton: true,
    confirmButtonText: "ตั้งเป็นพื้นหลัง",
    denyButtonText: "ลบพื้นหลัง",
    cancelButtonText: "ยกเลิก",
  });

  if (file) {
    resizeImage(file, 1920, 1080, (resizedImage) => {
      Swal.fire({
        title: "ดูตัวอย่างภาพที่คุณเลือก",
        imageUrl: resizedImage,
        imageAlt: "ภาพที่จะบันทึก",
        showDenyButton: true,
        showCancelButton: true,
        confirmButtonText: "ตั้งเป็นพื้นหลัง",
        denyButtonText: "ลบพื้นหลัง",
        cancelButtonText: "ยกเลิก",
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem("backgroundImage", resizedImage);
          applyBackgroundImage();
          Swal.fire("สำเร็จ", "พื้นหลังได้ถูกเปลี่ยนแล้ว!", "success");
        } else if (result.isDenied) {
          localStorage.removeItem("backgroundImage");
          applyBackgroundImage();
          Swal.fire("ลบสำเร็จ", "พื้นหลังได้ถูกลบแล้ว!", "info");
        }
      });
    });
  } else if (!file && localStorage.getItem("backgroundImage")) {
    const clearResult = await Swal.fire({
      title: "ลบพื้นหลัง?",
      text: "คุณต้องการลบพื้นหลังปัจจุบันหรือไม่?",
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "ไม่ลบ",
      denyButtonText: "ลบพื้นหลัง",
      cancelButtonText: "ยกเลิก",
    });

    if (clearResult.isDenied) {
      localStorage.removeItem("backgroundImage");
      applyBackgroundImage();
      Swal.fire("ลบสำเร็จ", "พื้นหลังได้ถูกลบแล้ว!", "info");
    }
  }
}

applyBackgroundImage();

// ตรวจสอบขนาดไฟล์
// function calculateLocalStorageSize(key) {
//   const storedData = localStorage.getItem(key);
//   if (storedData) {
//     const sizeInBytes = new Blob([storedData]).size;
//     console.log(`ขนาดของ "${key}": ${sizeInBytes} bytes (${(sizeInBytes / 1024).toFixed(2)} KB)`);
//   } else {
//     console.log(`ไม่พบข้อมูลในคีย์ "${key}"`);
//   }
// }

// // ใช้งานฟังก์ชัน
// calculateLocalStorageSize("backgroundImage");

const menuToggle = document.getElementById("menu-toggle");
const themeToggle = document.getElementById("theme-toggle");
const menu = document.getElementById("menu");
const body = document.body;

// Apply theme from localStorage on page load
// const savedTheme = localStorage.getItem("theme") || "light";
// applyTheme(savedTheme);

// Menu Toggle
menuToggle.addEventListener("click", () => {
  menu.classList.toggle("show");
  document.body.classList.toggle("menu-open");

  // Toggle the icon between hamburger and "X"
  const icon = menuToggle.querySelector("i");
  icon.classList.toggle("fa-bars");
  icon.classList.toggle("fa-x");
});

// Close menu when clicking outside
document.addEventListener("click", (e) => {
  // Check if the click is outside the menu or the menu toggle button
  if (!menu.contains(e.target) && !menuToggle.contains(e.target)) {
    menu.classList.remove("show");
    document.body.classList.remove("menu-open");

    // Reset the icon to hamburger
    const icon = menuToggle.querySelector("i");
    icon.classList.add("fa-bars");
    icon.classList.remove("fa-x");
  }
});

// การแจ้งเตือน
const notifyToggle = document.getElementById("notify-toggle");
const notifyMenu = document.getElementById("notify-menu");

// Toggle notification menu
notifyToggle.addEventListener("click", (e) => {
  e.stopPropagation(); // Prevent event bubbling to document
  notifyMenu.classList.toggle("show");
});

// Close notification when clicking outside
document.addEventListener("click", (e) => {
  if (!notifyMenu.contains(e.target) && !notifyToggle.contains(e.target)) {
    notifyMenu.classList.remove("show");
  }
});

const notifyBadge = document.getElementById("notify-badge");
const noTimeLog = document.getElementById("no-time-log");
const hasTimeLog = document.getElementById("has-time-log");

// ตัวอย่าง: ถ้ามีแจ้งเตือนให้แสดง badge
let hasNotifications = false;

const now = new Date();
let formattedToday = now.toLocaleDateString("th-TH");
if (formattedToday === localStorage.getItem("datecheck")) {
  hasNotifications = false;
} else {
  hasNotifications = true;
}

if (hasNotifications) {
  notifyBadge.style.display = "block";
  noTimeLog.style.display = "block"; // Show the "no time log" message
  hasTimeLog.style.display = "none"; // Hide the "has time log" message
} else {
  notifyBadge.style.display = "none";
  noTimeLog.style.display = "none"; // Hide the "no time log" message
  hasTimeLog.style.display = "block"; // Show the "has time log" message
}

// รายการธีมที่รองรับ
const themes = [
  "light",
  "dark",
  "yellow",
  "green",
  "pink",
  "blue",
  "purple",
  "gray",
  "red",
];
let currentThemeIndex = themes.indexOf(localStorage.getItem("theme")) || 0;

// ฟังก์ชันสำหรับตรวจสอบธีมระบบ
function getSystemTheme() {
  if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: dark)").matches
  ) {
    return "dark";
  } else if (
    window.matchMedia &&
    window.matchMedia("(prefers-color-scheme: light)").matches
  ) {
    return "light";
  } else {
    return "light"; // ค่าเริ่มต้นหากไม่สามารถตรวจสอบธีมระบบได้
  }
}

// ฟังก์ชันสำหรับเปลี่ยนธีม
function applyTheme(theme) {
  document.body.setAttribute("data-theme", theme);

  // ไอคอนที่สอดคล้องกับแต่ละธีม
  const themeIcons = {
    light: '<i class="fa-solid fa-sun"></i>',
    dark: '<i class="fa-solid fa-moon"></i>',
    pink: '<i class="fa-solid fa-heart"></i>',
    green: '<i class="fa-solid fa-leaf"></i>',
    purple: '<i class="fa-solid fa-gem"></i>',
    yellow: '<i class="fa-solid fa-star"></i>',
    blue: '<i class="fa-solid fa-water"></i>',
    gray: '<i class="fa-solid fa-palette"></i>',
    red: '<i class="fa-solid fa-fire"></i>',
  };

  // ตั้งค่าไอคอนในปุ่ม
  themeToggle.innerHTML =
    themeIcons[theme] || '<i class="fa-solid fa-circle"></i>';

  // บันทึกธีมใน Local Storage
  localStorage.setItem("theme", theme);

  // อัปเดตค่า meta tags
  updateMetaTags(theme);

  // เรียกฟังก์ชันที่เกี่ยวข้องอื่น ๆ
  applyBackgroundImage();
}

// ฟังก์ชันสำหรับอัปเดต meta tags ตามธีม
function updateMetaTags(theme) {
  let themeColor = "#ffffff"; // ค่า default
  let msNavButtonColor = "#ffffff"; // ค่า default
  let appleStatusBarStyle = "default"; // ค่า default

  switch (theme) {
    case "light":
      themeColor = "#ffffff";
      msNavButtonColor = "#ffffff";
      appleStatusBarStyle = "default";
      break;
    case "dark":
      themeColor = "#444";
      msNavButtonColor = "#444";
      appleStatusBarStyle = "black-translucent";
      break;
    case "pink":
      themeColor = "#ffebf0";
      msNavButtonColor = "#ffebf0";
      appleStatusBarStyle = "default";
      break;
    case "green":
      themeColor = "#e6f7e6";
      msNavButtonColor = "#e6f7e6";
      appleStatusBarStyle = "default";
      break;
    case "blue":
      themeColor = "#bbdefb";
      msNavButtonColor = "#bbdefb";
      appleStatusBarStyle = "default";
      break;
    case "purple":
      themeColor = "#f4ecff";
      msNavButtonColor = "#f4ecff";
      appleStatusBarStyle = "default";
      break;
    case "yellow":
      themeColor = "#fff9e6";
      msNavButtonColor = "#fff9e6";
      appleStatusBarStyle = "default";
      break;
    case "gray":
      themeColor = "#cfd8dc";
      msNavButtonColor = "#cfd8dc";
      appleStatusBarStyle = "black-translucent";
      break;
    case "red":
      themeColor = "#ffcdd2";
      msNavButtonColor = "#ffcdd2";
      appleStatusBarStyle = "default";
      break;
    // เพิ่มกรณีธีมใหม่ๆ ที่ต้องการ
  }

  // อัปเดตค่าใน meta tags
  document
    .querySelector('meta[name="theme-color"]')
    .setAttribute("content", themeColor);
  document
    .querySelector('meta[name="msapplication-navbutton-color"]')
    .setAttribute("content", msNavButtonColor);
  document
    .querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')
    .setAttribute("content", appleStatusBarStyle);
}

// ตัวจัดการเหตุการณ์สำหรับปุ่มเปลี่ยนธีม
themeToggle.addEventListener("click", () => {
  currentThemeIndex = (currentThemeIndex + 1) % themes.length; // วนลูปกลับไปที่ธีมแรกเมื่อถึงธีมสุดท้าย
  const newTheme = themes[currentThemeIndex];
  applyTheme(newTheme);
});

// โหลดธีมจาก Local Storage เมื่อเริ่มต้น
document.addEventListener("DOMContentLoaded", () => {
  let savedTheme = localStorage.getItem("theme");

  // หากไม่มีธีมที่บันทึกไว้ ให้ตรวจสอบธีมระบบ
  if (!savedTheme) {
    savedTheme = getSystemTheme();
  }

  currentThemeIndex = themes.indexOf(savedTheme);
  applyTheme(savedTheme);
});

// ยืนยันคำขอกู้บัญชี
async function requestReceive() {
  const refid = localStorage.getItem("refid");
  const byName = localStorage.getItem("name");
  const role = localStorage.getItem("role");
  if (role === "user") {
    Swal.fire("ผิดพลาด!", "ท่านไม่มีสิทธิ์ในการเข้าถึงเมนูนี้!", "error");
    return;
  }

  // แสดงสถานะกำลังโหลดข้อมูล
  Swal.fire({
    title: "กำลังโหลดข้อมูล...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  var gas =
    "https://script.google.com/macros/s/AKfycbxdv6lUeT9rWLcZtnZ6hMQTdEwiy-mK7sOJhT_eDl2ZflzhIjSkNUc4Nz0l4HweMTyl/exec";
  var qdata = `?id=${refid}`;

  await fetch(gas + qdata)
    .then((response) => response.json())
    .then((user) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();
      if (user.user && user.user.length > 0) {
        var timelineData = `
        <div style="text-align: left;">
        <ol style="padding-left: 20px; line-height: 1.8;">
          วันที่ : ${user.user[0].regdate} <br>
          ชื่อ : ${user.user[0].name} <br>
          ตำแหน่ง : ${user.user[0].job}      
        </ol>
      </div>
        `;
        // แสดงข้อมูลที่ดึงมาใน Swal
        Swal.fire({
          title: "คำขอกู้คืนบัญชี",
          html: timelineData,
          allowOutsideClick: false,
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ยืนยัน",
          denyButtonText: `ปฏิเสธ`,
        }).then((result) => {
          /* Read more about isConfirmed, isDenied below */
          uu_id = user.user[0].uuid;
          newline = user.user[0].newline;
          if (result.isConfirmed) {
            requestReceiveYesNo(uu_id, newline, byName, "confirm");
            // Swal.fire("Saved!", "", "success");
          } else if (result.isDenied) {
            requestReceiveYesNo(uu_id, newline, byName, "deny");
            // Swal.fire("Changes are not saved", "", "info");
          }
        });
      } else {
        // แสดงข้อความเตือนใน Swal
        Swal.fire({
          icon: "warning",
          title: "ไม่พบคำขอกู้คืนบัญชี",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#DBA800",
        });
      }
    })
    .catch((error) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();

      console.error("Error fetching data:", error);

      // แสดงข้อความผิดพลาดใน Swal
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#bb2124",
      });
    });
}

async function requestReceiveYesNo(uu_id, newline, byName, status) {
  Swal.fire({
    title: "กำลังดำเนินการ...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  var gas =
    "https://script.google.com/macros/s/AKfycbyLabkeVyABhdGszcYjIwqOuooTLr-y68YkMhTMEKetyF2B29nAwj03InJDZ1p4v0SkBA/exec";
  var qdata = `?uuid=${uu_id}&newline=${newline}&byName=${byName}&status=${status}`;
  console.log(gas + qdata);
  await fetch(gas + qdata)
    .then((response) => response.json())
    .then((sts) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();
      if (sts.sts[0].sts === "ok") {
        var timelineData = "";
        if (status === "confirm") {
          timelineData = "การยืนยันกู้คืนบัญชีสำเร็จ";
        } else if (status === "deny") {
          timelineData = "การปฏิบัติเสธกู้คืนบัญชีสำเร็จ";
        }
        Swal.fire({
          icon: "success",
          title: "สำเร็จ",
          html: timelineData,
          confirmButtonText: "ตกลง",
        });
      } else {
        // แสดงข้อความเตือนใน Swal
        Swal.fire({
          icon: "warning",
          title: "ไม่สามารถดำเนินการได้",
          confirmButtonText: "ตกลง",
          confirmButtonColor: "#DBA800",
        });
      }
    })
    .catch((error) => {
      // ปิดการแสดงสถานะการโหลด
      Swal.close();

      console.error("Error fetching data:", error);

      // แสดงข้อความผิดพลาดใน Swal
      Swal.fire({
        icon: "error",
        title: "ข้อผิดพลาด",
        text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
        confirmButtonText: "ตกลง",
        confirmButtonColor: "#bb2124",
      });
    });
}

// รายงานและสถิติ

document.addEventListener("DOMContentLoaded", function () {
  setupYearMonthSelectors("report-year", "report-month");
  setupYearMonthSelectors("summary-year", "summary-month");
});

function setupYearMonthSelectors(yearId, monthId) {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear(); // ปี ค.ศ.
  const selectYear = document.getElementById(yearId);
  const selectMonth = document.getElementById(monthId);

  const monthNames = [
    "มกราคม",
    "กุมภาพันธ์",
    "มีนาคม",
    "เมษายน",
    "พฤษภาคม",
    "มิถุนายน",
    "กรกฎาคม",
    "สิงหาคม",
    "กันยายน",
    "ตุลาคม",
    "พฤศจิกายน",
    "ธันวาคม",
  ];

  for (let i = 0; i < 2; i++) {
    const yearCE = currentYear - i;
    const yearBE = yearCE + 543;
    let option = new Option(yearBE, yearCE);
    selectYear.add(option);
  }

  for (let i = 0; i < 12; i++) {
    let monthValue = (i + 1).toString().padStart(2, "0");
    let option = new Option(monthNames[i], monthValue);
    selectMonth.add(option);
  }

  selectYear.value = currentYear;
  selectMonth.value = (currentDate.getMonth() + 1).toString().padStart(2, "0");
}

function reportdata() {
  let yearCE = document.getElementById("report-year").value;
  let month = document.getElementById("report-month").value;
  let monthSelect = document.getElementById("summary-month");
  let monthName = monthSelect.options[monthSelect.selectedIndex].text; // ชื่อเดือน (ภาษาไทย)
  let formattedDate = yearCE + month;
  let yearTH = parseInt(yearCE) + 543;
  const isResponsiveMain = document.getElementById("responsiveSwitchMain").checked;

  fetchReportData(formattedDate, monthName, yearTH,isResponsiveMain);
}

function summarydata() {
  let yearCE = document.getElementById("summary-year").value;
  let monthSelect = document.getElementById("summary-month");
  let month = monthSelect.value.padStart(2, "0");
  let monthName = monthSelect.options[monthSelect.selectedIndex].text; // ชื่อเดือน (ภาษาไทย)

  let formattedMonth = `${yearCE}-${month}`;
  let yearTH = parseInt(yearCE) + 543;

  const isResponsiveAlt = document.getElementById("responsiveSwitchAlt").checked;

  // เรียกใช้ชื่อเดือนด้วย
  fetchSummaryData(formattedMonth, monthName, yearTH,isResponsiveAlt);
}

async function fetchReportData(formattedDate, monthName, yearTH, responsiveSwitchMain) {
  const cid = localStorage.getItem("cidhash");
  const db1 = localStorage.getItem("db1");
  const yourname = localStorage.getItem("name");
  const exportTitle = `รายงานข้อมูลลงเวลา ประจำเดือน ${monthName} พ.ศ. ${yearTH} (${yourname})`;
  var apiUrl =
    "https://script.google.com/macros/s/AKfycbwjLcT7GFTETdwRt_GfU6j-8poTK6_t400RPLa4cMY72Ih3EYAWQIDyFQV0et7lMQG2LQ/exec";

  var queryParams = `?startdate=${formattedDate}&cid=${cid}&db=${db1}`;

  // แสดงตัวโหลด
  document.getElementById("loadingSpinner").style.display = "block";

  await fetch(apiUrl + queryParams)
    .then((response) => response.json())
    .then((data) => {
      const reporttb = document.getElementById("reportdata");
      reporttb.innerHTML = "";
      let datartb = "";

      let totalDays = 0;
      let weekdays = 0;
      let weekends = 0;
      let normalWork = 0;
      let offsiteWork = 0;
      let holidayWork = 0;
      let officialWork = 0;
      let otherWork = 0;
      let requestCount = 0; // จำนวนที่มีคำขอ
      let actualWorkDays = 0;
      let approvedRequests = 0;
      let verifiedCount = 0;
      let workDaysWithoutRequest = 0;

      data.tst.forEach(function (tst) {
        // ข้ามข้อมูลที่ไม่มีค่า (null, undefined, ว่าง)
        if (!tst.datein || !tst.typein) return;

        totalDays++;

        const date = new Date(tst.datein);
        const dayOfWeek = date.getDay();
        if (dayOfWeek === 0 || dayOfWeek === 6) {
          weekends++;
        } else {
          weekdays++;
        }

        switch (tst.typein) {
          case "ปกติ":
            normalWork++;
            break;
          case "นอกสถานที่":
            offsiteWork++;
            break;
          case "วันหยุด":
            holidayWork++;
            break;
          case "ไปราชการ":
            officialWork++;
            break;
          case "อื่นๆ":
            otherWork++;
            break;
        }

        // นับเฉพาะรายการที่มีค่าคำขอจริง ๆ
        if (tst.reqdate && tst.reqdate.trim() !== "") {
          requestCount++;
        }

        datartb += `<tr>
                <td>${tst.day}</td>
                <td>${tst.datein}</td>
                <td>${tst.timein}</td>
                <td>${tst.name}</td>
                <td>${tst.subname}</td>
                <td>${tst.typein}</td>
                <td>${tst.disin}</td>
                <td>${tst.timeout}</td>
                <td>${tst.disout}</td>
                <td>${tst.notein}</td>
                <td>${tst.request || "-"}</td>
                <td>${tst.reqdate}</td>
                <td>${tst.reqtime}</td>
                <td>${tst.permitdate}</td>
                <td>${tst.permittime}</td>
                <td>${tst.permitname}</td>
                <td>${tst.permit_note}</td>
                <td>${tst.verified}</td>
                <td>${tst.verifiedname}</td>
                <td>${tst.verified_note}</td>
                <td>${tst.verifieddate}</td>
                <td>${tst.verifiedtime}</td>
                <td>${tst.ref}</td>
            </tr>`;
      });

      reporttb.innerHTML = datartb;

      actualWorkDays =
        normalWork + offsiteWork + officialWork + otherWork - holidayWork;

      approvedRequests = data.tst.filter(
        (d) => d.permitdate && d.permitdate.trim() !== ""
      ).length;

      verifiedCount = data.tst.filter(
        (d) =>
          d.verified &&
          d.verified.trim() !== "" &&
          d.verified.trim() !== "รอตรวจสอบ"
      ).length;

      workDaysWithoutRequest = totalDays - requestCount;

      // สร้างวันที่ปัจจุบัน
const now = new Date();
const day = now.getDate();
const month = now.getMonth() + 1;
const yearTHNow = now.getFullYear() + 543;
const hours = now.getHours().toString().padStart(2, '0');
const minutes = now.getMinutes().toString().padStart(2, '0');

// แปลงรูปแบบวันที่เป็น "ข้อมูล ณ วันที่ 26/05/2568 เวลา 14:30 น."
const currentDateTime = `ข้อมูล ณ วันที่ ${day}/${month}/${yearTHNow} เวลา ${hours}:${minutes} น.`;

      const statistics = `          
        <h4 class="stat-title"><i class="fa-solid fa-clock"></i> ข้อมูลการลงเวลา ประจำเดือน ${monthName} พ.ศ. ${yearTH}</h4>
        <p class="stat-item"><i class="fa-solid fa-calendar-days"></i> รวมทั้งหมด :  <span>${totalDays}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-user-check"></i> วันทำการ : <span>${actualWorkDays}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-business-time"></i> วันจันทร์-ศุกร์ :  <span>${weekdays}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-calendar-week"></i> วันเสาร์-อาทิตย์ :  <span>${weekends}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-circle-check"></i> ทันเวลา : <span>${workDaysWithoutRequest}</span> วัน</p>
    
        <h4 class="stat-title"><i class="fa-solid fa-briefcase"></i> ประเภทการปฏิบัติงาน</h4>
        <p class="stat-item"><i class="fa-solid fa-check-circle"></i> ปกติ :  <span>${normalWork}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-building"></i> นอกสถานที่ :  <span>${offsiteWork}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-star"></i> วันหยุด :  <span>${holidayWork}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-file-signature"></i> ไปราชการ :  <span>${officialWork}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-ellipsis"></i> อื่นๆ :  <span>${otherWork}</span> วัน</p>
    
        <h4 class="stat-title"><i class="fa-solid fa-envelope"></i> ข้อมูลคำขอ/การตรวจสอบ</h4>
        <p class="stat-item"><i class="fa-solid fa-envelope-open-text"></i> ยื่นคำขอ :  <span>${requestCount}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-stamp"></i> อนุมัติแล้ว : <span>${approvedRequests}</span> วัน</p>
        <p class="stat-item"><i class="fa-solid fa-user-shield"></i> ตรวจสอบแล้ว : <span>${verifiedCount}</span> วัน</p>

        <h4 class="stat-title"></h4>
        <p class="stat-item"><i class="fa-solid fa-calendar-check"></i> ${currentDateTime}</p>

          `;
      document.getElementById("statistics").innerHTML = statistics;

      document.getElementById("dreportdata").style.display = "table";
      document.getElementById("loadingSpinner").style.display = "none";

      sendMsgToTelegram(
        totalDays,
        weekdays,
        weekends,
        normalWork,
        offsiteWork,
        holidayWork,
        officialWork,
        otherWork,
        requestCount,
        monthName,
        yearTH
      );

      if ($.fn.dataTable.isDataTable("#dreportdata")) {
        $("#dreportdata").DataTable().clear().destroy();
      }

      $("#dreportdata").DataTable({
        data: data.tst,
        columns: [
          { data: "day" },
          { data: "datein" },
          { data: "timein" },
          { data: "timeout" },
          { data: "name" },
          { data: "subname" },
          { data: "typein" },
          { data: "disin" },
          { data: "disout" },
          { data: "notein" },
          { data: "request" },
          { data: "reqdate" },
          { data: "reqtime" },
          { data: "permitdate" },
          { data: "permittime" },
          { data: "permitname" },
          { data: "permit_note" },
          { data: "verified" },
          { data: "verifiedname" },
          { data: "verified_note" },
          { data: "verifieddate" },
          { data: "verifiedtime" },
          { data: "ref" },
        ],
        language: {
          url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json",
        },
        processing: true,
        responsive: responsiveSwitchMain,
        scrollX: !responsiveSwitchMain, 
        autoFill: true,
        order: [
          [22, "asc"],
          [5, "asc"],
        ],
        colReorder: true,
        fixedHeader: true,
        select: true,
        keys: true,
        dom: "lBfrtip",
        lengthMenu: [
          [10, 30, 50, 100, 150, -1],
          [10, 30, 50, 100, 150, "ทั้งหมด"],
        ],
        buttons: [
          {
            extend: "copy",
            title: exportTitle,
          },
          {
            extend: "csv",
            title: exportTitle,
          },
          {
            extend: "excel",
            title: exportTitle,
          },
          {
            extend: "print",
            title: exportTitle,
            messageTop: exportTitle, // เพิ่มหัวเรื่องด้านบนตอนพิมพ์
          },
          "colvis",
        ],
        pageLength: 30,
      });
    })
    .catch((error) => {
      document.getElementById("loadingSpinner").style.display = "none";
      console.error("Error fetching data:", error);
    });
}

function sendMsgToTelegram(
  totalDays,
  weekdays,
  weekends,
  normalWork,
  offsiteWork,
  holidayWork,
  officialWork,
  otherWork,
  requestCount,
  monthName,
  yearTH
) {
  const chatId = localStorage.getItem("chatId");
  const botToken = "7733040493:AAEWH-FUoFbXE3ohDboDxImRI52f39yvtV4";

  if (!chatId || !botToken) {
    console.error("Missing chatId or botToken");
    return;
  }

  const statisticsx = `
<b>ข้อมูลการลงเวลา</b>
<b>ประจำเดือน ${monthName} พ.ศ. ${yearTH}</b>

รวมทั้งหมด: <b>${totalDays}</b> วัน
จันทร์-ศุกร์: <b>${weekdays}</b> วัน
เสาร์-อาทิตย์: <b>${weekends}</b> วัน

<b>ประเภทการปฏิบัติงาน</b>
ปกติ: <b>${normalWork}</b> วัน
นอกสถานที่: <b>${offsiteWork}</b> วัน
วันหยุด: <b>${holidayWork}</b> วัน
ไปราชการ: <b>${officialWork}</b> วัน
อื่นๆ: <b>${otherWork}</b> วัน

<b>ข้อมูลคำขอ</b>
ยื่นคำขอ: <b>${requestCount}</b> วัน
`;

  const url = `https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${encodeURIComponent(
    statisticsx
  )}&parse_mode=HTML`;

  fetch(url)
    .then((response) => response.json())
    .then((data) => {
      if (data.ok) {
        console.log("Message sent successfully");
      } else {
        console.error("Failed to send message", data);
      }
    })
    .catch((error) =>
      console.error("Error sending message to Telegram", error)
    );
}

// ฟังก์ชันหลักที่ดึงข้อมูลและสร้าง DataTable

async function fetchSummaryData(formattedMonth, monthName, yearTH, isResponsiveAlt) {
  const role = localStorage.getItem("role");
  const db1 = localStorage.getItem("db1");
  const office = localStorage.getItem("office");
  const exportTitle = `รายงานสรุปข้อมูลลงเวลา ประจำเดือน ${monthName} พ.ศ. ${yearTH}`;
  const apiUrl =
    "https://script.google.com/macros/s/AKfycbzpcaGG9gXkA_Liu4zkbGFGMg-CDhWFFkc2oxJKNRg0BTVj9TODjptKkDb8n4HrfL4J/exec";
  const queryParams = `?month=${formattedMonth}&user=${role}&db=${db1}&unit=${office}`;

  document.getElementById("loadingSpinnerx").style.display = "block";

  try {
    const response = await fetch(apiUrl + queryParams);
    const result = await response.json();
    const rawData = result.data;
    const days = result.days;

    const dayNames = ["อา.", "จ.", "อ.", "พ.", "พฤ.", "ศ.", "ส."];
    const baseDate = new Date(formattedMonth + "-01");

    const columns = [
      { title: "ชื่อ", data: "name" },
      { title: "หน่วยงาน/กลุ่มงาน", data: "unit" },
      { title: "รวม", data: "total" },
      ...days.map((d) => {
        const day = parseInt(d);
        const dateObj = new Date(
          baseDate.getFullYear(),
          baseDate.getMonth(),
          day
        );
        const dayName = dayNames[dateObj.getDay()];
        return {
          title: `${dayName}${day}`,
          data: day.toString(),
        };
      }),
    ];

    if ($.fn.dataTable.isDataTable("#dsummarydata")) {
      $("#dsummarydata").DataTable().clear().destroy();
    }

    $("#dsummarydata").DataTable({
      data: rawData,
      columns: columns,
      language: {
        url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json",
      },
      processing: true,
      responsive: isResponsiveAlt,
  scrollX: !isResponsiveAlt, 

      autoFill: true,
      order: [[1, 0, "asc"]],
      colReorder: true,
      fixedHeader: true,
      select: true,
      keys: true,
      dom: "lBfrtip",
      lengthMenu: [
        [10, 30, 50, 100, 150, -1],
        [10, 30, 50, 100, 150, "ทั้งหมด"],
      ],
      buttons: [
        {
          extend: "copy",
          title: exportTitle,
        },
        {
          extend: "csv",
          title: exportTitle,
        },
        {
          extend: "excel",
          title: exportTitle,
        },
        {
          extend: "print",
          title: exportTitle,
          messageTop: exportTitle, // เพิ่มหัวเรื่องด้านบนตอนพิมพ์
        },
        "colvis",
      ],

      pageLength: 100,
    });

    document.getElementById("dsummarydata").style.display = "table";
  } catch (error) {
    console.error("Error fetching data:", error);
  } finally {
    document.getElementById("loadingSpinnerx").style.display = "none";
  }
}

function clearTableData() {
  const reporttb = document.getElementById("reportdata");
  reporttb.innerHTML = ""; // ล้างข้อมูลใน tbody
}

// OAuth 2.0
let decodedClientId = atob(
  "Njg5NzYxNTA5MS1yMnR1bzEzZjdnbmY5aXJqcWJidHQzdTFpY2lnaG1zdi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbQ=="
);

// ฟังก์ชันอัพเดทข้อมูลลง Google Sheets
function updateGoogleId(googleId, googleName, googleEmail) {
  if (!googleId || !googleEmail) {
    Swal.fire({
      title: "ผิดพลาด!",
      text: "ไม่สามารถดำเนินการได้",
      icon: "error",
    });
    return;
  }

  Swal.fire({
    title: "กำลังเชื่อมต่อกับ Google...",
    text: "โปรดรอสักครู่",
    icon: "info",
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  let uuid = localStorage.getItem("uuid");
  if (!uuid) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "ไม่พบข้อมูล UUID",
      icon: "error",
    });
    return;
  }

  let urlperson = `https://script.google.com/macros/s/AKfycby3NXj2VrZg4KEc98fDk5WCopX1N0mf8QNvVOS7pphbe-ZFa_0E6H4z88F5az7b8LUafQ/exec`;
  let dataperson = `?id=${uuid}&googleId=${googleId}&googleEmail=${googleEmail}`;

  fetch(urlperson + dataperson)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
    .then((data) => {
      Swal.fire({
        title: "การเชื่อมต่อสำเร็จ!",
        html: `การเชื่อมต่อกับ ${googleEmail} สำเร็จ`,
        icon: "success",
        allowOutsideClick: false,
      }).then(() => {
        localStorage.setItem("googleId", googleId);
        localStorage.setItem("googleEmail", googleEmail);
        window.location.href = "index.html";
      });
    })
    .catch((error) => {
      console.error("Fetch error:", error);
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถแก้ไขข้อมูลได้",
        icon: "error",
      });
    });
}

// จัดการ Credential Response
function handleCredentialResponse(response) {
  const user = decodeJwtResponse(response.credential);
  if (!user || !user.sub) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถอ่านข้อมูลบัญชี Google ได้",
      icon: "error",
    });
    return;
  }

  let googleId = user.sub;
  let googleName = user.name;
  let googleEmail = user.email;
  console.log("Google ID:", googleId);
  console.log("Google Email:", googleEmail);

  Swal.fire({
    title: "ยืนยันข้อมูลบัญชี Google",
    html: `
          <p><strong>ชื่อ:</strong> ${googleName}</p>
          <p><strong>อีเมล์:</strong> ${googleEmail}</p>
      `,
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    focusConfirm: false,
    allowOutsideClick: false,
    preConfirm: () => {
      updateGoogleId(googleId, googleName, googleEmail);
    },
  });
}

// ฟังก์ชันแปลง JWT Token
function decodeJwtResponse(token) {
  try {
    let base64Url = token.split(".")[1];
    let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4 !== 0) {
      base64 += "=";
    }
    let jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("JWT Decode Error:", error);
    return null;
  }
}

// โหลดระบบ Google Login
window.onload = function () {
  google.accounts.id.initialize({
    client_id: decodedClientId,
    callback: handleCredentialResponse,
  });
};

// แสดงปุ่มล็อกอิน Google ด้วย Swal
function googlelogin() {
  let storedGoogleId = localStorage.getItem("googleId");
  let storedGoogleEmail = localStorage.getItem("googleEmail");

  if (storedGoogleId && storedGoogleEmail) {
    Swal.fire({
      title: "คุณได้ล็อกอินอยู่แล้ว",
      text: `บัญชีปัจจุบัน: ${storedGoogleEmail}\nคุณต้องการดำเนินการต่อหรือไม่?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "ดำเนินการต่อ",
      cancelButtonText: "ยกเลิก",
    }).then((result) => {
      if (result.isConfirmed) {
        showGoogleLoginButton(); // แสดงปุ่มล็อกอิน Google
      }
    });
  } else {
    showGoogleLoginButton(); // แสดงปุ่มล็อกอิน Google ทันทีถ้ายังไม่มีบัญชีล็อกอิน
  }
}

function showGoogleLoginButton() {
  Swal.fire({
    html: '<div id="google-login-container" class="google-login-container"></div>',
    showCloseButton: true,
    showCancelButton: false,
    focusConfirm: false,
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: () => {
      setTimeout(() => {
        google.accounts.id.renderButton(
          document.getElementById("google-login-container"),
          {
            theme: "filled_blue",
            size: "large",
            text: "sign_in_with",
            shape: "pill",
          }
        );
      }, 100);
    },
  });
}


// ฟังก์ชันตรวจสอบขนาด localStorage
function getLocalStorageSizeBytes() {
  let total = 0;

  for (let key in localStorage) {
    if (localStorage.hasOwnProperty(key)) {
      const value = localStorage.getItem(key);
      total += (key.length + value.length) * 2; // UTF-16
    }
  }

  return total; // bytes
}

function clearOffDayIfExceedLimit() {
  const LIMIT_MB = 4.5;
  const LIMIT_BYTES = LIMIT_MB * 1024 * 1024;

  const usedBytes = getLocalStorageSizeBytes();
  const usedMB = (usedBytes / 1024 / 1024).toFixed(2);

  console.log(`localStorage ใช้ไป ${usedMB} MB`);

  if (usedBytes > LIMIT_BYTES) {
    console.warn("⚠️ localStorage เกิน 4.5 MB → ลบข้อมูลบางส่วน");

    const keysToRemove = [
      "offDayPayloads",
      "offDaySuccessLogs",
      "otEntries"
    ];

    keysToRemove.forEach((key) => {
      if (localStorage.getItem(key)) {
        localStorage.removeItem(key);
        console.log(`🗑️ ลบ ${key}`);
      }
    });
  }
}

clearOffDayIfExceedLimit();
