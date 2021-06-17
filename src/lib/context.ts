interface VerifyConditionsContext {
  stdout: any;
  stderr: any;
  logger: any;
  /** Current Working Directory */
  cwd: string;
  /** Environment variables  */
  env: any;
  /** Information about the CI system */
  envCi: any;
  /** Options passed to semantic-release */
  options: any;
  /** Information about the current branch */
  branch: any;
  /** Information about branches */
  branches: any;
}

/** Interface to describe the information on the next release */
interface NextRelease {
  type: string;
  channel: string;
  gitHead: string;
  version: string;
  gitTag: string;
  name: string;
  notes?: string;
}

interface PreparePublishContext extends VerifyConditionsContext{
  nextRelease: NextRelease;
}