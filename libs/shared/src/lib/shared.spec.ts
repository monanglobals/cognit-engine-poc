import { APP_NAME, healthCheck } from './shared';

describe('shared', () => {
  it('exposes the app name', () => {
    expect(APP_NAME).toBe('cognit-engine-poc');
  });

  it('builds a healthy check for a service', () => {
    expect(healthCheck('api')).toEqual({ service: 'api', status: 'ok' });
  });
});
