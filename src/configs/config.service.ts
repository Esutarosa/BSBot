import { config ,DotenvParseOutput } from 'dotenv'
import { IConfigService } from "./config.interface"

export class ConfigService implements IConfigService {
  private config: DotenvParseOutput

  constructor() {
    const { error, parsed } = config()
    if (error) {
      throw new Error('Error loading .env file')
    }
    if (!parsed) {
      throw new Error('Error parsing .env file')
    }
    this.config = parsed
  }

  get(key: string): string {
    const res = this.config[key]
    if (!res) {
      throw new Error(`Key ${key} not found`)
    }
    return res
  }
}