export class ComponentPagingRequest {

  public Page: number;

  public WorkSheetId: number;

  public ComponentId: number;
  constructor(values: Object = {}) {
    Object.assign(this, values);
  }
}
