import { ThrottleLoggingFilterGuard } from './throttle-logging-filter.guard';

describe('ThrottleLoggingFilterGuard', () => {
  it('should be defined', () => {
    expect(new ThrottleLoggingFilterGuard()).toBeDefined();
  });
});
