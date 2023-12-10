import { ComponentPagingRequest } from "./component-paging-request";

export class CleanLoadRequest {

  CleanseMgrId : number;
  Show: boolean;
  PagingRequests: ComponentPagingRequest[];
  
  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
