import { BaseResponse } from "./response";
import { IResponse } from "./iresponse";
import { TestTerm} from "../Dtos/test-term";

export class GetTestTermsResponse extends BaseResponse implements IResponse {

    testTerms : TestTerm[];
}
