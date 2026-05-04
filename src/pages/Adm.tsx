import { useCallback, useEffect, useState } from 'react';
import '../styles/Admin.css';
import { IconUserShield } from '@tabler/icons-react';
import { apiUrl } from '../config/apiBase';

const TOKEN_KEY = 'store_catalog_admin_jwt';

function getToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

function setToken(t: string | null) {
  if (t) sessionStorage.setItem(TOKEN_KEY, t);
  else sessionStorage.removeItem(TOKEN_KEY);
}

type ApiFetchOptions = {
  method?: string;
  body?: unknown;
  skipAuth?: boolean;
};

type ApiError = Error & { status?: number; data?: unknown };

/** express-validator and other APIs may shape errors differently */
function formatApiError(data: unknown, status: number): string {
  const d = data as Record<string, unknown> | null;
  if (d && typeof d.error === 'string') return d.error;
  const errs = d?.errors;
  if (Array.isArray(errs) && errs.length > 0) {
    const parts = errs.map((e: unknown) => {
      if (typeof e === 'string') return e;
      const row = e as { msg?: string; message?: string };
      if (row?.msg) return row.msg;
      if (row?.message) return row.message;
      return null;
    }).filter(Boolean);
    if (parts.length) return parts.join(' ');
  }
  return `Request failed (${status})`;
}

async function api(path: string, { method = 'GET', body, skipAuth }: ApiFetchOptions = {}) {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (!skipAuth) {
    const auth = getToken();
    if (auth) headers.Authorization = `Bearer ${auth}`;
  }

  const res = await fetch(apiUrl(path), {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  });

  if (res.status === 401) {
    setToken(null);
    const err = new Error('Session expired or unauthorized') as ApiError;
    err.status = 401;
    throw err;
  }

  const text = await res.text();
  let data: unknown;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg = formatApiError(data, res.status);
    const err = new Error(msg) as ApiError;
    err.status = res.status;
    err.data = data;
    throw err;
  }

  return data;
}

function Adm() {
  const [couponCode, setCouponCode] = useState('');
  const [couponDiscount, setCouponDiscount] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [productImage, setProductImage] = useState('');
  const [coupons, setCoupons] = useState([]);
  const [products, setProducts] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(!!getToken());
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [busy, setBusy] = useState(false);
  const [banner, setBanner] = useState('');

  const loadDashboard = useCallback(async () => {
    if (!getToken()) return;
    setBusy(true);
    try {
      const [productList, couponList] = await Promise.all([api('/api/products'), api('/api/admin/coupons')]);
      setProducts(productList);
      setCoupons(
        couponList.map((c) => ({
          id: c.id,
          code: c.code,
          discount: String(c.discountPercent),
        }))
      );
      setBanner('');
    } catch (e: unknown) {
      const err = e as ApiError;
      if (err.status === 401) {
        setIsLoggedIn(false);
        setBanner('');
      } else {
        setBanner(err.message || 'Failed to load admin data');
      }
    } finally {
      setBusy(false);
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn && getToken()) loadDashboard();
  }, [isLoggedIn, loadDashboard]);

  const handleAddCoupon = async (e) => {
    e.preventDefault();
    if (!couponCode.trim() || !couponDiscount) return;
    setBusy(true);
    setBanner('');
    try {
      await api('/api/admin/coupons', {
        method: 'POST',
        body: {
          code: couponCode.trim(),
          discountPercent: parseInt(couponDiscount, 10),
        },
      });
      setCouponCode('');
      setCouponDiscount('');
      await loadDashboard();
    } catch (err: unknown) {
      setBanner(err instanceof Error ? err.message : 'Could not add coupon');
    } finally {
      setBusy(false);
    }
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!productName.trim() || !productPrice || !productCategory.trim()) return;
    setBusy(true);
    setBanner('');
    try {
      await api('/api/admin/products', {
        method: 'POST',
        body: {
          name: productName.trim(),
          price: parseFloat(productPrice),
          category: productCategory.trim(),
          image: productImage.trim() || null,
          description: '',
          stars: 0,
          date: new Date().toISOString().slice(0, 10),
        },
      });
      setProductName('');
      setProductPrice('');
      setProductCategory('');
      setProductImage('');
      await loadDashboard();
    } catch (err: unknown) {
      setBanner(err instanceof Error ? err.message : 'Could not add product');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    const u = username.trim();
    if (!u) {
      setLoginError('Enter a username.');
      return;
    }
    if (password.length < 5) {
      setLoginError('Password must be at least 5 characters. Use the same value as ADMIN_PASSWORD in server/.env.');
      return;
    }
    setBusy(true);
    try {
      const data = (await api('/api/auth/login', {
        method: 'POST',
        body: { username: u, password },
        skipAuth: true,
      })) as { token?: string } | null;
      if (!data?.token) {
        setLoginError('Invalid response from server');
        return;
      }
      setToken(data.token);
      setPassword('');
      setIsLoggedIn(true);
    } catch (err: unknown) {
      if (err instanceof TypeError || (err instanceof Error && /fetch|network|failed to load/i.test(err.message))) {
        setLoginError(
          'Cannot reach the API. Run: npm run start --prefix server (Postgres + server/.env). Default dev URL is http://localhost:3002 — PORT in server/.env must match API_PROXY_TARGET (or the Vite default); restart npm run dev after changing either.'
        );
      } else {
        setLoginError(err instanceof Error ? err.message : 'Login failed');
      }
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteCoupon = async (id) => {
    setBusy(true);
    setBanner('');
    try {
      await api(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      await loadDashboard();
    } catch (err: unknown) {
      setBanner(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const handleDeleteProduct = async (id) => {
    setBusy(true);
    setBanner('');
    try {
      await api(`/api/admin/products/${id}`, { method: 'DELETE' });
      await loadDashboard();
    } catch (err: unknown) {
      setBanner(err instanceof Error ? err.message : 'Delete failed');
    } finally {
      setBusy(false);
    }
  };

  const handleLogout = () => {
    setToken(null);
    setIsLoggedIn(false);
    setProducts([]);
    setCoupons([]);
  };

  if (!isLoggedIn || !getToken()) {
    return (
      <main className="admin-container">
        <section className="admin-header">
          <h1>Admin Login</h1>
        </section>
        <section className="admin-content">
          <form onSubmit={handleLogin} className="admin-form" style={{ maxWidth: 400, margin: '0 auto' }}>
            <div className="form-group mb-3">
              <label htmlFor="username" className="form-label">
                Username
              </label>
              <input
                type="text"
                id="username"
                className="form-control"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoComplete="username"
                disabled={busy}
              />
            </div>
            <div className="form-group mb-3">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                minLength={5}
                required
                disabled={busy}
              />
            </div>
            <p className="text-muted small">Default dev login: admin / admin (must match ADMIN_PASSWORD in server/.env, min 5 characters).</p>
            {loginError && <div className="alert alert-danger">{loginError}</div>}
            <button type="submit" className="btn btn-primary w-100" disabled={busy}>
              {busy ? 'Signing in…' : 'Login'}
            </button>
          </form>
        </section>
      </main>
    );
  }

  return (
    <main className="admin-container">
      <section className="admin-header d-flex justify-content-between align-items-center flex-wrap gap-2">
        <h1 className="mb-0">
          Admin Dashboard <IconUserShield size={32} color="#E94F37" style={{ verticalAlign: 'middle', marginLeft: 8 }} />
        </h1>
        <button type="button" className="btn btn-outline-secondary" onClick={handleLogout} disabled={busy}>
          Log out
        </button>
      </section>

      {banner && (
        <div className="alert alert-warning mx-3 mt-2" role="alert">
          {banner}
        </div>
      )}

      <section className="admin-content">
        <div className="d-flex gap-4 flex-column flex-lg-row">
          <section className="w-100 w-lg-50">
            <div className="card mb-4">
              <div className="card-header bg-primary text-white">
                <h2 className="card-title mb-0">Manage Coupons</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddCoupon} className="admin-form">
                  <div className="form-group mb-3">
                    <label htmlFor="couponCode" className="form-label">
                      Coupon Code
                    </label>
                    <input
                      type="text"
                      id="couponCode"
                      className="form-control"
                      placeholder="SAVE20"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="couponDiscount" className="form-label">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      id="couponDiscount"
                      className="form-control"
                      min={1}
                      max={100}
                      value={couponDiscount}
                      onChange={(e) => setCouponDiscount(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <button type="submit" className="btn btn-primary" disabled={busy}>
                    Add Coupon
                  </button>
                </form>

                <div className="mt-4">
                  <h3>Active Coupons</h3>
                  {coupons.length > 0 ? (
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Code</th>
                          <th>Discount</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {coupons.map((coupon) => (
                          <tr key={coupon.id}>
                            <td>{coupon.code}</td>
                            <td>{coupon.discount}%</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteCoupon(coupon.id)}
                                disabled={busy}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">No coupons yet.</p>
                  )}
                </div>
              </div>
            </div>
          </section>

          <section className="w-100 w-lg-50">
            <div className="card mb-4">
              <div className="card-header bg-success text-white">
                <h2 className="card-title mb-0">Manage Products</h2>
              </div>
              <div className="card-body">
                <form onSubmit={handleAddProduct} className="admin-form">
                  <div className="form-group mb-3">
                    <label htmlFor="productName" className="form-label">
                      Product Name
                    </label>
                    <input
                      type="text"
                      id="productName"
                      className="form-control"
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="productPrice" className="form-label">
                      Price ($)
                    </label>
                    <input
                      type="number"
                      id="productPrice"
                      className="form-control"
                      step="0.01"
                      min={0}
                      value={productPrice}
                      onChange={(e) => setProductPrice(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="productCategory" className="form-label">
                      Category
                    </label>
                    <input
                      type="text"
                      id="productCategory"
                      className="form-control"
                      value={productCategory}
                      onChange={(e) => setProductCategory(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <div className="form-group mb-3">
                    <label htmlFor="productImage" className="form-label">
                      Image path or URL
                    </label>
                    <input
                      type="text"
                      id="productImage"
                      className="form-control"
                      placeholder="/images/keyboard.jpg"
                      value={productImage}
                      onChange={(e) => setProductImage(e.target.value)}
                      disabled={busy}
                    />
                  </div>
                  <button type="submit" className="btn btn-success" disabled={busy}>
                    Add Product
                  </button>
                </form>

                <div className="mt-4">
                  <h3>Products</h3>
                  {products.length > 0 ? (
                    <table className="table table-striped table-sm">
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Price</th>
                          <th>Category</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {products.map((product) => (
                          <tr key={product.id}>
                            <td>
                              <img
                                src={
                                  product.image && product.image.startsWith('http')
                                    ? product.image
                                    : product.image?.startsWith('/')
                                      ? product.image
                                      : `/images/${product.image}`
                                }
                                alt={product.name}
                                style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.src = '/images/placeholder.png';
                                }}
                              />
                            </td>
                            <td>{product.name}</td>
                            <td>${Number(product.price).toFixed(2)}</td>
                            <td>{product.category}</td>
                            <td>
                              <button
                                type="button"
                                className="btn btn-danger btn-sm"
                                onClick={() => handleDeleteProduct(product.id)}
                                disabled={busy}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <p className="text-muted">No products in database.</p>
                  )}
                </div>
              </div>
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

export default Adm;
