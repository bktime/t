document.addEventListener("DOMContentLoaded", function () {
  const uuid = localStorage.getItem("uuid");
  if (uuid) {
    window.location.href = "index.html"; 
  }
});

function clearLocal() {
  Swal.fire({
    title: "คุณแน่ใจหรือไม่?",
    text: "การดำเนินการนี้จะลบข้อมูลทั้งหมดใน Local Storage อย่างถาวร",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "ใช่, ลบข้อมูล!",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      localStorage.clear();
      Swal.fire({
        confirmButtonColor: "#0ef",
        icon: "success",
        title: "ข้อมูลใน Local Storage ถูกลบเรียบร้อยแล้ว",
      });
    }
  });
}

function showLoading() {
  document.getElementById("loadingOverlay").style.display = "flex";
}

function hideLoading() {
  document.getElementById("loadingOverlay").style.display = "none";
}

async function getProfile() {
  try {
    const profile = await liff.getProfile();
    const { displayName, userId, pictureUrl, statusMessage } = profile;

    Swal.fire({
      title: `ยินดีต้อนรับคุณ\n${displayName}`,
      html: `สถานะ : ${statusMessage}<br><br><strong>คุณต้องการเข้าสู่ระบบด้วยบัญชีไลน์นี้หรือไม่?</strong>`,
      imageUrl: pictureUrl,
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "User Photo",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#00B900",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        getMember(userId, pictureUrl, displayName, "line");
      } else {
        Swal.fire({
          icon: "info",
          title: "คุณเลือกยกเลิกการเข้าสู่ระบบ",
          confirmButtonColor: "#00B900",
        });
      }
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้",
      confirmButtonColor: "#d33",
    });
  }
}

async function main() {
  hideLoading();
 await liff.init({ liffId: "1654797991-pr0xKPxW" });
//  await liff.init({ liffId: "1654797991-Xmxp3Gpj" }); // ทดสอบ
  if (liff.isLoggedIn()) {
    getProfile();
  } else {
    liff.login({ redirectUri: window.location.href });
  }
}

const botUsername = "TimestampNotifybot";
const botId = "7733040493";

// const botUsername = "wisanusenhombot";
// const botId = "7781010431";

function telegramLogin() {
  const originUrl = "https://wisanusenhom.github.io/nu/login.html";
  // const originUrl = "https://1a52-125-24-90-98.ngrok-free.app/login.html"; // test telegram login
  const authUrl = `https://oauth.telegram.org/auth?bot_id=${botId}&origin=${originUrl}&embed=1`;
  window.open(authUrl, "_self");
}

window.addEventListener("load", handleTelegramCallback);

async function handleTelegramCallback() {
  const urlHash = window.location.hash;
  const telegramDataBase64 = urlHash.replace("#tgAuthResult=", "");

  if (telegramDataBase64) {
    try {
      const telegramData = atob(telegramDataBase64);
      const user = JSON.parse(telegramData);
      const { id, first_name, last_name, photo_url, username } = user;

      const result = await Swal.fire({
        title: `ยินดีต้อนรับคุณ\n${first_name} ${last_name}`,
        html: `คุณต้องการเข้าสู่ระบบด้วยเทเลแกรม<br>ไอดี : ${id} <br> บัญชี : ${username} หรือไม่?`,
        imageUrl: photo_url,
        imageWidth: 150,
        imageHeight: 150,
        imageAlt: "User Photo",
        showCancelButton: true,
        confirmButtonText: "ยืนยัน",
        cancelButtonText: "ยกเลิก",
        confirmButtonColor: "#24A1DE",
        cancelButtonColor: "#d33",
        allowOutsideClick: false,
      });

      if (result.isConfirmed) {
        await getMember(id, photo_url, username, "telegram");
      } else {
        Swal.fire({
          icon: "info",
          title: "คุณเลือกยกเลิกการเข้าสู่ระบบ",
          confirmButtonColor: "#0ef",
        });
      }
      window.location.hash = "";
    } catch (error) {
      main();
      // Swal.fire({
      //   icon: "error",
      //   title: "Error parsing Telegram data.",
      //   text: error.message,
      //   confirmButtonColor: "#0ef",
      // });
    }
  }
}


// เพิ่มไลน์ใหม่
// ตรวจสอบเลขบัตร
  function inputcid(userId) {
    if (!userId) {
      Swal.fire("ผิดพลาด!", "ไม่พบ UserId ของ Line กรุณาอนุญาตการเข้าถึงข้อมูลของ Line แล้วดำเนินการใหม่อีกครั้ง!", "error");
      return;
    }
    // แสดงคำชี้แจงก่อน
    Swal.fire({
        title: 'คำชี้แจง',
        html: `
        <div style="text-align: left;">
        <ol style="padding-left: 20px; line-height: 1.8;">
          <li>หมายเลขบัตรประชาชนของคุณจะถูกเข้ารหัสเพื่อความปลอดภัย</li>
          <li>ไลน์ที่ใช้กู้คืนจะต้องไม่มีอยู่ในระบบ</li>
          <li>โปรดตรวจสอบว่ามีการกำหนดหัวหน้า หากยังไม่กำหนดให้แจ้ง Admin หรือ IT ของหน่วยงานท่านกำหนดให้ก่อน</li>
          <li>เมื่อยื่นคำขอการกู้บัญชีเดิม เนื่องจากเปลี่ยนไลน์ใหม่ หรือเพิ่มไลน์สำรอง โปรดแจ้งให้หัวหน้าของท่านเป็นผู้อนุมัติ</li>
        </ol>
      </div>
        `,
        input: 'checkbox',
        inputPlaceholder: 'ฉันยอมรับเงื่อนไข',
        showCancelButton: true,
        cancelButtonText: "ยกเลิก",
        confirmButtonText: 'รับทราบ',
        inputValidator: (result) => {
            if (!result) {
                return 'คุณต้องยอมรับเงื่อนไขก่อนดำเนินการต่อ!';
            }
        }
    }).then((res) => {
        if (res.isConfirmed) {
            Swal.fire({
                title: 'Enter Your CID',
                input: 'number',
                inputPlaceholder: 'กรอกเลขบัตรประชาชนของคุณ',
                showCancelButton: true,
                confirmButtonText: 'Submit',
                preConfirm: (value) => {
                    if (!value) {
                        Swal.showValidationMessage('กรุณากรอกข้อมูลก่อน!');
                        return false;
                    }
                    if (value.length !== 13) {
                        Swal.showValidationMessage('กรุณาตรวจสอบเลข 13 หลัก!');
                        return false;
                    }
                    return value;
                }
            }).then((result) => {
                if (result.isConfirmed) {
                    let hash_cid = md5(result.value);
                    sentrequest(userId, hash_cid);
                }
            });
        }
    });
}


async function sentrequest(userId,hash_cid) {
  Swal.fire({
    title: "กำลังส่งคำขอ...",
    allowOutsideClick: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    const response = await fetch(
      `https://script.google.com/macros/s/AKfycbxEe3z9p6YqPg6BwlYW-wZv6RLW61S8Qhp7NJPC5e_nYI8NETb7iTjIVlGvLbqVZop3Wg/exec?cid_hash=${hash_cid}&userId=${userId}`
    );

    if (!response.ok) {
      throw new Error(`Failed to process: ${response.statusText}`);
    }

    // แปลงข้อมูลที่ได้รับจาก API
    const data = await response.json();

    // เช็คข้อมูลใน data.user
    if (data.user.length === 0) {
      Swal.close();
      Swal.fire({
        icon: 'error',
        title: 'ข้อมูลไม่ถูกต้อง',
        text: 'ไม่พบข้อมูลผู้ใช้งานที่ตรงกัน หรือ ไลน์นี้มีอยู่ในฐานข้อมูลอยู่แล้ว',
      });
    } else {
      Swal.close();
      Swal.fire({
        icon: 'success',
        title: 'ส่งคำขอสำเร็จ',
        text: 'โปรดแจ้งให้หัวหน้าของท่านเพื่อ "ยืนยัน" คำขอของท่าน',
      });
    }
  } catch (error) {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'เกิดข้อผิดพลาด',
      text: error.message,
    });
  }
}

async function getProfile2() {
  try {
    const profile = await liff.getProfile();
    const { displayName, userId, pictureUrl, statusMessage } = profile;

    Swal.fire({
      title: `ยินดีต้อนรับคุณ\n${displayName}`,
      html: `สถานะ : ${statusMessage}<br><br><strong>คุณต้องการเพิ่มบัญชีไลน์นี้หรือไม่?</strong>`,
      imageUrl: pictureUrl,
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "User Photo",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#00B900",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.setItem("userId", userId);
        inputcid(userId);
      } else {
        Swal.fire({
          icon: "info",
          title: "คุณเลือกยกเลิกการเพิ่มบัญชี",
          confirmButtonColor: "#00B900",
        });
      }
    });
  } catch (error) {
    console.error("Error retrieving profile:", error);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถดึงข้อมูลโปรไฟล์ได้",
      confirmButtonColor: "#d33",
    });
  }
}

async function main2() {
  hideLoading();
 await liff.init({ liffId: "1654797991-pr0xKPxW" });
//  await liff.init({ liffId: "1654797991-Xmxp3Gpj" }); // ทดสอบ
  if (liff.isLoggedIn()) {
    getProfile2();
  } else {
    liff.login({ redirectUri: window.location.href });
  }
}



// login
async function getMember(yourId, yourPic, profile, useApp) {
  showLoading();

  function displaySwal(icon, title, text, confirmButtonText, cancelButtonText, denyButtonText) {
    return Swal.fire({
      icon: icon,
      title: title,
      text: text,
      allowOutsideClick: false,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText,
      denyButtonText: denyButtonText,
      showCancelButton: !!cancelButtonText,
      showDenyButton: !!denyButtonText,
      confirmButtonColor: "#008000",
      cancelButtonColor: "#0073E6",
    });
  }

  function saveUserToLocalStorage(user) {
    for (let key in user) {
      localStorage.setItem(key, user[key]);
    }
  }

  // ดึงข้อมูลเกี่ยวกับอุปกรณ์
  const systemInfo = getSystemInfo();

  // ตรวจสอบว่ารับค่าได้หรือไม่
  if (!systemInfo) {
    hideLoading();
    return; // หากรับค่าไม่ได้ หยุดการทำงาน
  }

  const systemInfoJSON = JSON.stringify(systemInfo, null, 2);

  try {
    const gas = `https://script.google.com/macros/s/AKfycbyY-5A1mpNjJjD9CjPEX4fSW5N6xB7PoMAODHgjMJuuLARrCjvm5csgFamB8MKbjUB9/exec?id=${yourId}&profile=${profile}&deviceInfo=${systemInfoJSON}`;
    const records = await fetch(gas);
    const data = await records.json();

    if (data.user.length === 0) {
      let headerText, bodyText;
      if (useApp === "line") {
        headerText = "ไม่พบข้อมูลของคุณในระบบ";
        bodyText = "กรุณาสมัครสมาชิกก่อนใช้งาน";
      } else if (useApp === "telegram") {
        headerText = "ไม่พบการเชื่อมต่อ Telegram";
        bodyText = "โปรด Login ด้วย Line ก่อน แล้วทำการ เชื่อมต่อ Telegram ที่เมนูหน้าลงเวลา";
      }else if (useApp === "google") {
        headerText = "ไม่พบการเชื่อมต่อ Google";
        bodyText = "โปรด Login ด้วย Line ก่อน แล้วทำการ เชื่อมต่อ Google ที่เมนูหน้าลงเวลา";
      }

      const result = await displaySwal(
        "error",
        headerText,
        bodyText,
        "ลองอีกครั้ง",
        "ยกเลิก",
        "สมัครสมาชิกใหม่"
      );

      if (result.isConfirmed) {
        main();
      }
      if (result.isDenied) {
        window.location.href = "register.html";
      }

      try {
        liff.closeWindow();
      } catch (error) {
        setTimeout(() => location.reload(), 500);
      }
    } else {
      localStorage.setItem("yourpic", yourPic);
      data.user.forEach(saveUserToLocalStorage);

      Swal.fire({
        icon: "success",
        title: "ลงชื่อเข้าใช้สำเร็จแล้ว",
        confirmButtonColor: "#0ef",
        allowOutsideClick: false,
      }).then(() => {
        window.location.href = "index.html";
      });
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ข้อผิดพลาด",
      text: "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่อีกครั้ง",
    });
  } finally {
    hideLoading();
  }
}


// ฟังก์ชัน getSystemInfo สำหรับ iOS
function getSystemInfo() {
  try {
    const systemInfo = {
      browser: {
        appName: navigator.appName,
        appVersion: navigator.appVersion,
        platform: navigator.platform,
        userAgent: navigator.userAgent,
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
      },
      internetConnection: {
        onLine: navigator.onLine,
        connection: navigator.connection ? {
          type: navigator.connection.type || "Unknown",
          effectiveType: navigator.connection.effectiveType || "Unknown",
          downlink: navigator.connection.downlink || "Unknown",
          rtt: navigator.connection.rtt || "Unknown"
        } : "Unknown",
      },
      device: {
        deviceMemory: navigator.deviceMemory || "Unknown",
        hardwareConcurrency: navigator.hardwareConcurrency || "Unknown",
        maxTouchPoints: navigator.maxTouchPoints || "Unknown",
      },
      geolocation: navigator.geolocation ? "Supported" : "Not supported",
      bluetooth: navigator.bluetooth ? "Supported" : "Unknown",
      mediaDevices: navigator.mediaDevices ? "Supported" : "Not supported",
      deviceOrientation: "Unknown",
      vibrate: "Unknown",
      storage: {
        localStorage: window.localStorage ? "Supported" : "Not supported",
        sessionStorage: window.sessionStorage ? "Supported" : "Not supported"
      }
    };
    
    // Extract device information from userAgent
    const userAgent = navigator.userAgent;
    let brand = "Unknown";
    let model = "Unknown";

    // Simple detection for popular devices and OS
    if (/iPhone/i.test(userAgent)) {
      brand = "Apple";
      model = "iPhone";
    } else if (/iPad/i.test(userAgent)) {
      brand = "Apple";
      model = "iPad";
    } else if (/Android/i.test(userAgent)) {
      brand = "Android";
      model = "Android Device";
    } else if (/Windows/i.test(userAgent)) {
      brand = "Microsoft";
      model = "Windows Device";
    } else if (/Macintosh/i.test(userAgent) || /Mac OS/i.test(userAgent)) {
      brand = "Apple";
      model = "Mac";
    }

    const deviceName = navigator.platform || "Unknown Device";

    if (systemInfo && Object.keys(systemInfo).length > 0) {
      Swal.fire({
        icon: "success",
        title: `รับค่าอุปกรณ์ ${brand} ${model} สำเร็จ...`,
        showConfirmButton: false,
        timer: 2000,
        customClass: {
          title: "text-success"
        }
      });
      return systemInfo;
    } else {
      throw new Error("ข้อมูลอุปกรณ์ว่างเปล่า");
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ไม่สามารถรับค่าอุปกรณ์ได้",
      text: "กรุณารีเฟรชหน้าเว็บและลองใหม่อีกครั้ง",
      confirmButtonText: "ตกลง",
      confirmButtonColor: "#FF0000",
      allowOutsideClick: false
    });

    console.error("Error getting system info:", error);
    return null;
  }
}


// OAuth 2.0
let decodedClientId = atob('Njg5NzYxNTA5MS1yMnR1bzEzZjdnbmY5aXJqcWJidHQzdTFpY2lnaG1zdi5hcHBzLmdvb2dsZXVzZXJjb250ZW50LmNvbQ==');

// จัดการ Credential Response
async function handleCredentialResponse(response) {
    const user = decodeJwtResponse(response.credential);
    if (!user || !user.sub) {
        Swal.fire({
            title: "เกิดข้อผิดพลาด",
            text: "ไม่สามารถอ่านข้อมูลบัญชี Google ได้",
            icon: "error"
        });
        return;
    }
    let googleId = user.sub;
    let googleName = user.name;
    let googleEmail = user.email;
    let googlePicture = user.picture;

    console.log("Google ID:", googleId);
    console.log("Google Email:", googleEmail);
    
     const result = await Swal.fire({
      title: `ยินดีต้อนรับคุณ\n${googleName}`,
      html: `คุณต้องการเข้าสู่ระบบด้วยอีเมล์ ${googleEmail} หรือไม่?`,
      imageUrl: googlePicture,
      imageWidth: 150,
      imageHeight: 150,
      imageAlt: "User Photo",
      showCancelButton: true,
      confirmButtonText: "ยืนยัน",
      cancelButtonText: "ยกเลิก",
      confirmButtonColor: "#24A1DE",
      cancelButtonColor: "#d33",
      allowOutsideClick: false,
    });

    if (result.isConfirmed) {
      await getMember(googleId, googlePicture, googleName, "google");
    } else {
      Swal.fire({
        icon: "info",
        title: "คุณเลือกยกเลิกการเข้าสู่ระบบ",
        confirmButtonColor: "#0ef",
      });
    }
  }

// ฟังก์ชันแปลง JWT Token
function decodeJwtResponse(token) {
    try {
        let base64Url = token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        while (base64.length % 4 !== 0) {
            base64 += '=';
        }
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
            '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
        ).join(''));
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
        callback: handleCredentialResponse
    });
};

// แสดงปุ่มล็อกอิน Google ด้วย Swal
function googleLogin() {
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
        }
    });
}

function keylogin() {
  Swal.fire({
    title: "คุณต้องการเข้าสู่ระบบด้วยรหัสหรือไม่?",
    text: "กรุณาติดต่อนักพัฒนาระบบเพื่อขอรับรหัสเข้าสู่ระบบ",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ใช่, ดำเนินการต่อ",
    cancelButtonText: "ยกเลิก",
    confirmButtonColor: "#0d6efd",
    cancelButtonColor: "#6c757d",
    allowOutsideClick: false
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "userloginbydev.html";
    }
  });
}
