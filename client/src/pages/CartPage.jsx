import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../store/cartStore.js';
import { useAuthStore } from '../store/authStore.js';
import { getProductById, getProductImageUrl } from '../utils/products.js';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import GhostButton from '../components/ui/GhostButton.jsx';
import { Trash2, ShoppingBag, Plus, Minus, CreditCard, Truck, RefreshCcw, ShieldCheck } from 'lucide-react';
import api from '../services/api.js';

export function CartPage() {
  const navigate = useNavigate();
  const { items, updateQuantity, removeItem, clearCart, getTotal } = useCartStore();
  const { user } = useAuthStore();

  const [checkoutStep, setCheckoutStep] = useState('cart'); // cart, shipping, payment, success
  const [shippingName, setShippingName] = useState(user?.name || '');
  const [line1, setLine1] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [phone, setPhone] = useState('');

  const [paymentMethod, setPaymentMethod] = useState('razorpay');
  const [orderResponse, setOrderResponse] = useState(null);
  const [orderLoading, setOrderLoading] = useState(false);
  const [orderError, setOrderError] = useState('');

  const subtotal = getTotal();
  const shipping = subtotal > 999 || subtotal === 0 ? 0 : 99;
  const finalTotal = subtotal + shipping;

  const resolveProduct = (item) => getProductById(item.product);

  const resolveProductDescription = (item) => {
    const product = resolveProduct(item);
    if (product?.description) return product.description;
    if (item.description) return item.description;
    return 'High-quality formula backed by Macros Nutrition.';
  };

  const inferFlavor = (item) => {
    const product = resolveProduct(item);
    if (product?.flavor) return product.flavor;
    if (item.flavor) return item.flavor;
    return 'N/A';
  };

  const inferCategory = (item) => {
    const product = resolveProduct(item);
    if (product?.category) return product.category;
    const lower = (item.name || '').toLowerCase();
    if (lower.includes('protein')) return 'Protein';
    if (lower.includes('pre')) return 'Performance';
    return 'General';
  };

  function CartItemImage({ item }) {
    const product = resolveProduct(item);
    const imgFile = item.image || product?.image;
    const src = imgFile ? getProductImageUrl(imgFile) : null;
    return (
      <div style={{ width: '80px', minWidth: '80px', height: '80px', borderRadius: '8px', overflow: 'hidden', border: '1px solid rgba(201,168,76,0.12)', background: 'var(--black4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        {src ? <img src={src} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : <div style={{ fontSize: '28px' }}>📦</div>}
      </div>
    );
  }

  const handleCheckoutSubmit = async (e) => {
    e.preventDefault();
    if (!shippingName || !line1 || !city || !state || !postalCode || !phone) {
      setOrderError('All shipping address parameters are required.');
      return;
    }
    setCheckoutStep('payment');
  };

  const handlePlaceOrder = async () => {
    if (!user) {
      setOrderError('You must sign in to complete checkout.');
      return;
    }

    setOrderLoading(true);
    setOrderError('');

    try {
      const orderData = {
        items: items.map(i => ({
          product: i.product,
          name: i.name,
          flavor: i.flavor,
          size: i.size,
          quantity: i.quantity,
          price: i.price
        })),
        shippingAddress: {
          name: shippingName,
          line1,
          city,
          state,
          postalCode,
          phone
        },
        paymentMethod,
        paymentId: paymentMethod === 'razorpay' ? 'pay_' + Math.random().toString(36).substring(2, 12) : ''
      };

      const res = await api.post('/orders', orderData);
      setOrderResponse(res.data);
      clearCart();
      setCheckoutStep('success');
    } catch (err) {
      setOrderError(err.response?.data?.message || 'Failed to place order.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (checkoutStep === 'success' && orderResponse) {
    return (
      <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px', display: 'flex', alignItems: 'center' }}>
        <div className="container" style={{ padding: '0 60px', textAlign: 'center', maxWidth: '600px', margin: '0 auto' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: 'rgba(74, 247, 163, 0.1)', color: 'var(--terminal-green)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 30px', border: '2px solid var(--terminal-green)' }}>
            <ShieldCheck size={40} />
          </div>
          <SectionTag text="TRANSACTION METADATA SECURED" />
          <h1 style={{ fontSize: '42px', marginBottom: '16px' }}>ORDER CONFIRMED</h1>
          <p style={{ fontSize: '15px', color: 'var(--white-muted)', marginBottom: '30px', lineHeight: '1.6' }}>
            Athlete order is successfully locked in our system. Processing dispatch immediately.
          </p>

          <div style={{ background: 'var(--black3)', border: '1px solid rgba(201,168,76,0.15)', padding: '24px', textAlign: 'left', marginBottom: '40px', fontFamily: 'var(--ff-mono)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '10px', fontSize: '11px' }}>
              <span>ORDER ID</span>
              <span style={{ color: 'var(--gold)' }}>{orderResponse._id}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '10px', marginBottom: '10px', fontSize: '11px' }}>
              <span>PAYMENT STATE</span>
              <span style={{ color: 'var(--terminal-green)' }}>{orderResponse.paymentStatus.toUpperCase()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px' }}>
              <span>TOTAL AMT</span>
              <span style={{ color: 'var(--gold)' }}>₹{orderResponse.total.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '20px', justifyContent: 'center' }}>
            <Link to="/products" className="btn-gold">CONTINUE SHOPPING</Link>
            {user?.role === 'admin' && <Link to="/admin" className="btn-ghost">VIEW ORDER LOG</Link>}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px' }}>
          <SectionTag text="ATHLETE STACK MANAGER" />
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)' }}>
            YOUR <span className="text-gold-gradient">CART</span>
          </h1>
        </div>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '80px 0', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <ShoppingBag size={48} style={{ color: 'var(--gold)', marginBottom: '20px' }} />
            <h3 style={{ fontSize: '28px', marginBottom: '8px' }}>YOUR CART IS EMPTY</h3>
            <p style={{ marginBottom: '24px' }}>Load customized formulas, stack bundles, or daily vitamins to begin.</p>
            <Link to="/products" className="btn-gold">BROWSE PRODUCTS</Link>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '60px' }} className="cart-layout">
            
            {/* LEFT COLUMN: Steps */}
            <div>
              {/* STEP: CART ITEMS LIST */}
              {checkoutStep === 'cart' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {items.map((item, idx) => (
                    <div 
                      key={idx}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '20px',
                        background: 'var(--black3)',
                        border: '1px solid rgba(255, 255, 255, 0.03)',
                        padding: '20px',
                        position: 'relative'
                      }}
                    >
                      {/* Product details with image, name and description */}
                      {/** Helper: resolve metadata by item.product or item.name **/}
                      <CartItemImage item={item} />
                      <div style={{ flex: 1 }}>
                        <h4 style={{ fontSize: '20px', color: '#FFF', margin: 0 }}>{item.name}</h4>
                        <div style={{ fontSize: '13px', color: 'var(--white-muted)', marginTop: '8px' }}>
                          {resolveProductDescription(item)}
                        </div>
                        <div style={{ display: 'flex', gap: '12px', fontSize: '12px', color: 'var(--white-muted)', marginTop: '8px', fontFamily: 'var(--ff-mono)' }}>
                          <span>SIZE: {item.size}</span>
                          <span>FLAVOR: {inferFlavor(item)}</span>
                          <span>CATEGORY: {inferCategory(item)}</span>
                        </div>
                      </div>

                      {/* Quantity Controls */}
                      <div 
                        style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          background: 'var(--black4)',
                          border: '1px solid rgba(255,255,255,0.05)',
                          height: '36px',
                          marginRight: '20px'
                        }}
                      >
                        <button 
                          onClick={() => updateQuantity(item.product, item.flavor, item.size, item.quantity - 1)}
                          style={{ width: '28px', height: '100%', border: 'none', background: 'none', color: '#FFF', cursor: 'pointer' }}
                        >
                          <Minus size={10} />
                        </button>
                        <span style={{ width: '28px', textAlign: 'center', fontFamily: 'var(--ff-mono)', fontSize: '13px' }}>
                          {item.quantity}
                        </span>
                        <button 
                          onClick={() => updateQuantity(item.product, item.flavor, item.size, item.quantity + 1)}
                          style={{ width: '28px', height: '100%', border: 'none', background: 'none', color: '#FFF', cursor: 'pointer' }}
                        >
                          <Plus size={10} />
                        </button>
                      </div>

                      {/* Price */}
                      <div style={{ fontFamily: 'var(--ff-display)', fontSize: '22px', color: 'var(--gold)', minWidth: '80px', textAlign: 'right' }}>
                        ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                      </div>

                      {/* Trash */}
                      <button 
                        onClick={() => removeItem(item.product, item.flavor, item.size)}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', marginLeft: '12px' }}
                        className="interactive-element trash-btn"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}

              {/* STEP: SHIPPING FORM */}
              {checkoutStep === 'shipping' && (
                <form onSubmit={handleCheckoutSubmit} style={{ background: 'var(--black3)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '40px' }}>
                  <h3 style={{ fontSize: '26px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    ATHLETE SHIPPING DETAILS
                  </h3>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label className="macros-label">FULL CONSIGNEE NAME</label>
                    <input 
                      type="text" 
                      value={shippingName} 
                      onChange={(e) => setShippingName(e.target.value)}
                      className="macros-input"
                      required
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label className="macros-label">SHIPPING ADDRESS LINE 1</label>
                    <input 
                      type="text" 
                      value={line1} 
                      onChange={(e) => setLine1(e.target.value)}
                      className="macros-input"
                      placeholder="Flat, House, Apartment Details"
                      required
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }} className="grid-2-mobile">
                    <div>
                      <label className="macros-label">CITY</label>
                      <input 
                        type="text" 
                        value={city} 
                        onChange={(e) => setCity(e.target.value)}
                        className="macros-input"
                        required
                      />
                    </div>
                    <div>
                      <label className="macros-label">STATE</label>
                      <input 
                        type="text" 
                        value={state} 
                        onChange={(e) => setState(e.target.value)}
                        className="macros-input"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }} className="grid-2-mobile">
                    <div>
                      <label className="macros-label">PIN POSTAL CODE</label>
                      <input 
                        type="text" 
                        value={postalCode} 
                        onChange={(e) => setPostalCode(e.target.value)}
                        className="macros-input"
                        maxLength="6"
                        required
                      />
                    </div>
                    <div>
                      <label className="macros-label">ATHLETE MOBILE NO</label>
                      <input 
                        type="tel" 
                        value={phone} 
                        onChange={(e) => setPhone(e.target.value)}
                        className="macros-input"
                        placeholder="10 digit number"
                        required
                      />
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <GhostButton onClick={() => setCheckoutStep('cart')} style={{ flex: 1 }}>BACK</GhostButton>
                    <GoldButton type="submit" style={{ flex: 1 }}>PROCEED TO SECURE GATEWAY</GoldButton>
                  </div>
                </form>
              )}

              {/* STEP: PAYMENT SHEET */}
              {checkoutStep === 'payment' && (
                <div style={{ background: 'var(--black3)', border: '1px solid rgba(255,255,255,0.05)', padding: '40px' }}>
                  <h3 style={{ fontSize: '26px', marginBottom: '24px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                    SECURE TRANSACTION GATEWAY
                  </h3>

                  {orderError && (
                    <div style={{ padding: '12px', background: 'rgba(255, 95, 87, 0.1)', color: 'var(--terminal-red)', border: '1px solid var(--terminal-red)', marginBottom: '20px' }}>
                      {orderError}
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '40px' }}>
                    <button
                      onClick={() => setPaymentMethod('razorpay')}
                      className="interactive-element"
                      style={{
                        padding: '24px',
                        background: paymentMethod === 'razorpay' ? 'rgba(201, 168, 76, 0.08)' : 'var(--black4)',
                        border: paymentMethod === 'razorpay' ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                        color: paymentMethod === 'razorpay' ? 'var(--gold)' : '#FFF',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', letterSpacing: '1px' }}>UPI / CARD / NETBANKING (RAZORPAY)</div>
                        <span style={{ fontSize: '12px', color: 'var(--white-muted)' }}>Simulate secure instant online transactions in Indian Rupees.</span>
                      </div>
                      <CreditCard size={20} />
                    </button>

                    <button
                      onClick={() => setPaymentMethod('cod')}
                      className="interactive-element"
                      style={{
                        padding: '24px',
                        background: paymentMethod === 'cod' ? 'rgba(201, 168, 76, 0.08)' : 'var(--black4)',
                        border: paymentMethod === 'cod' ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                        color: paymentMethod === 'cod' ? 'var(--gold)' : '#FFF',
                        textAlign: 'left',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <div style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', letterSpacing: '1px' }}>CASH ON DELIVERY (COD)</div>
                        <span style={{ fontSize: '12px', color: 'var(--white-muted)' }}>Pay in cash upon delivery to your doorstep.</span>
                      </div>
                      <span>🚚</span>
                    </button>
                  </div>

                  <div style={{ display: 'flex', gap: '16px' }}>
                    <GhostButton onClick={() => setCheckoutStep('shipping')} style={{ flex: 1 }}>BACK</GhostButton>
                    <GoldButton 
                      onClick={handlePlaceOrder} 
                      disabled={orderLoading}
                      style={{ flex: 1 }}
                    >
                      {orderLoading ? 'TRANSMITTING ORDER...' : 'PLACE ORDER (INR)'}
                    </GoldButton>
                  </div>
                </div>
              )}
            </div>

            {/* RIGHT COLUMN: Order Summary */}
            <div>
              <div 
                className="glass-panel"
                style={{
                  padding: '40px',
                  border: '1px solid rgba(201,168,76,0.15)',
                  position: 'sticky',
                  top: '120px'
                }}
              >
                <h3 style={{ fontSize: '24px', marginBottom: '20px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
                  ORDER SUMMARY
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                    <span style={{ color: 'var(--white-muted)' }}>Subtotal</span>
                    <span>₹{subtotal.toLocaleString('en-IN')}</span>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px' }}>
                    <span style={{ color: 'var(--white-muted)' }}>Shipping Fee</span>
                    <span>{shipping === 0 ? 'FREE' : `₹${shipping}`}</span>
                  </div>

                  {shipping > 0 && (
                    <div style={{ fontSize: '11px', color: 'var(--gold)', fontFamily: 'var(--ff-mono)', marginTop: '-4px' }}>
                      Add ₹{1000 - subtotal} more for FREE shipping
                    </div>
                  )}
                </div>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginBottom: '30px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '18px', fontWeight: 'bold' }}>Total Amount</span>
                    <span style={{ fontFamily: 'var(--ff-display)', fontSize: '32px', color: 'var(--gold)' }}>
                      ₹{finalTotal.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {/* Checkout step CTAs */}
                {checkoutStep === 'cart' && (
                  <div>
                    {user ? (
                      <GoldButton onClick={() => setCheckoutStep('shipping')} style={{ width: '100%', height: '52px' }}>
                        PROCEED TO CHECKOUT
                      </GoldButton>
                    ) : (
                      <div>
                        <Link to="/login" className="btn-gold" style={{ width: '100%', display: 'block', textAlign: 'center', marginBottom: '12px' }}>
                          SIGN IN TO CHECKOUT
                        </Link>
                        <p style={{ fontSize: '11px', textAlign: 'center', color: 'var(--white-muted)' }}>An account is required to catalog orders.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* Trust Seals */}
                <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', marginTop: '30px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <ShieldCheck size={14} style={{ color: 'var(--gold)' }} />
                    <span>Secure SSL encrypted connection.</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '13px' }}>
                    <Truck size={14} style={{ color: 'var(--gold)' }} />
                    <span>Free shipping on orders over ₹999.</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        )}

      </div>

      <style>{`
        .trash-btn:hover {
          color: var(--terminal-red) !important;
        }
        @media (max-width: 991px) {
          .cart-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
        }
        @media (max-width: 480px) {
          .grid-2-mobile {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CartPage;
