import { Markup, Telegraf } from "telegraf";
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
        const dir = path.join(__dirname, "..", "soundboards"),
              files = fs.readdirSync(dir),
              randomFile = files[Math.floor(Math.random() * files.length)],
              filePath = path.join(dir, randomFile)
        await ctx.replyWithAudio({ source: filePath })
      } catch (err) {
        console.log("Error playing soundboard file:", err);
        await ctx.reply("An error occurred while playing the audio file. Try again later ツ");
      }
    });
  }
}