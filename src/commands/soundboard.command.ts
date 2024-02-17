import { readdirSync } from "fs";
import { join } from "path";
import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

const fileExists = (filePath: string): boolean => {
  try {
    return readdirSync(filePath).length > 0;
  } catch (error) {
    return false;
  }
}

export class SoundboardCommand extends Command {
  private readonly soundboardPath = "./soundboards/";

  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.command('soundboard', (ctx) => {
      try {
        const files = readdirSync(this.soundboardPath);

        const sounds = files.map((file) => {
          const fileName = file.replace(/\.[^/.]+$/, '')
          return { name: fileName, file_id: file }
        });

        const buttons = sounds.map((sound) => {
          return Markup.button.callback(sound.name, sound.file_id)
        });

        const inlineKeyboard = Markup.inlineKeyboard(buttons);
        ctx.reply('Soundboards:', inlineKeyboard);

      } catch (error) {
        console.error("Error reading soundboard directory: ", error);
        ctx.reply("An error occurred while loading the soundboard");
      }
    });

    this.bot.action(/^[A-Za-z0-9_-]+$/, (ctx) => {
      const chosenSound = ctx.match.input;
      const filePath = join(this.soundboardPath, chosenSound);

      if (!fileExists(filePath)) {
        console.error("Sound file not found:", filePath);
        ctx.reply("The selected song was not found");
        return;
      }

      ctx.replyWithAudio({ source: filePath });
    });
  }
}