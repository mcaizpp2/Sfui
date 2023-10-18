import { LookupService } from './lookupservice';

describe('Lookupservice', () => {
  it('should create an instance', () => {
    expect(new LookupService(null, null, null)).toBeTruthy();
  });
});
