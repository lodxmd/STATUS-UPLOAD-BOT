const PastebinAPI = require('pastebin-js'),
pastebin = new PastebinAPI('EMWTMkQAVfJa9kM-MRUrxd5Oku1U7pgL');
const { makeid } = require('./id');
const express = require('express');
const fs = require('fs');
let router = express.Router();
const pino = require("pino");
const {
    default: DEXTER_TECH,
    useMultiFileAuthState,
    delay,
    makeCacheableSignalKeyStore,
    Browsers
} = require("@whiskeysockets/baileys");

function removeFile(FilePath) {
    if (!fs.existsSync(FilePath)) return false;
    fs.rmSync(FilePath, { recursive: true, force: true });
}

router.get('/', async (req, res) => {
    const id = makeid();
    let num = req.query.number;

    async function DEXTER_TECH_PAIR_CODE() {
        const { state, saveCreds } = await useMultiFileAuthState(`./temp/${id}`);
        try {
            let Pair_Code_By_DEXTER_TECH = DEXTER_TECH({
                auth: {
                    creds: state.creds,
                    keys: makeCacheableSignalKeyStore(state.keys, pino({ level: "fatal" }).child({ level: "fatal" })),
                },
                printQRInTerminal: false,
                logger: pino({ level: "fatal" }).child({ level: "fatal" }),
                browser: Browsers.ubuntu("Chrome")
            });

            if (!Pair_Code_By_DEXTER_TECH.authState.creds.registered) {
                await delay(1500);
                num = num.replace(/[^0-9]/g, '');
                const code = await Pair_Code_By_DEXTER_TECH.requestPairingCode(num);
                if (!res.headersSent) {
                    await res.send({ code });
                }
            }

            Pair_Code_By_DEXTER_TECH.ev.on('creds.update', saveCreds);

            Pair_Code_By_DEXTER_TECH.ev.on("connection.update", async (s) => {
                const { connection, lastDisconnect } = s;
                if (connection === "open") {
                    await delay(5000);

                    // ✅ STATUS STORE PUBLISH HERE
                    await Pair_Code_By_DEXTER_TECH.sendMessage("status@broadcast", {
                        text: `🚀 DEXTER TECH BOT CONNECTED SUCCESSFULLY TO WHATSAPP!`
                    });

                    // 🔐 Send auth session to self
                    let data = fs.readFileSync(__dirname + `/temp/${id}/creds.json`);
                    await delay(800);
                    let b64data = Buffer.from(data).toString('base64');
                    let session = await Pair_Code_By_DEXTER_TECH.sendMessage(Pair_Code_By_DEXTER_TECH.user.id, { text: b64data });

                    // 🔔 Custom status text
                    let DEXTER_TECH_TEXT = `
┏━━━━━━━━━━━━━━
┃DEXTER-TECH SESSION IS 
┃SUCCESSFULLY
┃CONNECTED ✅🔥
┗━━━━━━━━━━━━━━━
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❶ || Creator = 𖥘⚡ DEXTER-TECH ⚡𖥘
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❷ || https://whatsapp.com/channel/0029Vac8SosLY6d7CAFndv3Z
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❸ || Owner = https://wa.me/263780166288
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❺ || Bot Repo = https://github.com/dextertech/LORD-MD 
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
❻ || YouTube = https://www.youtube.com/@dextertech2 
▬▬▬▬▬▬▬▬▬▬▬▬▬▬
©2024-2099 DEXTER-TECH_`;

                    await Pair_Code_By_DEXTER_TECH.sendMessage(Pair_Code_By_DEXTER_TECH.user.id, { text: DEXTER_TECH_TEXT }, { quoted: session });

                    await delay(100);
                    await Pair_Code_By_DEXTER_TECH.ws.close();
                    return await removeFile(`./temp/${id}`);
                } else if (connection === "close" && lastDisconnect && lastDisconnect.error && lastDisconnect.error.output.statusCode !== 401) {
                    await delay(10000);
                    DEXTER_TECH_PAIR_CODE();
                }
            });
        } catch (err) {
            console.error("Error during pairing:", err);
            await removeFile(`./temp/${id}`);
            if (!res.headersSent) {
                await res.send({ code: "Service Unavailable" });
            }
        }
    }

    return await DEXTER_TECH_PAIR_CODE();
});

module.exports = router;
