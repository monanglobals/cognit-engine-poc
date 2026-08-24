import { plainToInstance, Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  validateSync,
} from 'class-validator';

export enum NodeEnv {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

/**
 * Every environment variable the API reads. Anything not listed here is not
 * consumed by the app — add it, with a default when one makes sense.
 */
export class EnvironmentVariables {
  @IsEnum(NodeEnv)
  NODE_ENV: NodeEnv = NodeEnv.Development;

  // `@Type` is required: values coming from process.env are always strings.
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  PORT = 3343;

  @IsString()
  @IsNotEmpty()
  DATABASE_URL!: string;

  @IsString()
  @IsNotEmpty()
  OPENAI_API_KEY!: string;

  @IsString()
  @IsNotEmpty()
  OPENAI_MODEL = 'gpt-4o-mini';

  /** Points the OpenAI-compatible client elsewhere (e.g. OpenRouter). */
  @IsOptional()
  @IsUrl({ require_tld: false })
  OPENAI_BASE_URL?: string;

  /** Comma-separated origins allowed to reach the REST API and the WS gateway. */
  @IsString()
  @IsNotEmpty()
  CORS_ORIGIN = 'http://localhost:3000';
}

/**
 * Fails the boot with a readable report instead of letting a missing variable
 * surface as an obscure runtime error later.
 */
export function validateEnv(raw: Record<string, unknown>): EnvironmentVariables {
  const env = plainToInstance(EnvironmentVariables, raw, {
    enableImplicitConversion: true,
    exposeDefaultValues: true,
  });

  const errors = validateSync(env, { skipMissingProperties: false });

  if (errors.length > 0) {
    const details = errors
      .map(
        (error) =>
          `  - ${error.property}: ${Object.values(error.constraints ?? {}).join(', ')}`,
      )
      .join('\n');

    throw new Error(`Invalid environment configuration:\n${details}`);
  }

  return env;
}
