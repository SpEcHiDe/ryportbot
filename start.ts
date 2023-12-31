import { load } from "std/dotenv/mod.ts";
await load({ export: true });

export const TG_ENV_S = Deno.env.toObject();

import { Client, StorageLocalStorage } from "mtkruto/mod.ts";

const botClient = new Client(
    new StorageLocalStorage(TG_ENV_S.BOT_SESSION),
    parseInt(TG_ENV_S.API_ID),
    TG_ENV_S.API_HASH,
);
await botClient.start(TG_ENV_S.BOT_TOKEN);

const usrClient = new Client(
    new StorageLocalStorage(TG_ENV_S.USR_SESSION),
    parseInt(TG_ENV_S.API_ID),
    TG_ENV_S.API_HASH,
);

await usrClient.start({
    phone: () => prompt("Enter your phone number:")!,
    code: () => prompt("Enter the code you received:")!,
    password: () => prompt("Enter your account's password:")!,
});

console.log("Started.");
