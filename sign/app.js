window.addEventListener("load",()=>{

Swal.fire({

 title: "โปรดอ่านก่อนลงลายมือชื่อ",

 icon: "warning",

html: `

<div style="text-align:left;font-size:14px;line-height:1.7">

<div class="mb-3">

<i class="fa-solid fa-circle-info text-primary me-2"></i>
<b>วัตถุประสงค์ของลายมือชื่อ</b>

<p class="mt-1 mb-0">
เพื่อความสะดวกในการใช้งานระบบลงเวลา ผู้ใช้งานจำเป็นต้องจัดทำลายมือชื่อสำหรับใช้ภายในระบบลงเวลานี้ 
โดยลายมือชื่อดังกล่าวมีวัตถุประสงค์เพื่อใช้ประกอบการยืนยันตัวตนและการดำเนินการภายในระบบลงเวลาเท่านั้น
</p>

</div>


<div class="mb-3">

<i class="fa-solid fa-scale-balanced text-danger me-2"></i>
<b>ข้อจำกัดทางกฎหมาย</b>

<p class="mt-1 mb-0">
ลายมือชื่อนี้จัดทำขึ้นเพื่อใช้ในการยืนยันการใช้งานภายในระบบลงเวลานี้เท่านั้น 
<b>มิได้มีสถานะเป็นลายมือชื่อทางกฎหมาย</b> และไม่ใช้แทนลายมือชื่อจริงของท่าน
ในการดำเนินการทางกฎหมาย
</p>

</div>


<div class="mb-3">

<i class="fa-solid fa-shield-halved text-warning me-2"></i>
<b>ข้อควรระวังในการจัดทำลายมือชื่อ</b>

<ul class="mb-0 ps-3">

<li>กรุณาจัดทำลายมือชื่อให้แตกต่างจากลายมือชื่อจริงของท่าน</li>

<li>หลีกเลี่ยงการใช้ลายมือชื่อที่ใช้ในเอกสารราชการหรือเอกสารสำคัญ</li>

<li>ลายมือชื่อนี้จะถูกใช้เฉพาะภายในระบบลงเวลานี้เท่านั้น</li>

</ul>

</div>


<hr>


<div class="form-check mt-3">

<input class="form-check-input" type="checkbox" id="acceptRule">

<label class="form-check-label" for="acceptRule">

<i class="fa-solid fa-check-circle text-success me-1"></i>

ข้าพเจ้าได้อ่านและรับทราบรายละเอียดดังกล่าวแล้ว 
และยินยอมจัดทำลายมือชื่อเพื่อใช้ภายในระบบลงเวลานี้

</label>

</div>

</div>
`,

 confirmButtonText: "รับทราบและดำเนินการต่อ",

 allowOutsideClick:false,

 didOpen:()=>{

  const btn = Swal.getConfirmButton();
  btn.disabled = true;

  const checkbox = document.getElementById("acceptRule");

  checkbox.addEventListener("change",()=>{
   btn.disabled = !checkbox.checked;
  });

 }

});

});

const canvas = document.getElementById("signature");

/* resize canvas */

function resizeCanvas(){

 const ratio = Math.max(window.devicePixelRatio || 1,1);

 canvas.width = canvas.offsetWidth * ratio;
 canvas.height = canvas.offsetHeight * ratio;

 canvas.getContext("2d").scale(ratio,ratio);

}

resizeCanvas();
window.addEventListener("resize",resizeCanvas);


/* signature pad */

const signaturePad = new SignaturePad(canvas,{

 penColor:"rgb(0,0,0)",

 minWidth:0.6,
 maxWidth:3.2,

 throttle:4,
 minDistance:1,

 velocityFilterWeight:0.92

});


/* undo */

document.getElementById("undo").onclick=()=>{

 const data=signaturePad.toData();

 if(data.length){
  data.pop();
  signaturePad.fromData(data);
 }

};


/* clear */

document.getElementById("clear").onclick=()=>{

 signaturePad.clear();

};


/* crop canvas */

function cropCanvas(canvas){

 const ctx=canvas.getContext("2d");

 const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);

 let minX=canvas.width;
 let minY=canvas.height;
 let maxX=0;
 let maxY=0;

 for(let y=0;y<pixels.height;y++){

  for(let x=0;x<pixels.width;x++){

   const a=pixels.data[(y*pixels.width+x)*4+3];

   if(a>0){

    if(x<minX) minX=x;
    if(y<minY) minY=y;
    if(x>maxX) maxX=x;
    if(y>maxY) maxY=y;

   }

  }

 }

 const w=maxX-minX;
 const h=maxY-minY;

 const crop=document.createElement("canvas");

 crop.width=w;
 crop.height=h;

 crop.getContext("2d").drawImage(
 canvas,
 minX,
 minY,
 w,
 h,
 0,
 0,
 w,
 h
 );

 return crop;

}


/* save */
document.getElementById("save").onclick = async () => {

 if(signaturePad.isEmpty()){
  Swal.fire({
   icon:"warning",
   title:"ยังไม่ได้เซ็นชื่อ",
   text:"กรุณาเซ็นชื่อก่อน"
  });
  return;
 }

 const oldSignature = localStorage.getItem("signature_url");

 /* ถ้ามีลายเซ็นเดิม */

 if(oldSignature){

  const confirm = await Swal.fire({

   title:"มีลายเซ็นเดิมอยู่",
   html:`
   <img src="${oldSignature}" style="max-width:200px;border-radius:8px">
   <br><br>
   ต้องการเซ็นใหม่และทับลายเซ็นเดิมหรือไม่ ?
   `,
   icon:"question",
   showCancelButton:true,
   confirmButtonText:"เซ็นใหม่",
   cancelButtonText:"ยกเลิก",
   confirmButtonColor:"#198754",
   cancelButtonColor:"#6c757d"

  });

  if(!confirm.isConfirmed){
   return;
  }

 }

 /* เริ่ม upload */

 Swal.fire({
  title:"กำลังบันทึก...",
  allowOutsideClick:false,
  didOpen:()=>Swal.showLoading()
 });

 try{

  const cropped = cropCanvas(canvas);

  const blob = await new Promise(resolve=>{
   cropped.toBlob(resolve,"image/png",0.9);
  });

  if(blob.size > 256000){
   Swal.fire({
    icon:"error",
    title:"ไฟล์ใหญ่เกิน 256KB"
   });
   return;
  }

const cidhash = localStorage.getItem("cidhash") || "signature";

const sign = await fetch(`/upload-signature?id=${cidhash}`,{
 cache:"no-store"
});

  if(!sign.ok) throw new Error("API signature ใช้งานไม่ได้");

  const sig = await sign.json();

  const form = new FormData();

form.append("file", blob);

form.append("folder", sig.folder);
form.append("public_id", sig.public_id);

form.append("api_key", sig.apiKey);
form.append("timestamp", sig.timestamp);
form.append("signature", sig.signature);

  const res = await fetch(
   `https://api.cloudinary.com/v1_1/${sig.cloudName}/image/upload`,
   {
    method:"POST",
    body:form
   }
  );

  if(!res.ok) throw new Error("Cloudinary API error");

  const data = await res.json();

  localStorage.setItem("signature_url",data.secure_url);

Swal.fire({
 icon:"info",
 title:"กำลังบันทึกลายเซ็น...",
 allowOutsideClick: false

}).then(()=>{
  SignatureToSheet(data.secure_url);
 signaturePad.clear();

const section = document.getElementById("signSection");
section.style.transition = "all 0.3s ease";
section.style.opacity = "0";

setTimeout(() => {
  section.style.display = "none";
}, 300);

});

  document.getElementById("result").innerHTML=`

  <img src="${data.secure_url}" class="img-fluid mb-2">

  <input class="form-control" value="${data.secure_url}">
  `;

 }catch(err){

  Swal.fire({
   icon:"error",
   title:"บันทึกไม่สำเร็จ",
   text:err.message
  });

 }

};

async function SignatureToSheet(signatureUrl){
    const uuid = localStorage.getItem("uuid");
  if (!uuid) {
    Swal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "ไม่พบข้อมูล UUID",
      icon: "error",
    });
    return;
  }

  let gas_sign_url = `https://script.google.com/macros/s/AKfycbwZLIcXfwvcumqXV4jzGShsyT1M_rR0dYPp71Y57MCjjYAfuWbSdHym3Hr0SCF8Fis/exec`;
  let data_sign = `?id=${uuid}&signature=${encodeURIComponent(signatureUrl)}`;

    fetch(gas_sign_url + data_sign)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return response.json();
    })
     .then((data) => {
      Swal.fire({
        title: "บันทึกสำเร็จ",
        text: "ลายเซ็นของคุณถูกบันทึกเรียบร้อยแล้ว",
        icon: "success"
      });
    })
    .catch((error) => {
      Swal.fire({
        title: "เกิดข้อผิดพลาด",
        text: error.message,
        icon: "error"
      });
    });
}
