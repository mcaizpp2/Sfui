import { IResponse } from "./iresponse";
import { MessageResponse } from "./response";

export class UploadResponse extends MessageResponse implements IResponse {

    fileName : string;
    workSheetName : string;

    constructor(values: Object = {}) {
        super();
        Object.assign(this, values);
      }
}
