import { readdirSync } from "fs";
import { join } from "path";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

export class SoundboardCommand extends Command {
  private readonly soundboardPath = "./soundboards/";

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.command("soundboard", (ctx) => {
      const soundboards = readdirSync(this.soundboardPath);

      const sounds = soundboards.map(file => {
        const fileName = file.replace(/\.[^/.]+$/, "");
        return { name: fileName, file_id: file };
      });

      const buttons = sounds.map(sound => 
        Markup.button.callback(sound.name, sound.file_id));

      ctx.reply(
        "Choose soundboard", 
        Markup.inlineKeyboard(buttons)
      );
    })

    this.bot.action(/^[A-Za-z0-9_-]+$/, (ctx) => {
      const chosenSound = ctx.match.input;
      const filePath = join(this.soundboardPath, chosenSound);
      ctx.replyWithAudio({ source: filePath });
    })
  }
}