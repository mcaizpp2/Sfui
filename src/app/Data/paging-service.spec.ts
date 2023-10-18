import { PagingService } from './paging-service';

describe('PagingService', () => {
  it('should create an instance', () => {
    expect(new PagingService(null, null,null)).toBeTruthy();
  });
});
