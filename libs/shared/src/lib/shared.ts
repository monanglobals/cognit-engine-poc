export const APP_NAME = 'cognit-engine-poc';

export type ServiceStatus = 'ok' | 'degraded' | 'down';

export interface HealthCheck {
  service: string;
  status: ServiceStatus;
  dependencies?: Record<string, ServiceStatus>;
}

/**
 * A service that answers but has a dependency down is `degraded`, not `down` —
 * it is still reachable, only part of what it offers works.
 */
export function healthCheck(
  service: string,
  dependencies?: Record<string, ServiceStatus>,
): HealthCheck {
  if (!dependencies) {
    return { service, status: 'ok' };
  }

  const healthy = Object.values(dependencies).every(
    (status) => status === 'ok',
  );

  return { service, status: healthy ? 'ok' : 'degraded', dependencies };
}
