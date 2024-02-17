import { Telegraf } from "telegraf"
import LocalSession from "telegraf-session-local";
import { Command } from "./commands/command.class";
import { IConfigService } from "./configs/config.interface";
import { ConfigService } from "./configs/config.service";
import { IBotContext } from "./context/context.interface";
import { StartCommand } from "./commands/start.command";
import { SoundboardCommand } from "./commands/soundboard.command";

class Bot {
  bot: Telegraf<IBotContext>;
  commands: Command[] = [];

  constructor(private readonly configService: IConfigService) {
    this.bot = new Telegraf<IBotContext>(this.configService.get("TOKEN"));
    this.bot.use((new LocalSession({ database: 'sessions.json' })).middleware());
  }

  init() {
    this.commands = [
      new StartCommand(this.bot),
      new SoundboardCommand(this.bot)
    ];

    for (const command of this.commands) {
      command.handle();
    };

    this.bot.launch();
  }
}

const bot = new Bot(new ConfigService());
bot.init()