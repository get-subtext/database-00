import { blue, green, magenta } from 'colorette';

export class Logger {
  public constructor(
    private readonly logPrefix: string,
    private readonly verbose: boolean
  ) {}

  public infoBlank() {
    this.logInfo('');
  }

  public infoStarting() {
    this.logInfo(magenta('=== Starting ==='));
  }

  public infoProcessingIssue(issueNumber: number) {
    this.logInfo(`Processing issue ${green(issueNumber)}`);
  }

  private logInfo(message: string) {
    console.log(`${this.logPrefix} ${blue('info')} ${message}`);
  }
}
