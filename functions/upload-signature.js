export async function onRequest(context) {

 const timestamp = Math.floor(Date.now() / 1000);

 const cloudName = context.env.VITE_CLOUDINARY_NAME;
 const apiKey = context.env.VITE_CLOUDINARY_API;
 const apiSecret = context.env.VITE_CLOUDINARY_SECRET;

 const params = `timestamp=${timestamp}`;

 const data = new TextEncoder().encode(params + apiSecret);

 const hash = await crypto.subtle.digest("SHA-1", data);

 const signature = [...new Uint8Array(hash)]
  .map(b => b.toString(16).padStart(2, "0"))
  .join("");

 return new Response(
  JSON.stringify({
   timestamp,
   signature,
   apiKey,
   cloudName
  }),
  {
   headers: {
    "Content-Type": "application/json",
    "Cache-Control": "no-store"
   }
  }
 );

}
