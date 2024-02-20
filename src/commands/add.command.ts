import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

import path from "path";
import axios from "axios"
import fs from 'fs';

export class AddCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.command("add", async (ctx) => {
      try {
        const audioFileId = (ctx.message as any).audio?.file_id;
        const fileLink = await ctx.telegram.getFileLink(audioFileId);
        const audioFilePath = fileLink.href;

        const dir: string = path.join(__dirname, "..", "soundboards");
        const fileName: string = `audio_${Date.now()}.ogg`;
        const filePath: string = path.join(dir, fileName);
        const response = await axios({
          method: 'GET',
          url: audioFilePath,
          responseType: 'stream',
        });
        response.data.pipe(fs.createWriteStream(filePath));
      } catch (err) {
        console.log(err);
        await ctx.reply(err + " ツ");
      }
    })
  }
}