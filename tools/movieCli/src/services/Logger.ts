import { blue, green, magenta, red } from 'colorette';

export class Logger {
  public constructor(
    private readonly logPrefix: string,
    private readonly verbose: boolean
  ) {}

  public infoBlank() {
    this.logInfo('');
  }

  public infoIssueStarting(issueNumber: number) {
    this.logInfo(magenta(`=== Processing issue ${issueNumber} ===`));
  }

  public infoIssueNotProcessing(label: string) {
    this.logInfo(`Ignoring, this issue as it is not for automation`);
    this.logInfo(`If this was in error, make sure the issue:`);
    this.logInfo(`- has a ${green(label)} label`);
    this.logInfo(`- has yaml data in its body which includes a 'type' field`);
  }

  public warnIssueInvalidType(type: string) {
    this.logError(`The issue has an invalid 'type' field in its yaml data: '${green(type)}'`);
  }

  public errorIssueNoType() {
    this.logError(`The issue has no 'type' field in its yaml data`);
  }

  public errorIssueReadUnexpectedError(message: string | null) {
    if (message === null) {
      this.logError(`An unexpected error occured reading the issue`);
    } else {
      this.logError(`An unexpected error occured reading the issue: '${message}'`);
    }
  }

  private logInfo(message: string) {
    console.log(`${this.logPrefix} ${blue('info')} ${message}`);
  }

  private logError(message: string) {
    console.log(`${this.logPrefix} ${red('error')} ${message}`);
  }
}
