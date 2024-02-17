import { Markup, Telegraf } from "telegraf";
import { IBotContext } from "../context/context.interface";
import { Command } from "./command.class";

export class StartCommand extends Command {
  constructor(bot: Telegraf<IBotContext>) {
    super(bot);
  }

  handle(): void {
    this.bot.start((ctx) => {
      console.log(ctx.session);
      ctx.reply(
        "Do you like Vadim Sheg?",
        Markup.inlineKeyboard([
          Markup.button.callback("Yes", "yes"),
          Markup.button.callback("No", "no"),
        ])
      )
    });

    this.bot.action("yes", (ctx) => {
      ctx.session.like = true;
      ctx.editMessageText("Well, you have some problems.");
    });

    this.bot.action("no", (ctx) => {
      ctx.session.like = false;
      ctx.editMessageText("Great! Are you completely fine ツ");
    });
  }
}