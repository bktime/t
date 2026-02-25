export async function onRequest(context) {

  return Response.json({

    OAuth_gg_id: context.env.VITE_OAuth_gg_id || "",

    telegram_bot_token: context.env.VITE_token_telegram || "",

    botName: context.env.VITE_botName_telegram || "",

    botId: context.env.VITE_botId_telegram || "",

    chatId: context.env.VITE_chat_telegram ? true : false,

    secretKey: context.env.VITE_secretKey ? true : false

  },{

    headers:{
      "Cache-Control":"public, max-age=86400"
    }

  });

}
