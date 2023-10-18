import { ComponentLkpDto } from '../str-lookup-dto';
import { JoinCriteria } from './join-criteria';
import { OperationTypeDto } from './operation-type-dto';

export class JoinModalDto {

    ComponentId : number;
    CompFields : string[];
    CompNames : ComponentLkpDto[];
    JoinCompName : string;
    JoinCompId : number;
    JoinVisible : boolean;
    JoinCriteria : JoinCriteria[] = [];
    OperationType : OperationTypeDto;
    CompTwoIdx : number;
    CompTwoWsIdx : number;
    ModalHeader : string;
    JoinType : number;
    IsMerge : boolean;
    Component : string;
  
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
