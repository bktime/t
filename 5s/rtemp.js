// ===============================
// GLOBAL
// ===============================

let fridgeData = [];
let tempChart = null;

// ===============================
// INIT
// ===============================

document.addEventListener("DOMContentLoaded", () => {
  const uuid = localStorage.getItem("uuid");

  if (!uuid) {
    window.location.href = "../login.html";
    return;
  }

  setDefaultDate();

  loadFridgeData();
});

// ===============================
// DEFAULT DATE
// ===============================

function setDefaultDate() {
  const now = new Date();

  const month = String(now.getMonth() + 1).padStart(2, "0");
  const year = now.getFullYear();

  document.getElementById("monthSelect").value = month;

  const yearSelect = document.getElementById("yearSelect");

  yearSelect.innerHTML = "";

  [year, year - 1].forEach((y) => {
    const opt = document.createElement("option");
    opt.value = y;
    opt.textContent = y;
    yearSelect.appendChild(opt);
  });

  yearSelect.value = year;
}

// ===============================
// LOAD DATA
// ===============================

async function loadFridgeData(btn) {
  if (btn && btn.dataset.loading === "1") return;
  if (btn) btn.dataset.loading = "1";

  let timerInterval;
  let startTime;

  Swal.fire({
    title: "กำลังดาวน์โหลด...",
    html: "เวลา <b>0</b> วินาที",
    allowOutsideClick: false,
    showConfirmButton: false,

    didOpen: () => {
      Swal.showLoading();

      const timer = Swal.getHtmlContainer().querySelector("b");

      startTime = Date.now();

      timerInterval = setInterval(() => {
        const elapsed = Math.floor((Date.now() - startTime) / 1000);

        timer.textContent = elapsed;
      }, 200);
    },

    willClose: () => clearInterval(timerInterval),
  });

  try {
    const month = document.getElementById("monthSelect").value;
    const year = document.getElementById("yearSelect").value;

    const office = localStorage.getItem("office");
    const dept = localStorage.getItem("mainsub");

    const params = new URLSearchParams({
      office: office,
      dept: dept,
      month: month,
      year: year,
    });

    const api =
      "https://script.google.com/macros/s/AKfycbwwtZZO2Yl_EWoq-_lr6ELmVYkzU60LUosmB3HLUESjqzWnYoAxVkQR6N1OLu5oJd4ERQ/exec?" +
      params;

    const res = await fetch(api, { cache: "no-store" });

    const data = await res.json();

    fridgeData = data.user || [];

    populateFridgeSelect();

    drawChart();

    buildTable(fridgeData);

    Swal.close();

    Swal.fire({
      icon: "success",
      title: "ดาวน์โหลดสำเร็จ",
      timer: 1500,
      showConfirmButton: false,
    });
  } catch (err) {
    console.error(err);

    Swal.fire({
      icon: "error",
      title: "โหลดข้อมูลไม่สำเร็จ",
    });
  } finally {
    if (btn) btn.dataset.loading = "0";
  }
}

// ===============================
// BUILD TABLE
// ===============================

function buildTable(data) {
  $("#fridgeTable").DataTable({
    destroy: true,
    data: data,

    deferRender: true,

columns: [
  { data: "date" },
  { data: "office" },
  { data: "range" },
  { data: "cool" },
  {
    data: "temp",
    render: function (data, type, row) {
      if (data === null || data === "") return "";
      return data + " °C";
    }
  },
  { data: "air" },
  { data: "opv",
        render: function (data, type, row) {
      if (data === null || data === "") return "";
      return data + " °C";
    }
   },
  { data: "temproom",
        render: function (data, type, row) {
      if (data === null || data === "") return "";
      return data + " °C";
    }
   },
  { data: "details" },
  { data: "name" },
  { data: "dupdate" },
  { data: "ref" },
],

    order: [
      [11, "asc"],
      [2, "asc"],
    ],

    responsive: true,

    dom: "lBfrtip",

    lengthMenu: [
      [10, 30, 70, 100, -1],
      [10, 30, 70, 100, "ทั้งหมด"],
    ],

    buttons: ["excel", "print"],

    pageLength: 30,

    language: {
      url: "https://cdn.datatables.net/plug-ins/1.13.7/i18n/th.json",
    },
  });
}

// ===============================
// FRIDGE SELECT
// ===============================

function populateFridgeSelect() {
  const select = document.getElementById("fridgeSelect");

  if (!select) return;

  select.innerHTML = '<option value="all">ทุกตู้</option>';

  const fridges = [...new Set(fridgeData.map((e) => e.cool))];

  fridges.forEach((fridge) => {
    const opt = document.createElement("option");

    opt.value = fridge;
    opt.textContent = fridge;

    select.appendChild(opt);
  });
}

// ===============================
// DRAW CHART
// ===============================

function drawChart() {
  const select = document.getElementById("fridgeSelect");

  if (!select) return;

  const fridge = select.value;

  let data = fridgeData;

  if (fridge !== "all") {
    data = data.filter((e) => e.cool === fridge);
  }

  const labels = [...new Set(data.map((e) => e.date))];

  const morning = labels.map((date) => {
    const item = data.find((e) => e.date === date && e.range === "09:00");
    return item ? Number(item.temp) : null;
  });

  const afternoon = labels.map((date) => {
    const item = data.find((e) => e.date === date && e.range === "15:00");
    return item ? Number(item.temp) : null;
  });

  const ctx = document.getElementById("tempChart");

  if (!ctx) return;

  if (tempChart) {
    tempChart.destroy();
  }

  tempChart = new Chart(ctx, {
    type: "line",

    data: {
      labels: labels,

      datasets: [
        {
          label: "เช้า",
          data: morning,
          borderColor: "#007bff",
          backgroundColor: "#007bff",
          tension: 0.3,
          pointRadius: 5,

          pointBackgroundColor: (ctx) => {
            const v = ctx.raw;
            if (v < 2 || v > 8) return "red";
            return "#007bff";
          },
        },

        {
          label: "บ่าย",
          data: afternoon,
          borderColor: "#dc3545",
          backgroundColor: "#dc3545",
          tension: 0.3,
          pointRadius: 5,

          pointBackgroundColor: (ctx) => {
            const v = ctx.raw;
            if (v < 2 || v > 8) return "red";
            return "#dc3545";
          },
        },

        {
          label: "ต่ำสุด 2°C",
          data: labels.map(() => 2),
          borderColor: "green",
          borderDash: [6, 6],
          pointRadius: 0,
        },

        {
          label: "สูงสุด 8°C",
          data: labels.map(() => 8),
          borderColor: "orange",
          borderDash: [6, 6],
          pointRadius: 0,
        },
      ],
    },

    plugins: [ChartDataLabels],

    options: {
      responsive: true,

      interaction: {
        mode: "index",
        intersect: false,
      },

      plugins: {
        legend: {
          position: "top",
          labels: {
            padding: 5,
          },
        },
      },

      layout: {
        padding: {
          top: 5,
        },

        tooltip: {
          callbacks: {
            label: (ctx) => ctx.dataset.label + " : " + ctx.raw + "°C",
          },
        },

        datalabels: {
          color: "#000",

          anchor: "end",
          align: "top",

          formatter: (value, context) => {
            if (
              context.dataset.label.includes("ต่ำสุด") ||
              context.dataset.label.includes("สูงสุด")
            ) {
              return null;
            }

            return value;
          },
        },
      },
    },
  });
}

// ===============================
// EVENT
// ===============================

const fridgeSelect = document.getElementById("fridgeSelect");

if (fridgeSelect) {
  fridgeSelect.addEventListener("change", drawChart);
}

// ===============================
// OPEN PAGE
// ===============================

function openWeb() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: "เปิดหน้าบันทึกข้อมูล",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      window.open("temp.html", "_blank");
    }
  });
}

// ===============================
// DASHBOARD
// ===============================

function opendash() {
  Swal.fire({
    title: "ยืนยันการดำเนินการ",
    text: "เปิด Dashboard",
    icon: "question",
    showCancelButton: true,
    confirmButtonText: "ตกลง",
    cancelButtonText: "ยกเลิก",
  }).then((result) => {
    if (result.isConfirmed) {
      window.open(
        "https://lookerstudio.google.com/reporting/f4108ec7-4b6c-42ed-a2ac-267f455e8d91",
        "_blank",
      );
    }
  });
}
