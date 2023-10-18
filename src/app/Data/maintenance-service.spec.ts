import { MaintenanceService } from './maintenance-service';

describe('MaintenanceService', () => {
  it('should create an instance', () => {
    expect(new MaintenanceService(null, null, null)).toBeTruthy();
  });
});
