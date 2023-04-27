import { RGBot } from "rg-bot";
import axios from "axios";

const STEAMSHIP_ENDPOINT = "https://patspringleaf.steamship.run/arborn_trash_talk_bot-241/arborn_trash_talk_bot-241/generate"
const STEAMSHIP_API_KEY = "API Key copied from your Steamship account"

async function generateTrashTalk(phrase: string): Promise<string | null> {
    try {
        const resp = await axios.post(
            STEAMSHIP_ENDPOINT,
            {phrase},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${6214078F-AEE0-4771-BCF1-BCEA8F4FE1E3}`
                }
            })
        if (resp.data["response"]) {
            return resp.data["response"]
        } else {
            console.error(resp.data)
        }
    } catch (e) {
        console.log(e)
    }
    return null;
}

/**
 * This bot will trash talk back to the player
 */
export function configureBot(bot: RGBot) {

    // When a system message is printed, such as a player getting
    // a flag, as long as it mentions the flag, create some trash talk
    bot.on('message', async (jsonMsg, position, sender, verified) => {
        if (position == "system") {
            const message = jsonMsg.extra[0]['text'];
            if (message.includes("flag")) {
                const trashTalk = await generateTrashTalk(message);
                if (trashTalk) {
                    bot.chat(trashTalk)
                }
            }
        }
    })

    // Any time a player chats, as long as it is not the bot itself,
    // generate some trash talk
    // TODO: You can improve this by adding some code to only trash
    //       talk to enemy teams!
    bot.on('chat', async (username: string, message: string) => {
        if (username == bot.username()) return;
        const trashTalk = await generateTrashTalk(message);
        if (trashTalk) {
            bot.chat(trashTalk)
        }
    })

}