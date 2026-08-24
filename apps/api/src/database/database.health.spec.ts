import { Test } from '@nestjs/testing';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { DatabaseHealthIndicator } from './database.health';

describe('DatabaseHealthIndicator', () => {
  const dataSource = { query: jest.fn() };

  const createIndicator = async () => {
    const app = await Test.createTestingModule({
      providers: [
        DatabaseHealthIndicator,
        { provide: getDataSourceToken() as string, useValue: dataSource },
        { provide: DataSource, useValue: dataSource },
      ],
    }).compile();

    return app.get(DatabaseHealthIndicator);
  };

  beforeEach(() => {
    jest.resetAllMocks();
  });

  it('is ok when the probe query succeeds', async () => {
    dataSource.query.mockResolvedValue([{ '?column?': 1 }]);

    await expect((await createIndicator()).check()).resolves.toBe('ok');
    expect(dataSource.query).toHaveBeenCalledWith('SELECT 1');
  });

  it('is down when the probe query throws', async () => {
    dataSource.query.mockRejectedValue(new Error('connection refused'));

    await expect((await createIndicator()).check()).resolves.toBe('down');
  });
});
