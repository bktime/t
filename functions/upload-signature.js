import crypto from "crypto";

export async function onRequest(context){

 const timestamp = Math.floor(Date.now()/1000);

 const cloudName = context.env.VITE_CLOUDINARY_NAME;
 const apiKey = context.env.VITE_CLOUDINARY_API;
 const apiSecret = context.env.VITE_CLOUDINARY_SECRET;

 const params = `timestamp=${timestamp}`;

 const signature = crypto
   .createHash("sha1")
   .update(params + apiSecret)
   .digest("hex");

 return Response.json({
  timestamp,
  signature,
  apiKey,
  cloudName
 });

}
