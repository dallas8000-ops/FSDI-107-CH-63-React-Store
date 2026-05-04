import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { getItems, __resetItemServiceForTests } from './itemService';

function mockFetchJson() {
  vi.stubGlobal(
    'fetch',
    vi.fn((url) => {
      const u = String(url);
      if (u.includes('/api/images')) {
        return Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ files: ['x.jpg'] }),
        });
      }
      if (u.includes('/api/products')) {
        return Promise.resolve({
          ok: true,
          json: () =>
            Promise.resolve([
              {
                id: 1,
                name: 'Test',
                price: 10,
                image: '/images/x.jpg',
                description: 'd',
                category: 'c',
                stars: 4,
                oldPrice: null,
                discount: null,
                date: '2024-01-01',
              },
            ]),
        });
      }
      return Promise.resolve({ ok: false, status: 404 });
    })
  );
}

describe('getItems', () => {
  beforeEach(() => {
    __resetItemServiceForTests();
    mockFetchJson();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    __resetItemServiceForTests();
  });

  it('loads products from API and reconciles against /api/images', async () => {
    const list = await getItems();
    expect(fetch).toHaveBeenCalledWith('/api/products');
    expect(fetch).toHaveBeenCalledWith('/api/images');
    expect(list).toHaveLength(1);
    expect(list[0].name).toBe('Test');
    expect(list[0].image).toBe('/images/x.jpg');
  });

  it('falls back to bundled products when the API errors', async () => {
    globalThis.fetch.mockImplementation(() => Promise.reject(new Error('network')));
    const list = await getItems();
    expect(list.length).toBeGreaterThan(1);
    expect(list.some((p) => p.name === 'Wireless Mechanical Keyboard')).toBe(true);
  });
});
