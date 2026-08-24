import { healthCheck } from '@cognit-engine-poc/shared';

export async function GET() {
  return Response.json(healthCheck('web'));
}
