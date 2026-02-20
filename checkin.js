let map;
let watchId = null;

async function getLocation() {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          stopLocationTracking(); // หยุดเมื่อได้พิกัด

          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
              const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 1500,
            timerProgressBar: true,
            didOpen: (toast) => {
              toast.onmouseenter = Swal.stopTimer;
              toast.onmouseleave = Swal.resumeTimer;
            }
          });
          Toast.fire({
            icon: "success",
            title: "พร้อม"
          });
          checkRetryParams();
          alertUpdate();
        },
        (error) => {
          stopLocationTracking();
          reject(error);
          alertUpdate();
          showError(error);
        }
      );
    } else {
      stopLocationTracking();
      Swal.fire({
        icon: "error",
        title: "ไม่รองรับ Geolocation",
        text: "เบราว์เซอร์ของคุณไม่รองรับการใช้งาน Geolocation กรุณาอัปเดตเบราว์เซอร์หรือใช้อุปกรณ์อื่น",
        footer:
          '<a href="https://www.google.com/chrome/" target="_blank">คลิกที่นี่เพื่อดาวน์โหลด Chrome</a>',
      });

      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
}

// ฟังก์ชันหยุดการรับค่าพิกัด
function stopLocationTracking() {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId);
    watchId = null;
  }
}

function showError(error) {
  let title = "เกิดข้อผิดพลาด";
  let text = "ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง";
  let footer = "";

  switch (error.code) {
    case error.PERMISSION_DENIED:
      title = "การขออนุญาตถูกปฏิเสธ";
      text =
        "ดูเหมือนว่าคุณปฏิเสธการให้สิทธิ์ในการเข้าถึงตำแหน่งของคุณ กรุณาเปิดการอนุญาตเพื่อให้สามารถใช้งานฟังก์ชันนี้ได้";
      break;
    case error.POSITION_UNAVAILABLE:
      title = "ไม่สามารถเข้าถึงข้อมูลตำแหน่ง";
      text = "ข้อมูลตำแหน่งไม่พร้อมใช้งานในขณะนี้ กรุณาลองใหม่อีกครั้ง";
      break;
    case error.TIMEOUT:
      title = "หมดเวลาในการขอข้อมูล";
      text = "การร้องขอใช้เวลานานเกินไป กรุณาลองใหม่อีกครั้ง";
      break;
    case error.UNKNOWN_ERROR:
      title = "เกิดข้อผิดพลาดที่ไม่คาดคิด";
      text =
        "ไม่สามารถระบุข้อผิดพลาดได้ ขออภัยในความไม่สะดวก กรุณาลองใหม่อีกครั้ง";
      break;
  }

  Swal.fire({
    icon: "error",
    title,
    text,
    footer,
    showCancelButton: true,
    showDenyButton: true,
    confirmButtonText: "ลองใหม่",
    denyButtonText: "ใช้ค่าเดิม",
    cancelButtonText: "สแกน QR Code",
    allowOutsideClick: false,
  }).then((result) => {
    if (result.isConfirmed) {
      location.reload();
    } else if (result.dismiss === Swal.DismissReason.cancel) {
      // เปิดแท็บ #srqrcode
      const srTab = document.querySelector('[data-bs-target="#srqrcode"]');
      if (srTab) {
        srTab.click(); // คลิกแท็บให้เหมือนผู้ใช้กด
      }
    }
  });
}

async function initializeMap(
  lat,
  lon,
  destinationLat,
  destinationLon,
  officer
) {
  // สร้างแผนที่ใหม่
  map = L.map("map").setView([lat, lon], 11);

  // เพิ่มแผนที่พื้นฐาน 
// ✅ 1. OpenStreetMap (OSM)
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
});

// ✅ 2. OpenTopoMap
var opentopomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenTopoMap contributors',
  maxZoom: 17
});

// ✅ 3. Google Maps
var googleMaps = L.tileLayer('https://mt1.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
  attribution: '&copy; Google Maps'
});

// ✅ 4. CartoDB (Light)
var cartoLight = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
  attribution: '&copy; CartoDB'
});

// ✅ 5. ESRI World Imagery
var esriImagery = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
  attribution: '&copy; Esri & NASA'
});

// 📌 เลเยอร์แผนที่หลัก
var baseMaps = {
  "ค่าเริ่มต้น": osm,
  "แผนที่ภูมิประเทศ": opentopomap,
  "แผนที่กูเกิล": googleMaps,
  "แผนที่สว่าง": cartoLight,
  "ภาพถ่ายดาวเทียม": esriImagery
};

// ✅ เช็คว่าใน localStorage มีการบันทึกแผนที่ที่เลือกหรือไม่
var savedMap = localStorage.getItem('selectedMap');

// ✅ ถ้ามีการเลือกแผนที่ก่อนหน้านี้ และชื่อแผนที่นั้นมีอยู่จริงใน baseMaps
if (savedMap && baseMaps[savedMap]) {
    baseMaps[savedMap].addTo(map);
} else {
    // หากไม่มีการเลือกแผนที่ หรือชื่อไม่ตรง ให้ใช้ค่าเริ่มต้น
    osm.addTo(map);
}

// 📌 เมนูเลือกแผนที่
L.control.layers(baseMaps).addTo(map);

     // ฟังก์ชันสำหรับบันทึกแผนที่ที่เลือกใน localStorage
     map.on('baselayerchange', function(e) {
      var selectedMap = e.name;
      localStorage.setItem('selectedMap', selectedMap);
  });
  
  const userLatLng = L.latLng(lat, lon);
  const destinationLatLng = L.latLng(destinationLat, destinationLon);

  // คำนวณระยะทาง
  const distanceInMeters = userLatLng.distanceTo(destinationLatLng);
  const distanceInKilometers = (distanceInMeters / 1000).toFixed(2);

  // โหลดและแสดงข้อมูล GeoJSON
 fetch("bk_health_centers.geojson")
 .then(response => response.json())
 .then(data => {

   // กรองเฉพาะข้อมูลของจังหวัดบึงกาฬ
   const buengKanDistricts = data.features.filter(
     f => f.properties.PROVCODE === "38"
   );

   // แสดงผลแต่ละจุดด้วย circleMarker
   L.geoJSON(buengKanDistricts, {
    pointToLayer: function (feature, latlng) {
      // กำหนดสีตาม TYPECODE
      let color = "#FF6600"; // สีเริ่มต้น (กรณี TYPECODE ไม่ตรงเงื่อนไขใด ๆ)

      switch (feature.properties.TYPECODE) {
        case "T1":
          color = "#800080"; // สำนักงานสาธารณสุขจังหวัด (สสจ.)
          break;
        case "T2":
          color = "#0000FF"; // สำนักงานสาธารณสุขอำเภอ (สสอ.)
          break;
        case "T3":
          color = "#1E90FF"; //  รพ.สต.
          break;
        case "T4":
          color = "#006400"; // โรงพยาบาลทั่วไป (รพท.)
          break;
        case "T5":
          color = "#006400"; //  โรงพยาบาลชุมชน (รพช.)
          break;
        case "T8":
          color = "#00FF00"; //  ศูนย์สุขภาพชุมชน / เรือนจำ
          break;
        default:
          color = "#999999"; //  กรณีไม่รู้ประเภท
      }
      
  
      return L.circleMarker(latlng, {
        radius: 8,
        fillColor: color,
        color: color,
        weight: 1,
        opacity: 1,
        fillOpacity: 0.7
      });
    },
    onEachFeature: function (feature, layer) {
           // พิกัดของหน่วยงาน
           const featureLat = feature.geometry.coordinates[1];
           const featureLon = feature.geometry.coordinates[0];
          const featureLatLng = L.latLng(
            featureLat,
            featureLon
          );
          const ggMapUrl = `https://www.google.co.th/maps/dir/${lat},${lon}/${featureLat},${featureLon}`;
          const appleMapUrl = `https://maps.apple.com/?saddr=${lat},${lon}&daddr=${featureLat},${featureLon}`;          
          
        // คำนวณระยะทาง
        const distanceMeters = userLatLng.distanceTo(featureLatLng);
        const distanceKm = (distanceMeters / 1000).toFixed(2);

       // แสดง popup
       layer.bindPopup(
        `<div class="popup-content">
          <p><i class="fa-solid fa-hospital"></i> <strong>${feature.properties.NAME}</strong> </p>
          <p><i class="fas fa-route"></i> ห่างจากคุณ: <strong> ${distanceKm}</strong> กม.</p>
          <p><i class="fa-solid fa-car"></i> นำทางด้วย<br>
            <a href="${ggMapUrl}" target="_blank">
              <i class="fa-solid fa-location-dot"></i> Google Maps
            </a> | 
            <a href="${appleMapUrl}" target="_blank">
              <i class="fa-brands fa-apple"></i> Apple Maps
            </a>
          </p>
        </div>`
      );
      
      
    }
  }).addTo(map);
  
  })   .catch(error => {
    console.error("Error fetching GeoJSON data:", error);
  });

  // เพิ่มวงกลมแสดงรัศมี
  L.circle([destinationLat, destinationLon], {
    color: "green",
    fillColor: "#0f0",
    fillOpacity: 0.2,
    radius: 10000,
  })
    .addTo(map)
    .bindPopup("รัศมี 10 กิโลเมตร จากหน่วยงานของคุณ");

  // เพิ่ม Marker แสดงตำแหน่งปลายทาง
  L.marker([destinationLat, destinationLon])
    .addTo(map)
    .bindPopup(`${officer}`)
    .openPopup();

  // เพิ่ม Marker แสดงตำแหน่งผู้ใช้
  L.marker([lat, lon])
    .addTo(map)
    .bindPopup(
      `<b>ตำแหน่งของคุณ</b><br>ระยะห่างจากปลายทาง: ${distanceInKilometers} กิโลเมตร`
    )
    .openPopup();

  // เพิ่มเส้นเชื่อมระหว่างตำแหน่งผู้ใช้และปลายทาง
  const latlngs = [
    [lat, lon],
    [destinationLat, destinationLon],
  ];
  L.polyline(latlngs, { color: "blue" })
    .addTo(map)
    .bindPopup(
      `
    <b>ตำแหน่งของคุณ</b><br>
    ระยะห่างจาก ${officer} : ${distanceInKilometers} กิโลเมตร
  `
    )
    .openPopup();

    function calculateAQI(pm25) {
      if (pm25 <= 25) {
        return {
          aqi: Math.round((25 / 25) * pm25),
          level: "ดีมาก",
          color: "#007FFE",
        }; // ฟ้า
      } else if (pm25 <= 37) {
        return {
          aqi: Math.round(((50 - 26) / (37 - 26)) * (pm25 - 26) + 26),
          level: "ดี",
          color: "#008000",
        }; // เขียว
      } else if (pm25 <= 50) {
        return {
          aqi: Math.round(((100 - 51) / (50 - 38)) * (pm25 - 38) + 51),
          level: "ปานกลาง",
          color: "#C09200",
        }; // เหลือง
      } else if (pm25 <= 90) {
        return {
          aqi: Math.round(((200 - 101) / (90 - 51)) * (pm25 - 51) + 101),
          level: "มีผลกระทบต่อสุขภาพ",
          color: "#E2543C",
        }; // ส้ม
      } else if (pm25 <= 150) {
        return {
          aqi: Math.round(((300 - 201) / (150 - 91)) * (pm25 - 91) + 201),
          level: "อันตราย",
          color: "#FF0000",
        }; // แดง
      } else if (pm25 <= 250) {
        return {
          aqi: Math.round(((400 - 301) / (250 - 151)) * (pm25 - 151) + 301),
          level: "อันตรายมาก",
          color: "#800000",
        }; // น้ำตาล
      } else {
        return {
          aqi: Math.round(((500 - 401) / (pm25 - 251)) * (pm25 - 251) + 401),
          level: "อันตรายถึงชีวิต",
          color: "#660000",
        }; // ม่วงเข้ม
      }
    }
    

  function getTemperatureLevel(temp) {
    if (temp >= 45) {
      return { level: "ร้อนจัดมาก", color: "#8B0000" }; // Very Extremely Hot (แดงเข้มมาก)
    } else if (temp >= 40) {
      return { level: "ร้อนจัด", color: "#B22222" }; // Very Hot (แดงเข้ม)
    } else if (temp >= 37) {
      return { level: "ร้อนมาก", color: "#FF4500" }; // Extremely Hot (แดงส้มเข้ม)
    } else if (temp >= 35) {
      return { level: "ร้อน", color: "#FF8C00" }; // Hot (ส้มเข้ม)
    } else if (temp >= 30) {
      return { level: "ค่อนข้างร้อน", color: "#FFA500" }; // Warm (ส้ม)
    } else if (temp >= 23) {
      return { level: "ปกติ", color: "#228B22" }; // Normal (เขียวเข้ม)
    } else if (temp >= 20) {
      return { level: "เย็นสบาย", color: "#32CD32" }; // Pleasantly Cool (เขียวสด)
    } else if (temp >= 18) {
      return { level: "เย็น", color: "#1E90FF" }; // Cool (ฟ้าเข้ม)
    } else if (temp >= 16) {
      return { level: "ค่อนข้างหนาว", color: "#4682B4" }; // Moderately Cold (ฟ้าเข้มขึ้น)
    } else if (temp >= 8) {
      return { level: "หนาว", color: "#00008B" }; // Cold (น้ำเงินเข้ม)
    } else if (temp >= 5) {
      return { level: "หนาวจัด", color: "#800080" }; // Very Cold (ม่วงเข้ม)
    } else {
      return { level: "หนาวจัดมาก", color: "#4B0082" }; // Extremely Cold (ม่วงน้ำเงินเข้มมาก)
    }
  }

  try {
    const apiKey = "639b4c8c49d8ae3d835971a444856be5";
    const weatherUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=th`;
    const airQualityUrl = `https://api.openweathermap.org/data/2.5/air_pollution?lat=${lat}&lon=${lon}&appid=${apiKey}`;

    // Fetch weather data
    const weatherResponse = await fetch(weatherUrl);
    const weatherData = await weatherResponse.json();

    // Fetch air quality data
    const airQualityResponse = await fetch(airQualityUrl);
    const airQualityData = await airQualityResponse.json();

    const weatherDescription = weatherData.weather[0].description;
    const weatherIcon = weatherData.weather[0].icon;
    const weatherTemp = weatherData.main.temp;
    const weatherName = weatherData.name;
    const weatherImageUrl = `https://openweathermap.org/img/wn/${weatherIcon}.png`;

    const pm25 = airQualityData.list[0].components.pm2_5;
    const { aqi, level: aqiLevel, color: aqiColor } = calculateAQI(pm25);
    const { level: tempLevel, color: tempColor } =
      getTemperatureLevel(weatherTemp);

    const googleMapUrl = `https://www.google.co.th/maps/dir/${destinationLat},${destinationLon}/${lat},${lon}`;

    // Add weather, AQI, and PM2.5 information in user location popup
    L.marker([lat, lon])
      .addTo(map)
      .bindPopup(
        `
        <div class="popup-content">
        <b><i class="fas fa-map-marker-alt"></i> ตำแหน่งของคุณ</b><br>
        <a href="${googleMapUrl}" target="_blank"><i class="fas fa-location-arrow"></i> ${lat}, ${lon}</a><br>
        
        <span class="secondary-text">
          <i class="fas fa-route"></i> ระยะห่างจาก ${officer}: <b>${distanceInKilometers}</b> กิโลเมตร
        </span><br>
      
        <img src="${weatherImageUrl}" alt="Weather Icon"><br>
        
        <span class="weather-info">
          <i class="fas fa-city"></i> ${weatherName}, 
          <i class="fas fa-thermometer-half"></i> อุณหภูมิ: ${weatherTemp}°C
        </span>
        <span style="color: ${tempColor};"><b>(${tempLevel})</b></span><br>
      
        <span class="secondary-text">
          <i class="fas fa-cloud-sun"></i> สภาพอากาศ: ${weatherDescription}
        </span><br>
      
        <span class="secondary-text">
          <i class="fas fa-smog"></i> PM2.5: ${pm25} µg/m³
        </span><br>
      
        <span class="secondary-text">
          <i class="fas fa-wind"></i> AQI: 
          <span class="aqi" style="color: ${aqiColor};">${aqi} (${aqiLevel})</span>
        </span>
      </div>
      
      `
      )
      .openPopup();
  } catch (error) {
    console.error("Error fetching weather or air quality data: ", error);
  }
}

/* ================== ตัวช่วยอ่านตัวเลขจาก localStorage ================== */
function getNumber(key) {
  const value = localStorage.getItem(key);
  return value !== null ? Number(value) : NaN;
}

/* ================== ดึงพิกัดปัจจุบัน (GPS → fallback localStorage) ================== */
async function getCurrentLatLon() {
  try {
    const location = await getLocation(); // ต้องมีอยู่แล้วในระบบคุณ
    const lat = Number(location.latitude);
    const lon = Number(location.longitude);

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error("พิกัด GPS ไม่ถูกต้อง");
    }

    localStorage.setItem("mylat", lat);
    localStorage.setItem("mylon", lon);
    console.log("📍 ใช้พิกัดจาก GPS");

    return { lat, lon };

  } catch (error) {
    console.warn("⚠️ GPS ใช้งานไม่ได้ → ใช้ localStorage");

    const lat = getNumber("mylat");
    const lon = getNumber("mylon");

    if (isNaN(lat) || isNaN(lon)) {
      throw new Error("ไม่มีพิกัดสำรองใน localStorage");
    }

    console.log("📦 ใช้พิกัดจาก localStorage");
    return { lat, lon };
  }
}

/* ================== ป้องกันเรียกซ้ำ ================== */
let mapLoading = false;

/* ================== ฟังก์ชันหลัก ================== */
async function checkonmap() {
  if (mapLoading) return;
  mapLoading = true;

  const mapContainer = document.getElementById("map");
  if (!mapContainer) {
    mapLoading = false;
    return;
  }

  // แสดง Loading
  mapContainer.innerHTML = "";
  const loadingText = document.createElement("p");
  loadingText.textContent = "กำลังโหลดแผนที่...";
  loadingText.style.textAlign = "center";
  loadingText.style.color = "blue";
  mapContainer.appendChild(loadingText);

  try {
    // ===== 1) พิกัดปัจจุบัน =====
    const { lat, lon } = await getCurrentLatLon();

    // ===== 2) พิกัดหน่วยงาน =====
    const destinationLat = getNumber("oflat");
    const destinationLon = getNumber("oflong");
    const officer = localStorage.getItem("office") || "หน่วยงาน";

    if (isNaN(destinationLat) || isNaN(destinationLon)) {
      throw new Error("พิกัดหน่วยงานไม่ถูกต้อง");
    }

    // ลบ loading
    loadingText.remove();

    // ===== 3) แสดงแผนที่ =====
    displayLatLon(lat, lon); // ฟังก์ชันของคุณ
    initializeMap(
      lat,
      lon,
      destinationLat,
      destinationLon,
      officer
    );

  } catch (error) {
    console.error("❌ โหลดแผนที่ล้มเหลว:", error);

    mapContainer.innerHTML = `
      <p style="text-align:center; color:red;">
        ไม่สามารถโหลดแผนที่ได้<br>
        <small>${error.message}</small>
      </p>
    `;
  } finally {
    mapLoading = false;
  }
}

/* ================== เรียกใช้งาน ================== */
checkonmap();


function refreshMap() {
  const mainContent = document.getElementById("mainContent");
  const showHideButton = document.getElementById("showHide");

  // Check if mainContent is collapsed
  const isCollapsed = mainContent.classList.contains("collapsed");

  if (isCollapsed) {
    // If collapsed, show the content and change button text
    mainContent.classList.remove("collapsed"); // Show the content
    showHideButton.textContent = "ย่อ"; // Change button text to 'Hide'

    // Update localStorage with the new state
    localStorage.setItem("containerCollapsed", "false");

    // Call checkonmap() to reload the map if shown
    if (map) {
      map.remove(); // Properly remove the existing map instance
    }
    checkonmap();
  } else {
    // If not collapsed, refresh the map properly
    if (map) {
      map.remove(); // Remove the old map
    }
    checkonmap(); // Reinitialize the map
  }
}

function displayLatLon(lat, lon) {
  // Set the values to the hidden input fields
  document.getElementById("llat").value = lat;
  document.getElementById("llon").value = lon;
}

// in-out-old
// async function checkin() {
//   let latitude = document.querySelector("#llat").value;
//   let longitude = document.querySelector("#llon").value;

//   if (!latitude || !longitude) {
//     Swal.fire({
//       icon: "warning",
//       title: "ขณะนี้ระบบกำลังรับค่าพิกัดจากอุปกรณ์",
//       html: 'กรุณาลองใหม่อีกครั้ง\nหากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้',
//       confirmButtonText: "ตกลง",
//       allowOutsideClick: false,
//       customClass: {
//         title: "text-warning",
//         content: "text-muted",
//         confirmButton: "btn btn-warning",
//       },
//     });
//     return; // Exit the function if required values are missing
//   }

//   Swal.fire({
//     title: "คุณต้องการบันทึกเวลาการปฏิบัติงานหรือไม่?",
//     html: "กรุณากดยืนยันเพื่อดำเนินการ",
//     showCancelButton: true,
//     confirmButtonText: "ยืนยัน",
//     cancelButtonText: "ยกเลิก",
//     allowOutsideClick: false,
//     cancelButtonColor: "#6F7378",
//     customClass: {
//       title: "text-success",
//       content: "text-muted",
//       confirmButton: "btn btn-success",
//     },
//     didOpen: async () => {
//       Swal.getConfirmButton().addEventListener("click", async () => {
//         await processCheckinOrCheckout("In", latitude, longitude);
//       });
//     },
//   });
// }

// async function checkout() {
//   let latitude = document.querySelector("#llat").value;
//   let longitude = document.querySelector("#llon").value;

//   if (!latitude || !longitude) {
//     Swal.fire({
//       icon: "warning",
//       title: "ขณะนี้ระบบกำลังรับค่าพิกัดจากอุปกรณ์",
//       html: 'กรุณาลองใหม่อีกครั้ง\nหากรับค่าพิกัดไม่ได้ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้',
//       confirmButtonText: "ตกลง",
//       allowOutsideClick: false,
//       customClass: {
//         title: "text-warning",
//         content: "text-muted",
//         confirmButton: "btn btn-warning",
//       },
//     });
//     return;
//   }

//   Swal.fire({
//     title: "คุณต้องการบันทึกเวลาการกลับหรือไม่?",
//     html: "กรุณากดยืนยันเพื่อดำเนินการ",
//     showCancelButton: true,
//     confirmButtonText: "ยืนยัน",
//     cancelButtonText: "ยกเลิก",
//     allowOutsideClick: false,
//     cancelButtonColor: "#6F7378",
//     customClass: {
//       title: "text-danger",
//       content: "text-muted",
//       confirmButton: "btn btn-danger",
//     },
//     didOpen: async () => {
//       Swal.getConfirmButton().addEventListener("click", async () => {
//         await processCheckinOrCheckout("Out", latitude, longitude);
//       });
//     },
//   });
// }

// in-out-new
async function checkin() {
  let latitude = document.querySelector("#llat").value;
  let longitude = document.querySelector("#llon").value;

  if (!latitude || !longitude) {
    Swal.fire({
      icon: "warning",
      title: "ขณะนี้ระบบกำลังรับค่าพิกัดจากอุปกรณ์",
      html: `<p>กรุณากดปุ่ม <strong> <i class="fa-solid fa-location-dot"></i> พิกัด </strong></p> <br><p>หากรับค่าพิกัดไม่ได้ ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้</p>`,
      confirmButtonText: "ตกลง",
      allowOutsideClick: false,
      customClass: {
        title: "text-warning",
        content: "text-muted",
        confirmButton: "btn btn-warning",
      },
    });
    return;
  }

  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes().toString().padStart(2, "0"); // ให้แสดงเลข 2 หลัก เช่น 05 แทน 5
  let currentTime = `${hour}:${minute}`;

  if (hour >= 0 && hour < 5) {
    Swal.fire({
      icon: "warning",
      title: `ขณะนี้เวลา ${currentTime} น.`,
      html: "ขณะนี้เป็นช่วงเวลากลางดึก ฟ้ายังมืดอยู่ 🌙<br>คุณแน่ใจหรือไม่ว่าต้องการดำเนินการต่อ?",
      showCancelButton: true,
      confirmButtonText: "ดำเนินการต่อ",
      cancelButtonText: "ยกเลิก",
      allowOutsideClick: false,
      cancelButtonColor: "#6F7378",
      customClass: {
        title: "text-danger",
        content: "text-muted",
        confirmButton: "btn btn-danger",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        showCheckinConfirmation(latitude, longitude);
      }
    });
  } else {
    showCheckinConfirmation(latitude, longitude);
  }
}

async function showCheckinConfirmation(latitude, longitude) {
  Swal.fire({
    title: "คุณต้องการบันทึกเวลาการปฏิบัติงานหรือไม่?",
    html: "กรุณากดยืนยันเพื่อดำเนินการ",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
    cancelButtonColor: "#6F7378",
    customClass: {
      title: "text-success",
      content: "text-muted",
      confirmButton: "btn btn-success",
    },
    didOpen: async () => {
      Swal.getConfirmButton().addEventListener("click", async () => {
        await processCheckinOrCheckout("In", latitude, longitude);
      });
    },
  });
}


async function checkout() {
  let latitude = document.querySelector("#llat").value;
  let longitude = document.querySelector("#llon").value;

  if (!latitude || !longitude) {
    Swal.fire({
      icon: "warning",
      title: "ขณะนี้ระบบกำลังรับค่าพิกัดจากอุปกรณ์",
      html: `<p>กรุณากดปุ่ม <strong> <i class="fa-solid fa-location-dot"></i> พิกัด </strong></p> <br><p>หากรับค่าพิกัดไม่ได้ ท่านสามารถแสกน QR-code จากหัวหน้าของคุณได้</p>`,
      confirmButtonText: "ตกลง",
      allowOutsideClick: false,
      customClass: {
        title: "text-warning",
        content: "text-muted",
        confirmButton: "btn btn-warning",
      },
    });
    return;
  }

  let now = new Date();
  let hour = now.getHours();
  let minute = now.getMinutes().toString().padStart(2, "0");
  let currentTime = `${hour}:${minute}`;

  if (hour >= 19 && hour <= 23) {
    Swal.fire({
      icon: "info",
      title: `ขณะนี้เวลา ${currentTime} น.`,
      html: "ขณะนี้เป็นช่วงเวลาค่ำ ฟ้ามืดแล้ว 🌙<br>คุณต้องการบันทึกเวลาการกลับตอนนี้หรือไม่?",
      showCancelButton: true,
      confirmButtonText: "ดำเนินการต่อ",
      cancelButtonText: "ยกเลิก",
      allowOutsideClick: false,
      cancelButtonColor: "#6F7378",
      customClass: {
        title: "text-primary",
        content: "text-muted",
        confirmButton: "btn btn-primary",
      },
    }).then((result) => {
      if (result.isConfirmed) {
        showCheckoutConfirmation(latitude, longitude);
      }
    });
  } else {
    showCheckoutConfirmation(latitude, longitude);
  }
}

async function showCheckoutConfirmation(latitude, longitude) {
  Swal.fire({
    title: "คุณต้องการบันทึกเวลาการกลับหรือไม่?",
    html: "กรุณากดยืนยันเพื่อดำเนินการ",
    showCancelButton: true,
    confirmButtonText: "ยืนยัน",
    cancelButtonText: "ยกเลิก",
    allowOutsideClick: false,
    cancelButtonColor: "#6F7378",
    customClass: {
      title: "text-danger",
      content: "text-muted",
      confirmButton: "btn btn-danger",
    },
    didOpen: async () => {
      Swal.getConfirmButton().addEventListener("click", async () => {
        await processCheckinOrCheckout("Out", latitude, longitude);
      });
    },
  });
}

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

// ฟังก์ชันที่ใช้สำหรับการลงเวลา

// async function processCheckinOrCheckout(ctype, latitude, longitude, staff) {
//   try {
//     // ตรวจสอบว่า localStorage มีข้อมูลครบถ้วนหรือไม่
//     const uuid = localStorage.getItem("uuid");
//     const cidhash = localStorage.getItem("cidhash");
//     const userid = localStorage.getItem("userid");
//     const name = localStorage.getItem("name");
//     const mainsub = localStorage.getItem("mainsub");
//     const office = localStorage.getItem("office");
//     const latx = localStorage.getItem("oflat");
//     const longx = localStorage.getItem("oflong");
//     const db1 = localStorage.getItem("db1");
//     const token = localStorage.getItem("token");
//     const docno = localStorage.getItem("docno");
//     const job = localStorage.getItem("job");
//     const boss = localStorage.getItem("boss");
//     const ceo = localStorage.getItem("ceo");
//     const refid = localStorage.getItem("refid");
//     const chatId = localStorage.getItem("chatId");

//     if (!refid || !cidhash || !userid || !name) {
//       throw new Error(
//         "ไม่พบข้อมูลที่จำเป็นในการลงเวลา กรุณาลองใหม่หรือลงชื่อออกแล้วเข้าสู่ระบบใหม่"
//       );
//     }

//     const secureCode = await generateSecureCode();
//     let typea = document.querySelector("#typea").value || "ปกติ";
//     let nte =
//       document.querySelector("#otherDetails").value ||
//       (typeof staff !== "undefined" ? staff : "");

//     if (typea === "อื่นๆ" && !nte) {
//       throw new Error("อื่นๆ โปรดระบุ");
//     }

//     let todays = new Date();
//     todays.toLocaleString("th-TH", { timeZone: "Asia/Bangkok" });
//     let todayx = todays.toLocaleTimeString("th-TH");

//     let swalTimers = []; // เก็บ setTimeout

//     // เริ่ม Swal แสดงข้อความระหว่างรอ
//     Swal.fire({
//       html: `<i class="fas fa-user-shield fa-2x text-primary mb-2"></i><br>กำลังยืนยันตัวตนของคุณ`,
//       allowOutsideClick: false,
//       showConfirmButton: false,
//       didOpen: () => {
//         Swal.showLoading();

//         // เพิ่มข้อความขั้นตอนแบบต่อเนื่อง
//         swalTimers.push(
//           setTimeout(() => {
//             Swal.update({
//               html: `<i class="fas fa-server fa-2x text-secondary mb-2"></i><br>กำลังเชื่อมต่อกับเซิร์ฟเวอร์`,
//             });
//             Swal.showLoading();

//             swalTimers.push(
//               setTimeout(() => {
//                 Swal.update({
//                   html: `<i class="fas fa-network-wired fa-2x text-warning mb-2"></i><br>ขณะนี้ระบบทำงานช้า<br>(ระบบกำลังสลับไปยังเซิร์ฟเวอร์สำรอง)`,
//                 });
//                 Swal.showLoading();

//                 swalTimers.push(
//                   setTimeout(() => {
//                     Swal.update({
//                       html: `<i class="fas fa-database fa-2x text-success mb-2"></i><br>กำลังบันทึกข้อมูล...`,
//                     });
//                     Swal.showLoading();

//                     swalTimers.push(
//                       setTimeout(() => {
//                         Swal.update({
//                           html: `<i class="fas fa-reply fa-2x text-info mb-2"></i><br>ระบบกำลังตอบกลับจากเซิร์ฟเวอร์`,
//                         });
//                         Swal.showLoading();

//                         swalTimers.push(
//                           setTimeout(() => {
//                             Swal.update({
//                               html: `<i class="fas fa-hourglass-half fa-2x text-warning mb-2"></i><br>ดำเนินการใกล้เสร็จสิ้น<br>กรุณารอสักครู่`,
//                             });
//                             Swal.showLoading();
//                           }, 3000)
//                         );
//                       }, 3000)
//                     );
//                   }, 3000)
//                 );
//               }, 5000)
//             );
//           }, 2000)
//         );
//       },
//     });

//     // เลือก URL ตามค่า db1
//     let url;
//     if (db1 === "bkn01") {
//       url =
//         "https://script.google.com/macros/s/AKfycbzqlvr7DeGl7rOB5hGVSMnUKdTAo3ddudvxzv4xNWgSq-rrnvgP-3EodZQ1iIUdXsfz/exec";
//     } else if (db1 === "sk01") {
//       url =
//         "https://script.google.com/macros/s/AKfycbwUVnQTg9Zfk-wf9sZ4u21CvI3ozfrp3hoM0Dhs6J5a3YDEQQ8vkaz61I-mTmfBtXWuLA/exec";
//     } else {
//       url =
//         "https://script.google.com/macros/s/AKfycbwBXn6VhbTiN2eOvwZudXXd1ngEu3ONwAAVSnNG1VsXthQqBGENRloS6zU_34SqRLsH/exec";
//     }

//     console.log(
//       `${url}?ctype=${ctype}&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&token=${token}&job=${job}&docno=${docno}&secureCode=${secureCode}&chatId=${chatId}`
//     );


    
//     const response = await fetch(
//       `${url}?ctype=${ctype}&uuid=${uuid}&cidhash=${cidhash}&userid=${userid}&name=${name}&mainsub=${mainsub}&office=${office}&latx=${latx}&longx=${longx}&db1=${db1}&boss=${boss}&ceo=${ceo}&lat=${latitude}&long=${longitude}&typea=${typea}&nte=${nte}&stampx=${todayx}&refid=${refid}&token=${token}&job=${job}&docno=${docno}&secureCode=${secureCode}&chatId=${chatId}`
//     );

//     if (!response.ok) {
//       throw new Error(`Failed to process: ${response.statusText}`);
//     }

//     // แปลงข้อมูลที่ได้รับจาก API
//     const data = await response.json();

//     // ตรวจสอบข้อมูลใน data.res และแสดง Swal
//     data.res.forEach((datas) => {
//       // ปิดการแสดงสถานะการโหลด
//       // ✅ เคลียร์ timeout ทุกอันหลัง fetch เสร็จ
//       swalTimers.forEach((t) => clearTimeout(t));
//       swalTimers = [];
//       Swal.close();

//       let iconx = datas.icon;
//       let header = datas.header;
//       let text = datas.text;

//       Swal.fire({
//         icon: iconx || "success", // ใช้ icon ที่ได้รับจาก API ถ้ามี หรือใช้ "success" เป็นค่าเริ่มต้น
//         title: header,
//         html: data.message || text,
//         confirmButtonText: "ตกลง",
//         allowOutsideClick: false,
//         customClass: {
//           title:
//             iconx === "success"
//               ? "text-success"
//               : iconx === "error"
//               ? "text-danger"
//               : iconx === "warning"
//               ? "text-warning"
//               : "text-info",
//           content: "text-muted",
//           confirmButton:
//             iconx === "success"
//               ? "btn btn-success"
//               : iconx === "error"
//               ? "btn btn-danger"
//               : iconx === "warning"
//               ? "btn btn-warning"
//               : "btn btn-info",
//         },
//       }).then((result) => {
//         if (result.isConfirmed) {
//           const cktoday = new Date();
//           const ckfd = cktoday.toLocaleDateString("th-TH");
//           const hours = cktoday.getHours().toString().padStart(2, "0");
//           const minutes = cktoday.getMinutes().toString().padStart(2, "0");
//           const seconds = cktoday.getSeconds().toString().padStart(2, "0");
//           const ckfdtime = `${hours}:${minutes}:${seconds}`;

//           if (iconx === "success" && ctype === "In") {
//             localStorage.setItem("datecheck", ckfd);
//             localStorage.setItem("datetimecheck", ckfdtime);
//           } else if (
//             (iconx === "info" && ctype === "Out") ||
//             (iconx === "success" && ctype === "Out") ||
//             (iconx === "warning" && ctype === "Out")
//           ) {
//             localStorage.setItem("datecheck", ckfd);
//             localStorage.setItem("datecheckout", ckfd);
//             localStorage.setItem("datetimecheckout", ckfdtime);
//           }

//           try {
//             window.close();
//             liff.closeWindow();
//           } catch (error) {
//             console.error("Failed to close window, refreshing...");
//             window.location.reload();
//           }

//           setTimeout(() => {
//             location.reload();
//           }, 500);
//         }
//       });
//     });
//   } catch (error) {
//     swalTimers.forEach((t) => clearTimeout(t));
//     swalTimers = [];
//     Swal.close();

//     Swal.fire({
//       icon: "error",
//       title: "เกิดข้อผิดพลาด",
//       html: error.message || error,
//       confirmButtonText: "ตกลง",
//     });
//   } finally {
//     // ดำเนินการเมื่อเสร็จสิ้น
//   }
// }

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
  const { icon: iconx, header, text, timeOnly } = datas;

  Swal.fire({
    icon: iconx || "success", // ใช้ icon จาก API หรือ default เป็น success
    title: header,
    html: datas.message || text,
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
    if (!result.isConfirmed) return;

    const cktoday = new Date();
    const ckfd = cktoday.toLocaleDateString("th-TH");

    // จัดเก็บสถานะการเช็คเวลา
    const newEntry = { todayx, ctype, typea, nte, iconx, text };
    checkEntries.push(newEntry);
    saveCheckEntries();
    updateCheckReport();

    // จัดการ localStorage ตามประเภทและไอคอน
    if (iconx === "success" && ctype === "In") {
      localStorage.setItem("datecheck", ckfd);
      localStorage.setItem("datetimecheck", timeOnly);
      localStorage.removeItem("pendingRetryParams");
      localStorage.removeItem("checkRetryCount");
    } else if (["info", "success", "warning"].includes(iconx) && ctype === "Out") {
      localStorage.setItem("datecheck", ckfd);
      localStorage.setItem("datecheckout", ckfd);
      localStorage.setItem("datetimecheckout", timeOnly);
      localStorage.removeItem("pendingRetryParams");
      localStorage.removeItem("checkRetryCount");
    }

    // ส่งรายงานวันหยุดถ้าเป็น In + วันหยุด
    try {
      if (iconx === "success" && typea === "วันหยุด") {
        sendOffDayReport( ctype, uuid, cidhash, userid, name, mainsub, office, latx, longx, db1,
        boss, ceo, latitude, longitude, typea, nte,  todayx,
        refid, token, job, docno, secureCode, chatId);
      } else {
        window.close();
        liff.closeWindow();
      }
    } catch {
      window.location.reload();
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



function checkinfo() {
  let today = new Date();
  let formattedToday = today.toLocaleDateString("th-TH");

  let dateCheck = localStorage.getItem("datecheck");
  let timeCheck = localStorage.getItem("datetimecheck");
  let dateCheckout = localStorage.getItem("datecheckout");
  let timeCheckout = localStorage.getItem("datetimecheckout");

  if (
    (formattedToday === dateCheck && !dateCheckout) ||
    (formattedToday === dateCheck && formattedToday !== dateCheckout)
  ) {
    // Case: User has checked in but not yet checked out
    Swal.fire({
      title: "การลงเวลามาปฏิบัติงาน",
      html:
        "ท่านได้ลงเวลาปฏิบัติงานในวันที่ <strong>" +
        dateCheck +
        "</strong> เวลา <strong>" +
        timeCheck +
        " น.</strong> เรียบร้อยแล้ว",
      icon: "info",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-primary",
        content: "text-muted",
        confirmButton: "btn btn-primary",
      },
    });
  } else if (formattedToday === dateCheck && formattedToday === dateCheckout) {
    // Case: User has checked in and out
    Swal.fire({
      title: "การลงเวลาปฏิบัติงาน",
      html:
        "ท่านได้ลงเวลาปฏิบัติงานในวันที่ <strong>" +
        dateCheck +
        "</strong> เวลา <strong>" +
        timeCheck +
        " น.</strong> และได้ลงเวลาสิ้นสุดการปฏิบัติงานในเวลา <strong>" +
        timeCheckout +
        " น.</strong> เรียบร้อยแล้ว",
      icon: "success",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-success",
        content: "text-muted",
        confirmButton: "btn btn-success",
      },
    });
  } else if (
    (formattedToday != dateCheck && formattedToday === dateCheckout) ||
    (!dateCheck && formattedToday === dateCheckout)
  ) {
    // Case: User has checked in and out
    Swal.fire({
      title: "การลงเวลาปฏิบัติงาน",
      html:
        "ท่านไม่ได้ลงบันทึกเวลาเข้ามาทำงานในวันที่ <strong>" +
        dateCheckout +
        "</strong> ระบบได้ส่งคำขอการบันทึกเวลาเข้ามาทำงานให้ท่านแล้ว โดยท่านได้ลงบันทึกเวลาเลิกงานเรียบร้อยแล้วในเวลา <strong>" +
        timeCheckout +
        " น.</strong>",
      icon: "warning",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-warning",
        content: "text-muted",
        confirmButton: "btn btn-warning",
      },
    });
  } else {
    Swal.fire({
      title: "ไม่พบการลงเวลาปฏิบัติงาน",
      html: "ไม่พบข้อมูลการลงเวลาในระบบหน้าบ้าน<br>กรุณาตรวจสอบในระบบหลังบ้าน",
      icon: "error",
      confirmButtonText: "ตกลง",
      showCloseButton: true,
      customClass: {
        title: "text-danger",
        content: "text-muted",
        confirmButton: "btn btn-danger",
      },
    }).then(() => {
      checktoday();
    });
  }
}



function alertUpdate() {
  // ตรวจสอบค่าใน local storage
  const logUpdate = localStorage.getItem("logUpdate");
 // console.log("logUpdate from localStorage:", logUpdate); // ตรวจสอบค่าใน console

  // หากค่า logUpdate ไม่เท่ากับ 1 หรือไม่มี logUpdate
  // if (logUpdate !== "1" || !logUpdate) {
  // //  console.log("ข้อมูลยังไม่ได้รับการอัปเดต"); // ตรวจสอบว่าผ่านเงื่อนไขนี้หรือไม่

  //   // แสดง Swal.fire
  //   Swal.fire({
  //     title: "แจ้งเตือนการปรับปรุง",
  //     html: `<div style="text-align: left;">
  //     <ol style="padding-left: 20px; line-height: 1.8;">
  //       <li>สามารถเปลี่ยนสีธีมได้ โดยกดปุ่ม <i class="fa-solid fa-sun"></i> ข้างปุ่ม <i class="fa-solid fa-bars"></i></li>
  //       <li>กำหนดภาพพื้นหลังได้ โดยกดปุ่ม <i class="fa-solid fa-bars"></i> เลือกเมนู <i class="fa-solid fa-gear"></i> ตั้งค่าภาพพื้นหลัง</li>
  //       <li>สามารถย่อหรือแสดงส่วนแสดงแผนที่ได้</li>
  //     </ol>
  //   </div>
    
  //   `,
  //     input: "checkbox", // ตัวเลือกแสดง checkbox
  //     inputPlaceholder: "ไม่ต้องแสดงอีก", // ข้อความใน input
  //     confirmButtonText: "รับทราบ",
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       // เมื่อผู้ใช้กดรับทราบ ให้บันทึกค่า logUpdate = 1
  //       if (result.value) {
  //         // ถ้าเลือกไม่ให้แสดงอีก
  //         localStorage.setItem("logUpdate", "1");
  //       //  console.log("logUpdate set to 1"); // ตรวจสอบว่าได้ตั้งค่าแล้ว
  //       }
  //     }
  //   });
  // }
}

// สร้าง QR-code
// ฟังก์ชันสร้าง QR Code
let qrVisible = false;
let qrCode = null;
let html5QrCode = new Html5Qrcode("reader");

function toggleQRCode() {
  const refid = localStorage.getItem("refid");
  const role = localStorage.getItem("role");
  if (role !== "ceo" && role !== "boss" && role !== "assure") {
    Swal.fire("ท่านไม่สามารถสร้าง QR-code ได้!", "สำหรับหัวหน้า ผู้อำนวยการ ผู้ช่วย ผู้บริหาร เท่านั้น!", "error");
    return;
  }
  let qrname = "";

  const now = new Date();
  const hours = now.getHours();
  const minutes = now.getMinutes();
  const ckDate = now.toLocaleDateString("th-TH");

  if ((hours === 0 && minutes >= 0) || hours < 8 || (hours === 8 && minutes <= 30)) {
    qrname = "In|" + refid + "|" + ckDate;
  } else if ((hours >= 8 && hours < 16) || (hours === 16 && minutes < 30)) {
    Swal.fire("นอกช่วงเวลา !", "ท่านไม่สามารถสร้าง QR-code ได้ ในช่วงเวลา 8.31 - 16.29 น. !", "error");
    return;
  } else {
    qrname = "Out|" + refid + "|" + ckDate;
  }

  let encodedQR = btoa(qrname);
  let qrDiv = document.getElementById("qrcode");
  let readerDiv = document.getElementById("reader");
  let button = document.getElementById("button-qr");

  if (!qrVisible) {
    qrDiv.style.display = "block";
    readerDiv.style.display = "none";
    stopScanner();

    if (!qrCode) {
      qrCode = new QRCode(qrDiv, {
        text: encodedQR,
        width: 200,
        height: 200,
      });
    }
    button.textContent = "ซ่อน QR Code";
  } else {
    qrDiv.style.display = "none";
    readerDiv.style.display = "block";
    button.textContent = "แสดง QR Code";
    startScan();
  }
  qrVisible = !qrVisible;
}

// ฟังก์ชันอ่าน QR Code
function startScan() {
  let readerDiv = document.getElementById("reader");
  readerDiv.style.display = "block";

  html5QrCode
    .start(
      { facingMode: "environment" },
      { fps: 10, qrbox: { width: 200, height: 200 } },
      onScanSuccess,
      onScanFailure
    )
    .catch(() => {
      Swal.fire({
        icon: "error",
        title: "ไม่สามารถเปิดกล้องได้",
        text: "โปรดตรวจสอบสิทธิ์การเข้าถึงกล้อง",
      });
    });
}

function stopScanner() {
  if (html5QrCode.isScanning) {
    html5QrCode.stop().then(() => {
      console.log("ปิดกล้องเรียบร้อย");
    }).catch(() => {
      Swal.fire({
        icon: "error",
        title: "เกิดข้อผิดพลาด",
        text: "ไม่สามารถปิดกล้องได้ โปรดลองใหม่",
      });
    });
  }
}

function isBase64(str) {
  try {
    return btoa(atob(str)) === str; // ตรวจสอบว่าเข้ารหัสแล้วกลับมาเหมือนเดิมไหม
  } catch (err) {
    return false; // ถ้าเกิด error แสดงว่าไม่ใช่ Base64
  }
}

function onScanSuccess(decodedText) {
  stopScanner();

  if (!isBase64(decodedText)) {
    Swal.fire({
      icon: "error",
      title: "ผิดพลาด!",
      html: 'QR Code ไม่ได้เข้ารหัส Base64',
      showDenyButton: true,
      confirmButtonText: "ปิด",
      denyButtonText: "สแกนใหม่",
      customClass: {
        title: "text-danger",
        content: "text-muted",
        confirmButton: "btn btn-danger",
        denyButton: "btn btn-primary",
      },
      footer: `ผลลัพธ์ : <a href="#">${decodedText}</a>`
    }).then((result) => {
      if (result.isDenied) {
        startScan();
      }
    });
    return;
  }

  try {
    const decodedBase64 = atob(decodedText);
    const splitStr = decodedBase64.split("|");

    if (splitStr.length < 3) {
      throw new Error("ข้อมูลไม่ครบถ้วน");
    }

    let part1 = splitStr[0];
    let part2 = splitStr[1];
    let part3 = splitStr[2];

    if (part1 !== 'In' && part1 !== 'Out') {
      Swal.fire({
        icon: "error",
        title: "ผิดพลาด!",
        html: 'รูปแบบไม่ถูกต้อง\n' + decodedBase64,
        showDenyButton: true,
        confirmButtonText: "ปิด",
        denyButtonText: "สแกนใหม่",
        customClass: {
          title: "text-danger",
          content: "text-muted",
          confirmButton: "btn btn-danger",
          denyButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isDenied) {
          startScan();
        }
      });
      return;
    }
  
    const boss = localStorage.getItem("boss");
    const ceo = localStorage.getItem("ceo");
   
    if (boss !== part2 && ceo !== part2) {

      Swal.fire({
        icon: "error",
        title: "รหัสหัวหน้าไม่ถูกต้อง!",
        html: "โปรดตรวจสอบหรือปรับปรุงข้อมูลการกำหนดหัวหน้า",
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "ปิด",
        denyButtonText: "สแกนใหม่",
        customClass: {
          title: "text-danger",
          content: "text-muted",
          confirmButton: "btn btn-danger",
          denyButton: "btn btn-primary",
        },
        footer: '<a href="https://wisanusenhom.github.io/sekatime/user.html">กำหนด หัวหน้า/ผู้อำนวยการ</a>'
      }).then((result) => {
        if (result.isConfirmed) {
         //
        } else if (result.isDenied) {
          startScan();
        }
      });

      return;
    }
  
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    let formattedToday = now.toLocaleDateString("th-TH");
  
    if (formattedToday !== part3) {
      Swal.fire({
        icon: "error",
        title: "ไม่ใช่วันที่ปัจจุบัน!",
        html: part3,
        showDenyButton: true,
        // showCancelButton: true,
        confirmButtonText: "ปิด",
        denyButtonText: "สแกนใหม่",
        customClass: {
          title: "text-danger",
          content: "text-muted",
          confirmButton: "btn btn-danger",
          denyButton: "btn btn-primary",
        },
      }).then((result) => {
        if (result.isConfirmed) {
         //
        } else if (result.isDenied) {
          startScan();
        }
      });
      return;
    }
  
    const latitude = localStorage.getItem("oflat");
    const longitude = localStorage.getItem("oflong");
    const ctype = part1;
    const staff = part2;
  
    if (part3 === localStorage.getItem("datecheck") || part3 === localStorage.getItem("datecheckout")) {
      checkinfo();  
    } else {
      if (((hours === 0 && minutes >= 0) || hours < 8 || (hours === 8 && minutes <= 30)) && part1 === 'In') {
        // มา
        Swal.fire({
          title: "คุณต้องการบันทึกเวลาการปฏิบัติงานหรือไม่?",
          html: "กรุณากดยืนยันเพื่อดำเนินการ",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ลงเวลามา",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-success",
            content: "text-muted",
            confirmButton: "btn btn-success",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            processCheckinOrCheckout(ctype, latitude, longitude,staff);
          } else if (result.isDenied) {
            startScan();
          }
        });
  
      } else if ((hours >= 8 && hours < 16) || (hours === 16 && minutes < 30)) {
          Swal.fire({
          icon: "warning",
          title: "โปรดยื่นคำขอลงเวลา",
          html: "อยู่ในช่วงเวลา 08:31 - 16:29 ไม่สามารถดำเนินการได้",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ยื่นคำขอ",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-success",
            content: "text-muted",
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "request.html";
          } else if (result.isDenied) {
            startScan();
          }
        });
      } else if (part1 === 'Out') {
        // กลับ
        Swal.fire({
          title: "คุณต้องการบันทึกเวลาการกลับหรือไม่?",
          html: "กรุณากดยืนยันเพื่อดำเนินการ",
          showDenyButton: true,
          showCancelButton: true,
          confirmButtonText: "ลงเวลามา",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-danger",
            content: "text-muted",
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
            processCheckinOrCheckout(ctype, latitude, longitude,staff);
          } else if (result.isDenied) {
            startScan();
          }
        });
      }else{
        Swal.fire({
          icon: "error",
          title: "ผิดพลาด!",
          html: 'ไม่สามารถดำเนินการได้',
          showDenyButton: true,
          // showCancelButton: true,
          confirmButtonText: "ปิด",
          denyButtonText: "สแกนใหม่",
          customClass: {
            title: "text-danger",
            content: "text-muted",
            confirmButton: "btn btn-danger",
            denyButton: "btn btn-primary",
          },
        }).then((result) => {
          if (result.isConfirmed) {
           //
          } else if (result.isDenied) {
            startScan();
          }
        });
      return;
      }    
    }
  } catch (error) {
    Swal.fire({
      icon: "error",
      title: "ผิดพลาด!",
      html: 'QR Code ไม่ถูกต้องหรือข้อมูลไม่ครบถ้วน',
      showDenyButton: true,
      confirmButtonText: "ปิด",
      denyButtonText: "สแกนใหม่",
      customClass: {
        title: "text-danger",
        content: "text-muted",
        confirmButton: "btn btn-danger",
        denyButton: "btn btn-primary",
      },
    }).then((result) => {
      if (result.isDenied) {
        startScan();
      }
    });
  }
}

function onScanFailure() {
  // Swal.fire({
  //   icon: "warning",
  //   title: "เกิดข้อผิดพลาด",
  //   text: "ไม่สามารถสแกน QR Code ได้ โปรดลองอีกครั้ง",
  //   timer: 2000,
  //   showConfirmButton: false,
  // });
}

// รายงาน สถานะ

function saveCheckEntries() {
    localStorage.setItem("checkEntries", JSON.stringify(checkEntries));
}

function loadCheckEntries() {
    const saved = localStorage.getItem("checkEntries");
    return saved ? JSON.parse(saved) : [];
}

let checkReportVisible = false;
window.checkEntries = loadCheckEntries();

const checkToggleReportBtn = document.getElementById("checkToggleReportBtn");
const checkReportBody = document.getElementById("checkReportBody");
const checkReportTableWrapper = document.getElementById("checkReportTableWrapper");

let dataTable;

function formatThaiDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const thaiMonths = ["ม.ค.","ก.พ.","มี.ค.","เม.ย.","พ.ค.","มิ.ย.","ก.ค.","ส.ค.","ก.ย.","ต.ค.","พ.ย.","ธ.ค."];
    const day = date.getDate();
    const month = thaiMonths[date.getMonth()];
    const year = (date.getFullYear() + 543).toString().slice(-2);
    return `${day} ${month} ${year}`;
}

function formatTime(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    const hours = date.getHours().toString().padStart(2,"0");
    const minutes = date.getMinutes().toString().padStart(2,"0");
    return `${hours}:${minutes}`;
}



// ล้างข้อมูลเก่ากว่า 90 วันอัตโนมัติ
function removeOldEntries() {
    const now = new Date();
    const daysLimit = 30;

    checkEntries = checkEntries.filter(entry => {
        if (!entry.todayx) return false;
        const entryDate = new Date(entry.todayx);
        const diffDays = (now - entryDate) / (1000 * 60 * 60 * 24);
        return diffDays <= daysLimit;
    });

    saveCheckEntries();
}

// อัปเดตตาราง DataTable
function updateCheckReport() {
    if (dataTable) dataTable.destroy();
    checkReportBody.innerHTML = "";

    removeOldEntries(); // ล้างเก่าก่อนแสดง

    if (checkEntries.length === 0) {
        const row = document.createElement("tr");
    row.innerHTML = `
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
        <td>-</td>
    `;
    checkReportBody.appendChild(row);
    } else {
        checkEntries.forEach((entry, index) => {
            let ctypeText = entry.ctype === "In" ? "มา" : entry.ctype === "Out" ? "กลับ" : entry.ctype || "-";
            let iconxText = entry.iconx === "success" ? "สำเร็จ"
                : entry.iconx === "warning" ? "คำเตือน"
                : entry.iconx === "info" ? "ข้อมูล"
                : entry.iconx === "danger" || entry.iconx === "error" ? "ผิดพลาด"
                : entry.iconx || "-";

            let statusColor;
            switch (iconxText) {
                case "สำเร็จ": statusColor = "text-success"; break;
                case "ผิดพลาด": statusColor = "text-danger"; break;
                case "คำเตือน": statusColor = "text-warning"; break;
                case "ข้อมูล": statusColor = "text-info"; break;
                default: statusColor = "text-secondary";
            }

            const row = document.createElement("tr");
            row.innerHTML = `
                <td>${formatThaiDate(entry.todayx)}</td>
                <td>${formatTime(entry.todayx)}</td>
                <td class="${statusColor}">${iconxText}</td>
                <td>${ctypeText}</td>
                <td>${entry.typea || "-"}</td>
                <td>${entry.nte || "-"}</td>
                <td>${entry.text || "-"}</td>
            `;
            checkReportBody.appendChild(row);
        });
    }

    // init DataTable
    dataTable = $('#checkReportTable').DataTable({
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json",
        },
        order: [[0, "desc"], [1, "desc"]], // เรียงวันที่+เวลา ใหม่→เก่า
        pageLength: 30,
        lengthMenu: [
            [10, 30, 50, 100, 150, -1],
            [10, 30, 50, 100, 150, "ทั้งหมด"]
        ],
        responsive: true,
        dom: "lBfrtip",
    });
}

// ปุ่มเคลียร์ข้อมูล
document.getElementById("clearCheckEntriesBtn").addEventListener("click", () => {
    Swal.fire({
        title: "ยืนยันการล้างข้อมูล?",
        text: "ข้อมูลประวัติในเครื่อง(Local Storage) ของคุณจะถูกลบ",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "ลบ",
        cancelButtonText: "ยกเลิก",
        reverseButtons: true,
    }).then((result) => {
        if (result.isConfirmed) {
            // ล้างข้อมูล
            checkEntries = [];
            saveCheckEntries();
            updateCheckReport();

            // แจ้งลบเรียบร้อย
            Swal.fire({
                icon: "success",
                title: "ล้างข้อมูลเรียบร้อย",
                showConfirmButton: false,
                timer: 1500
            }).then(() => {
                // รีเฟรชหน้า
                location.reload();
            });
        }
    });
});



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
function generateReferenceH(dateObj = new Date(),  ctype) {
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


// ===================== DATATABLE =====================
function loadOffDayTable() {
  const data = getArray(SUCCESS_KEY);

  if (offDayTable) {
    offDayTable.clear().rows.add(data).draw();
    return;
  }

  offDayTable = $("#offDayTable").DataTable({
    data,
    columns: [
      { data: "date", title: "วันที่" },
      { data: "name", title: "ชื่อ" },
      { data: "office", title: "หน่วยงาน" },
      { data: "type", title: "ประเภท" },
      { data: "note", title: "หมายเหตุ" },
      { data: "ref", title: "อ้างอิง" }
    ],
        language: {
            url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json",
        },
        order: [[0, "desc"], [1, "desc"]],
        pageLength: 30,
        lengthMenu: [
            [10, 30, 50, 100, 150, -1],
            [10, 30, 50, 100, 150, "ทั้งหมด"]
        ],
        responsive: true,
        dom: "lBfrtip",
        select: { style: "multi" },
        buttons: [
            {
                extend: "copy",
                text: "คัดลอก",
                className: "btn btn-secondary",
                exportOptions: {
                    columns: [0,1,2,3,4,5]
                }
            },
            {
                extend: "excel",
                text: "ส่งออก Excel",
                className: "btn btn-success",
                exportOptions: {
                    columns: [0,1,2,3,4,5]
                }
            },
            {
                text: "🗑️ ลบรายการที่เลือก",
                className: "btn btn-danger",
action: async function (e, dt) {
  const rows = dt.rows({ selected: true });

  if (!rows.any()) {
    Swal.fire({
      icon: "warning",
      title: "ยังไม่ได้เลือกรายการ",
      text: "กรุณาเลือกรายการที่ต้องการลบ"
    });
    return;
  }

  const rowData = rows.data().toArray();

  // ✅ ดึง ref จาก object
  const references = rowData
    .map(r => r.ref)
    .filter(r => r && r !== "-");

  if (!references.length) {
    Swal.fire({
      icon: "error",
      title: "ข้อมูลไม่สมบูรณ์",
      text: "ไม่พบค่าอ้างอิงสำหรับลบข้อมูล"
    });
    return;
  }

  const listHtml = references
    .map((ref, i) => `<div>${i + 1}. ${ref}</div>`)
    .join("");

  const confirm = await Swal.fire({
    icon: "warning",
    title: "ยืนยันการลบข้อมูล",
    html: `
      <p>คุณต้องการลบข้อมูล <b>${references.length}</b> รายการ</p>
      <hr>
      <div style="text-align:left;font-size:0.9em">
        <b>อ้างอิง:</b>
        ${listHtml}
      </div>
    `,
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonText: "ยกเลิก",
    confirmButtonText: "ลบข้อมูล"
  });

  if (!confirm.isConfirmed) return;

  try {
    Swal.fire({
      title: "กำลังลบข้อมูล...",
      allowOutsideClick: false,
      didOpen: () => Swal.showLoading()
    });

    for (const reference of references) {
      await deleteHOLIDAYInGAS(reference);
    }

    // ลบ localStorage
  try {
    let offDaySuccessLogs = JSON.parse(localStorage.getItem('offDaySuccessLogs') || '[]');
    const updatedLogs = offDaySuccessLogs.filter(log => !references.includes(log.ref));
    localStorage.setItem('offDaySuccessLogs', JSON.stringify(updatedLogs));
} catch (localStorageErr) {
    console.warn('ไม่สามารถลบข้อมูลจาก localStorage ได้:', localStorageErr);
}

    rows.remove().draw(false);

    Swal.fire({
      icon: "success",
      title: "ลบข้อมูลสำเร็จ",
      timer: 1500,
      showConfirmButton: false
    });

  } catch (err) {
    console.error(err);
    Swal.fire({
      icon: "error",
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถลบข้อมูลได้"
    });
  }
}

            }
        ]
    });
}

// เพิ่มที่ส่วนบนของ updateOtReport
const WEB_HOLIDAY_APP_URL = 'https://script.google.com/macros/s/AKfycbwpnJlFwwaVGinRKhDy2RuvfgheijVt3F_r4epkOJx0nWH8jm4hfCsTHMYlUkxDm0BTEw/exec';

async function deleteHOLIDAYInGAS(reference) {
    try {
        // ใช้ setTimeout เพื่อหลีกเลี่ยงปัญหา Quota
        await new Promise(resolve => setTimeout(resolve, 100));

        // สร้าง URL พร้อม query parameters สำหรับ GET
        const url = `${WEB_HOLIDAY_APP_URL}?action=deleteOt&reference=${encodeURIComponent(reference)}`;
        
        const response = await fetch(url, {
            method: 'GET',
            // mode: 'no-cors', // ถ้าใช้ no-cors ต้องระวังเรื่องการอ่าน response
        });
        
        // ถ้าไม่ได้ใช้ no-cors สามารถอ่าน response ได้
        if (response.ok) {
            const result = await response.json();
            return result.success;
        } else {
            console.error('ลบข้อมูลไม่สำเร็จ:', response.status);
            throw new Error(`HTTP error! status: ${response.status}`);
        }
    } catch (error) {
        console.error('ลบข้อมูลไม่สำเร็จ:', error);
        throw error;
    }
}

// หรือถ้าต้องการใช้ no-cors (แต่จะอ่าน response ไม่ได้)
async function deleteHOLIDAYInGAS_NoCors(reference) {
    try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const url = `${WEB_HOLIDAY_APP_URL}?action=deleteOt&reference=${encodeURIComponent(reference)}`;
        
        // ใช้ no-cors แต่จะอ่าน response ไม่ได้
        await fetch(url, {
            method: 'GET',
            mode: 'no-cors'
        });
        
        // สมมติว่าสำเร็จเนื่องจากใช้ no-cors
        return true;
    } catch (error) {
        console.error('ลบข้อมูลไม่สำเร็จ:', error);
        throw error;
    }
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
  const ref = generateReferenceH(new Date(), payload.ctype);

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



