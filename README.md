# BiChatFaker

This telegram bot is made using Javascript, deployed via Netlify, and data-stored in MongoDB(mlab).

# To use
Simply set web hook in telegram and set these env vars in your Netlify deployment settings.

# Webhook setter
Send a GET request to this URL.

`https://api.telegram.org/bot12285XXX:XXX/setWebhook?url=https://keen-XXX.netlify.app/.netlify/functions/entry`

# Env vars

-`ADMIN_PASSWORD`

-`BOT_TOKEN`

-`MONGO_URI`

-`MONGO_USER`

-`MONGO_PASS`

