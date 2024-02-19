import { Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

import fs from "fs";
import path from "path";

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start(async (ctx) => {
      try {
        const dir: string = path.join(__dirname, "..", "soundboards");
        const files: string[] = fs.readdirSync(dir);
        const randomFile: string = files[Math.floor(Math.random() * files.length)];
        const filePath: string = path.join(dir, randomFile);
        await ctx.replyWithAudio({ source: filePath });
        await ctx.deleteMessage();
      } catch (err) {
        console.log("Error playing soundboard file:", err);
        await ctx.reply("An error occurred while playing the audio file. Try again later ツ");
      }
    });
  }
}