export class FileDto
{
  name : string;
  path : string;
    
    constructor(values: Object = {}) {
        Object.assign(this, values);
      }
}
