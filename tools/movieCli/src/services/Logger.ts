import { blue, green, magenta, red, yellow } from 'colorette';

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
    this.logInfo(`Ignoring this issue as it is not for automation`);
    this.logInfo(`If this was in error, make sure the issue:`);
    this.logInfo(`- has a ${green(label)} label`);
    this.logInfo(`- has yaml data in its body which includes a 'type' field`);
  }

  public infoRequestMovieFound(imdbId: string, title: string, subtitleCount: number, apiCallsPassed: number, apiCallsFailed: number) {
    const packageP11n = subtitleCount === 1 ? 'package' : 'packages';
    const passedCallP11n = apiCallsPassed === 1 ? 'call' : 'calls';
    const failedCallP11n = apiCallsFailed === 1 ? 'call' : 'calls';
    this.logInfo(`Found movie ${green(imdbId)} - ${green(title)}`);

    if (apiCallsFailed === 0) {
      this.logInfo(`- all api ${passedCallP11n} ${green('passed')}`);
    } else {
      this.logInfo(`- ${apiCallsPassed} api ${passedCallP11n} ${green('passed')}`);
      this.logWarn(`- ${apiCallsFailed} api ${failedCallP11n} ${red('failed')}`);
    }

    if (subtitleCount > 0) {
      this.logInfo(`- ${subtitleCount} ${green('valid subtitle ' + packageP11n)} found`);
    } else {
      this.logWarn(`- Could not find any ${red('valid subtitle ' + packageP11n)}`);
    }
  }

  public infoRequestMovieNotFound(imdbId: string, apiCallsPassed: number, apiCallsFailed: number) {
    const passedCallP11n = apiCallsPassed === 1 ? 'call' : 'calls';
    const failedCallP11n = apiCallsFailed === 1 ? 'call' : 'calls';
    this.logInfo(`Could not find movie ${green(imdbId)}`);

    this.logInfo(`- ${green(apiCallsPassed)} api ${passedCallP11n} passed`);
    if (apiCallsFailed === 0) {
      this.logInfo(`- ${green(apiCallsFailed)} api ${failedCallP11n} failed`);
    } else {
      this.logWarn(`- ${red(apiCallsFailed)} api ${failedCallP11n} failed`);
    }
  }

  public warnIssueInvalidType(type: string) {
    this.logError(`The issue has an invalid 'type' field in its yaml data: '${green(type)}'`);
  }

  public errorIssueNoType() {
    this.logError(`The issue has no 'type' field in its yaml data`);
  }

  public errorIssueNoData() {
    this.logError(`The issue has no yaml data`);
  }

  public errorIssueInvalidYaml() {
    this.logError(`The issue has invalid yaml data`);
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

  private logWarn(message: string) {
    console.log(`${this.logPrefix} ${yellow('warn')} ${message}`);
  }

  private logError(message: string) {
    console.log(`${this.logPrefix} ${red('error')} ${message}`);
  }
}
