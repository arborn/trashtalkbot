import { RGBot } from "rg-bot";
import axios from "axios";

const STEAMSHIP_ENDPOINT = "https://patspringleaf.steamship.run/arborn_trash_talk_bot-a0j/arborn_trash_talk_bot-a0j/generate"
const STEAMSHIP_API_KEY = "API Key copied from your Steamship account"

async function generateTrashTalk(phrase, bottype) {
    try {
        const resp = await axios.post(
            STEAMSHIP_ENDPOINT,
            {phrase, bottype},
            {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer 6214078F-AEE0-4771-BCF1-BCEA8F4FE1E3`
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
export function configureBot(bot) {

  let bottype = 'robot'
  if (bot.username().includes("1")) {
    bottype = 'pirate'
  }
  if (bot.username().includes("2")) {
    bottype = 'oldtimey'
  }

    // When a system message is printed, such as a player getting
    // a flag, as long as it mentions the flag, create some trash talk
    bot.on('message', async (jsonMsg, position, sender, verified) => {
        if (position == "system") {
            const message = jsonMsg.extra[0]['text'];
            if (message.includes("flag")) {
                const trashTalk = await generateTrashTalk(message, bottype);
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
    bot.on('chat', async (username, message) => {
        if (username == bot.username()) return;
        if (!bot.getOpponentUsernames().includes(username)) return 
        const trashTalk = await generateTrashTalk(message);
        if (trashTalk) {
            bot.chat(trashTalk)
        }
    })

}