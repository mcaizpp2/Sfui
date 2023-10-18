export class BookDto {
  BookId : number;
  Name : string;

  constructor(values: Object = {}) {
      Object.assign(this, values);
    }
}
