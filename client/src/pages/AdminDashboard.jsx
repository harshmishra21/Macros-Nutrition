import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore.js';
import { useProductStore } from '../store/productStore.js';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import GhostButton from '../components/ui/GhostButton.jsx';
import { ShieldCheck, Plus, Trash2, Edit, CheckCircle, Package, ArrowRight, ShieldAlert } from 'lucide-react';
import api from '../services/api.js';

export function AdminDashboard() {
  const { user } = useAuthStore();
  const { products, fetchProducts } = useProductStore();

  const [activeTab, setActiveTab] = useState('orders'); // orders, products, add-product
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  // New Product Form State
  const [newProdName, setNewProdName] = useState('');
  const [newProdSlug, setNewProdSlug] = useState('');
  const [newProdCategory, setNewProdCategory] = useState('protein');
  const [newProdShortDesc, setNewProdShortDesc] = useState('');
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdIngredients, setNewProdIngredients] = useState('');
  
  const [newProdSizeWeight, setNewProdSizeWeight] = useState('1 kg');
  const [newProdSizePrice, setNewProdSizePrice] = useState(1500);
  const [newProdSizeMrp, setNewProdSizeMrp] = useState(1999);

  const [newProdProtein, setNewProdProtein] = useState(24);
  const [newProdCarbs, setNewProdCarbs] = useState(2);
  const [newProdFat, setNewProdFat] = useState(1);
  const [newProdCalories, setNewProdCalories] = useState(120);

  const [formSuccess, setFormSuccess] = useState('');
  const [formError, setFormError] = useState('');

  // Fetch orders log
  const loadOrders = async () => {
    setOrdersLoading(true);
    try {
      const res = await api.get('/orders');
      setOrders(res.data);
    } catch (e) {
      console.error(e);
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (user && user.role === 'admin') {
      loadOrders();
      fetchProducts({ limit: 50 });
    }
  }, [user, fetchProducts]);

  if (!user || user.role !== 'admin') {
    return (
      <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ padding: '0 60px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <ShieldAlert size={60} style={{ color: 'var(--terminal-red)', marginBottom: '20px' }} />
          <SectionTag text="AUTHENTICATION FAILURE" />
          <h1 style={{ fontSize: '42px', marginBottom: '16px' }}>ACCESS DENIED</h1>
          <p style={{ color: 'var(--white-muted)', marginBottom: '30px' }}>
            Administrative clearance credentials are required to view the management console.
          </p>
          <a href="/login" className="btn-gold">SIGN IN AS ADMIN</a>
        </div>
      </div>
    );
  }

  // Handle order status update
  const handleUpdateOrderStatus = async (orderId, status) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status });
      // Reload orders
      loadOrders();
    } catch (e) {
      console.error(e);
    }
  };

  // Handle product deletion
  const handleDeleteProduct = async (prodId) => {
    if (!window.confirm('Confirm deletion of this formulation?')) return;
    try {
      await api.delete(`/products/${prodId}`);
      fetchProducts({ limit: 50 });
    } catch (e) {
      console.error(e);
    }
  };

  // Handle product creation submit
  const handleCreateProductSubmit = async (e) => {
    e.preventDefault();
    setFormSuccess('');
    setFormError('');

    try {
      const payload = {
        name: newProdName,
        slug: newProdSlug,
        category: newProdCategory,
        goals: ['muscle', 'performance'], // default mapping
        flavors: [
          { name: 'Double Chocolate', colorHex: '#8B4513', kcal: newProdCalories, inStock: true }
        ],
        sizes: [
          { weight: newProdSizeWeight, price: Number(newProdSizePrice), mrp: Number(newProdSizeMrp) }
        ],
        shortDesc: newProdShortDesc,
        description: newProdDesc,
        ingredients: newProdIngredients,
        macros: {
          protein: Number(newProdProtein),
          carbs: Number(newProdCarbs),
          fat: Number(newProdFat),
          calories: Number(newProdCalories),
          servingSize: '33g'
        }
      };

      await api.post('/products', payload);
      setFormSuccess('Product formulation added successfully!');
      
      // Reset form
      setNewProdName('');
      setNewProdSlug('');
      setNewProdShortDesc('');
      setNewProdDesc('');
      setNewProdIngredients('');

      fetchProducts({ limit: 50 });
    } catch (err) {
      setFormError(err.response?.data?.message || 'Failed to create product formulation');
    }
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <div>
            <SectionTag text="ADMIN MANAGEMENT CONSOLE" />
            <h1 style={{ fontSize: '42px' }}>CONSOLE WORKSPACE</h1>
          </div>
          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', border: '1px solid var(--gold)', padding: '6px 14px' }}>
            SECURED: {user.name.toUpperCase()} (ADMIN)
          </span>
        </div>

        {/* Tab Selection */}
        <div style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '30px' }}>
            <button
              onClick={() => setActiveTab('orders')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'orders' ? 'var(--gold)' : 'var(--white-muted)',
                fontFamily: 'var(--ff-display)',
                fontSize: '18px',
                padding: '12px 0',
                cursor: 'pointer',
                borderBottom: activeTab === 'orders' ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              ORDER TRANSACTION LOG
            </button>
            <button
              onClick={() => setActiveTab('products')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'products' ? 'var(--gold)' : 'var(--white-muted)',
                fontFamily: 'var(--ff-display)',
                fontSize: '18px',
                padding: '12px 0',
                cursor: 'pointer',
                borderBottom: activeTab === 'products' ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              PRODUCT FORMULATIONS
            </button>
            <button
              onClick={() => setActiveTab('add-product')}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'add-product' ? 'var(--gold)' : 'var(--white-muted)',
                fontFamily: 'var(--ff-display)',
                fontSize: '18px',
                padding: '12px 0',
                cursor: 'pointer',
                borderBottom: activeTab === 'add-product' ? '2px solid var(--gold)' : '2px solid transparent',
                transition: 'all 0.3s'
              }}
            >
              ADD FORMULATION
            </button>
          </div>
        </div>

        {/* Workspace Display */}
        <div>
          
          {/* TAB: ORDERS LOG */}
          {activeTab === 'orders' && (
            <div>
              {ordersLoading ? (
                <div>Loading orders log...</div>
              ) : orders.length === 0 ? (
                <div>No orders cataloged in system database.</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {orders.map((order) => (
                    <div 
                      key={order._id}
                      style={{
                        background: 'var(--black3)',
                        border: '1px solid rgba(255,255,255,0.03)',
                        padding: '24px',
                        display: 'grid',
                        gridTemplateColumns: '1.5fr 1fr 1fr',
                        gap: '30px'
                      }}
                      className="admin-order-row"
                    >
                      {/* Order info */}
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                          <Package size={16} style={{ color: 'var(--gold)' }} />
                          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)' }}>ORDER: {order._id}</span>
                        </div>
                        <h4 style={{ fontSize: '20px', color: '#FFF', marginBottom: '12px' }}>{order.user?.name || 'Anonymous User'}</h4>
                        <div style={{ fontSize: '13px', color: 'var(--white-muted)' }}>
                          <strong>SHIPPING:</strong> {order.shippingAddress.line1}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
                        </div>
                        <div style={{ fontSize: '13px', color: 'var(--white-muted)', marginTop: '4px' }}>
                          <strong>PHONE:</strong> {order.shippingAddress.phone}
                        </div>
                      </div>

                      {/* Items details */}
                      <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '24px' }}>
                        <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--white-muted)', display: 'block', marginBottom: '8px' }}>ITEMS BUNDLE</span>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          {order.items.map((it, idx) => (
                            <div key={idx} style={{ fontSize: '13px' }}>
                              {it.quantity} x {it.name} ({it.size})
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Price, Status & Actions */}
                      <div style={{ borderLeft: '1px solid rgba(255,255,255,0.05)', paddingLeft: '24px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--white-muted)' }}>TOTAL VALUE</span>
                          <span style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', color: 'var(--gold)' }}>₹{order.total}</span>
                        </div>

                        {/* Status Selectors */}
                        <div style={{ marginTop: '16px' }}>
                          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--white-muted)', display: 'block', marginBottom: '8px' }}>DISPATCH STATUS</span>
                          <select
                            value={order.status}
                            onChange={(e) => handleUpdateOrderStatus(order._id, e.target.value)}
                            style={{
                              width: '100%',
                              background: 'var(--black4)',
                              border: '1px solid rgba(255,255,255,0.1)',
                              color: 'var(--white)',
                              fontFamily: 'var(--ff-body)',
                              padding: '8px 12px',
                              outline: 'none',
                              cursor: 'pointer'
                            }}
                          >
                            <option value="pending">PENDING</option>
                            <option value="processing">PROCESSING</option>
                            <option value="shipped">SHIPPED</option>
                            <option value="delivered">DELIVERED</option>
                            <option value="cancelled">CANCELLED</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB: PRODUCTS CATALOG */}
          {activeTab === 'products' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {products.map((p) => (
                <div 
                  key={p._id}
                  style={{
                    background: 'var(--black3)',
                    border: '1px solid rgba(255,255,255,0.03)',
                    padding: '20px 30px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '9px', color: 'var(--gold)', letterSpacing: '2px', textTransform: 'uppercase' }}>{p.category}</span>
                    <h4 style={{ fontSize: '22px', margin: 0, color: '#FFF' }}>{p.name}</h4>
                    <span style={{ fontSize: '12px', color: 'var(--white-muted)' }}>SLUG: {p.slug}</span>
                  </div>

                  <div style={{ display: 'flex', gap: '30px', alignItems: 'center' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', color: 'var(--gold)' }}>₹{p.sizes?.[0]?.price || 0}</div>
                      <span style={{ fontSize: '11px', color: 'var(--white-muted)' }}>{p.sizes?.[0]?.weight || ''}</span>
                    </div>

                    <button
                      onClick={() => handleDeleteProduct(p._id)}
                      style={{ background: 'none', border: 'none', color: 'var(--terminal-red)', cursor: 'pointer' }}
                      className="interactive-element"
                      title="Delete product formulation"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB: ADD PRODUCT FORM */}
          {activeTab === 'add-product' && (
            <form onSubmit={handleCreateProductSubmit} style={{ background: 'var(--black3)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '40px', maxWidth: '800px', margin: '0 auto' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                ADD NEW SUPPLEMENT FORMULATION
              </h3>

              {formSuccess && (
                <div style={{ padding: '12px', background: 'rgba(74, 247, 163, 0.1)', color: 'var(--terminal-green)', border: '1px solid var(--terminal-green)', marginBottom: '24px', fontSize: '14px' }}>
                  {formSuccess}
                </div>
              )}

              {formError && (
                <div style={{ padding: '12px', background: 'rgba(255, 95, 87, 0.1)', color: 'var(--terminal-red)', border: '1px solid var(--terminal-red)', marginBottom: '24px', fontSize: '14px' }}>
                  {formError}
                </div>
              )}

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="macros-label">PRODUCT NAME</label>
                  <input 
                    type="text" 
                    value={newProdName} 
                    onChange={(e) => setNewProdName(e.target.value)}
                    className="macros-input"
                    placeholder="e.g. MASS GAINER - BULK MATRIX"
                    required
                  />
                </div>
                <div>
                  <label className="macros-label">URL SLUG</label>
                  <input 
                    type="text" 
                    value={newProdSlug} 
                    onChange={(e) => setNewProdSlug(e.target.value)}
                    className="macros-input"
                    placeholder="e.g. mass-gainer-bulk"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
                <div>
                  <label className="macros-label">CATEGORY</label>
                  <select
                    value={newProdCategory}
                    onChange={(e) => setNewProdCategory(e.target.value)}
                    className="macros-input"
                  >
                    <option value="protein">PROTEIN</option>
                    <option value="pre-workout">PRE-WORKOUT</option>
                    <option value="creatine">CREATINE</option>
                    <option value="vitamins">VITAMINS</option>
                    <option value="functional-foods">FUNCTIONAL FOODS</option>
                    <option value="hydration">HYDRATION</option>
                  </select>
                </div>
                <div>
                  <label className="macros-label">SHORT EXPLANATION (TAGLINE)</label>
                  <input 
                    type="text" 
                    value={newProdShortDesc} 
                    onChange={(e) => setNewProdShortDesc(e.target.value)}
                    className="macros-input"
                    placeholder="e.g. Mass builder with 50g raw protein."
                    required
                  />
                </div>
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="macros-label">DETAILED FORMULATION SUMMARY</label>
                <textarea 
                  rows="3"
                  value={newProdDesc} 
                  onChange={(e) => setNewProdDesc(e.target.value)}
                  className="macros-input"
                  placeholder="Explain protein source, digestive efficiency, and loading directions..."
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              <div style={{ marginBottom: '20px' }}>
                <label className="macros-label">INGREDIENT DECLARATION</label>
                <textarea 
                  rows="2"
                  value={newProdIngredients} 
                  onChange={(e) => setNewProdIngredients(e.target.value)}
                  className="macros-input"
                  placeholder="e.g. Whey Protein Concentrate, Cocoa, Lecithin, Stevia..."
                  style={{ resize: 'none' }}
                  required
                />
              </div>

              {/* Sizing options */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                  <label className="macros-label">WEIGHT / UNIT</label>
                  <input 
                    type="text" 
                    value={newProdSizeWeight} 
                    onChange={(e) => setNewProdSizeWeight(e.target.value)}
                    className="macros-input"
                    required
                  />
                </div>
                <div>
                  <label className="macros-label">SELLING PRICE (₹)</label>
                  <input 
                    type="number" 
                    value={newProdSizePrice} 
                    onChange={(e) => setNewProdSizePrice(e.target.value)}
                    className="macros-input"
                    required
                  />
                </div>
                <div>
                  <label className="macros-label">MRP LIST PRICE (₹)</label>
                  <input 
                    type="number" 
                    value={newProdSizeMrp} 
                    onChange={(e) => setNewProdSizeMrp(e.target.value)}
                    className="macros-input"
                    required
                  />
                </div>
              </div>

              {/* Nutrition Macros */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '30px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px' }}>
                <div>
                  <label className="macros-label">PROTEIN (G)</label>
                  <input type="number" value={newProdProtein} onChange={(e) => setNewProdProtein(Number(e.target.value))} className="macros-input" required />
                </div>
                <div>
                  <label className="macros-label">CARBS (G)</label>
                  <input type="number" value={newProdCarbs} onChange={(e) => setNewProdCarbs(Number(e.target.value))} className="macros-input" required />
                </div>
                <div>
                  <label className="macros-label">FAT (G)</label>
                  <input type="number" value={newProdFat} onChange={(e) => setNewProdFat(Number(e.target.value))} className="macros-input" required />
                </div>
                <div>
                  <label className="macros-label">CALORIES</label>
                  <input type="number" value={newProdCalories} onChange={(e) => setNewProdCalories(Number(e.target.value))} className="macros-input" required />
                </div>
              </div>

              <GoldButton type="submit" style={{ width: '100%', height: '52px' }}>
                SAVE NEW FORMULATION TO CATALOG
              </GoldButton>
            </form>
          )}

        </div>

      </div>

      <style>{`
        @media (max-width: 900px) {
          .admin-order-row {
            grid-template-columns: 1fr !important;
            gap: 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default AdminDashboard;
