// load environment variables
import { load } from "std/dotenv/mod.ts";
await load({ export: true });

const BOT_SESSION = Deno.env.get("BOT_SESSION") || "bot";
const USR_SESSION = Deno.env.get("USR_SESSION") || "usr";

const TG_API_ID = parseInt(Deno.env.get("API_ID") || "0");
const TG_API_HASH = Deno.env.get("API_HASH");
const TG_BOT_TOKEN = Deno.env.get("BOT_TOKEN");

const TRIGGER_WORD = Deno.env.get("TRIGGER_WORD") || "@admin";

const ADMIN_CHAT_ID = parseInt(Deno.env.get("ADMIN_CHAT_ID") || "0");

import { Client, StorageLocalStorage } from "mtkruto/mod.ts";

console.log("Starting Bot Client");
const botClient = new Client(
    new StorageLocalStorage(BOT_SESSION),
    TG_API_ID,
    TG_API_HASH,
);
await botClient.start(TG_BOT_TOKEN);

const botMe = await botClient.getMe();

console.log(`Logged in as ${botMe.username}`);

console.log("Starting User Client");
const usrClient = new Client(
    new StorageLocalStorage(USR_SESSION),
    TG_API_ID,
    TG_API_HASH,
);

await usrClient.start({
    phone: () => prompt("Enter your phone number:")!,
    code: () => prompt("Enter the code you received:")!,
    password: () => prompt("Enter your account's password:")!,
});
const usrMe = await usrClient.getMe();

console.log(`Logged in as ${JSON.stringify(usrMe)}`);

console.log("Started.");

let TARGET_CHAT_IDS: Array<number> = [];
const TARGET_CHAT_IDS_ = (
    Deno.env.get("TARGET_CHAT_IDS") || ""
).split(" ");
for (const c of TARGET_CHAT_IDS_) {
    if (c.startsWith("@")) {
        const t = await usrClient.getChat(c);
        TARGET_CHAT_IDS.push(t.id);
    } else {
        TARGET_CHAT_IDS.push(
            parseInt(c),
        );
    }
}
console.log(
    `Listening for ${TRIGGER_WORD} in ${JSON.stringify(TARGET_CHAT_IDS)}`,
);

usrClient.on("message", async (ctx) => {
    if (
        TARGET_CHAT_IDS.indexOf(ctx.chat.id) > -1 &&
        ctx.message.text.indexOf(TRIGGER_WORD) > -1
    ) {
        await botClient.sendMessage(
            ADMIN_CHAT_ID,
            Deno.env.get("BOT_REPORT_MESSAGE") || "MESSAGE",
            {
                replyMarkup: {
                    inlineKeyboard: [
                        [
                            {
                                text: "GoTo Message",
                                url: ctx.msg.link,
                            },
                        ],
                    ],
                },
            },
        );
    }
});
