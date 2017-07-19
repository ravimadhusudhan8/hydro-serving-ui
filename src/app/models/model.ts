export class Model {
  public description: string;
  public lastBuildTimestamp: string;
  public lastUpdateTimestamp: string;
  public lastVersion: string;
  public name: string;
  public source: string;
  public watchEnabled: boolean;

  constructor(modelInfo: any) {
    this.description = modelInfo['description'];
    this.lastBuildTimestamp = modelInfo['lastBuildTimestamp'];
    this.lastUpdateTimestamp = modelInfo['lastUpdateTimestamp'];
    this.lastVersion = modelInfo['lastVersion'];
    this.name = modelInfo['name'];
    this.source = modelInfo['source'];
    this.watchEnabled = modelInfo['watchEnabled'];
  }
}