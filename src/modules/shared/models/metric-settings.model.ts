import { MetricSpecification } from './metric-specification.model';

export class MetricSettings {
  public id: string;
  public name: string;
  public filter: {
    sourceName: string;
    stageId: string;
  };
  public metricProviderSpecification: MetricSpecification;
  public timestamp?: number;

  constructor(props: any = {}) {
    this.id = props.id;
    this.filter = props.filter;
    this.name = props.name;
    this.metricProviderSpecification = props.metricProviderSpecification;
    this.timestamp = props.timestamp;
  }
}
