// load environment variables
import { load } from "std/dotenv/mod.ts";
await load({ export: true });

const BOT_SESSION = Deno.env.get("BOT_SESSION") || "bot";
const USR_SESSION = Deno.env.get("USR_SESSION") || "usr";

const TG_API_ID = parseInt(Deno.env.get("API_ID") || "0");
const TG_API_HASH = Deno.env.get("API_HASH");
const TG_BOT_TOKEN = Deno.env.get("BOT_TOKEN");


import { Client, StorageLocalStorage } from "mtkruto/mod.ts";

console.log("Starting Bot Client");
const botClient = new Client(
    new StorageLocalStorage(BOT_SESSION),
    TG_API_ID,
    TG_API_HASH,
);
await botClient.start(TG_BOT_TOKEN);

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

console.log("Started.");


// await usrClient.disconnect();
// await botClient.disconnect();

// console.log("Stopped");
