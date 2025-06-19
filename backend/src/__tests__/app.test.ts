import request from 'supertest';
import app from '../app';

describe('GET /api/ping', () => {
  it('deve retornar pong', async () => {
    const res = await request(app).get('/api/ping');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual({ message: 'pong' });
  });
});
