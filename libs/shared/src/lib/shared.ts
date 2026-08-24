export const APP_NAME = 'cognit-engine-poc';

export type ServiceStatus = 'ok' | 'degraded' | 'down';

export interface HealthCheck {
  service: string;
  status: ServiceStatus;
}

export function healthCheck(service: string): HealthCheck {
  return { service, status: 'ok' };
}
