export async function onRequest(context) {

  return Response.json({

    OAuth_gg_id: context.env.VITE_OAuth_gg_id || "",

    telegramEnabled: context.env.VITE_token_telegram || "",

    botName: context.env.VITE_botName_telegram || "",

    botId: context.env.VITE_botId_telegram || "",

    chatId: context.env.VITE_chat_telegram || "",

    secretKey: context.env.VITE_secretKey || ""

  });

}
