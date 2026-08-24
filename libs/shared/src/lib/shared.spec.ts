import { APP_NAME, healthCheck } from './shared';

describe('shared', () => {
  it('exposes the app name', () => {
    expect(APP_NAME).toBe('cognit-engine-poc');
  });

  it('builds a healthy check for a service', () => {
    expect(healthCheck('api')).toEqual({ service: 'api', status: 'ok' });
  });

  it('stays ok while every dependency is ok', () => {
    expect(healthCheck('api', { database: 'ok' })).toEqual({
      service: 'api',
      status: 'ok',
      dependencies: { database: 'ok' },
    });
  });

  it('degrades when a dependency is not ok', () => {
    expect(healthCheck('api', { database: 'down' })).toEqual({
      service: 'api',
      status: 'degraded',
      dependencies: { database: 'down' },
    });
  });
});
