export class ProgressMessage {

    title : string;
    progress : number;
    complete : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

export class CompleteMessage {


    constructor(values: Object = {}) {
        Object.assign(this, values);
    }
}

