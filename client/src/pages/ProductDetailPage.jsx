import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProductStore } from '../store/productStore.js';
import { useCartStore } from '../store/cartStore.js';
import { useAuthStore } from '../store/authStore.js';
import ProductViewer3D from '../components/three/ProductViewer3D.jsx';
import SectionTag from '../components/ui/SectionTag.jsx';
import GoldButton from '../components/ui/GoldButton.jsx';
import GhostButton from '../components/ui/GhostButton.jsx';
import ProductCard from '../components/ui/ProductCard.jsx';
import GoldLine from '../components/ui/GoldLine.jsx';
import IssueLoader from '../components/ui/IssueLoader.jsx';
import { Star, ShieldCheck, Truck, RefreshCcw, Plus, Minus, ShieldAlert } from 'lucide-react';
import { getProductImageUrl, getDiscountPercent } from '../utils/products.js';
import api from '../services/api.js';

export function ProductDetailPage() {
  const { id: slug } = useParams();
  const navigate = useNavigate();
  const { activeProduct, fetchProductDetails, relatedProducts, loading, error } = useProductStore();
  const { addItem } = useCartStore();
  const { user } = useAuthStore();

  const [activeFlavor, setActiveFlavor] = useState(null);
  const [activeSize, setActiveSize] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('overview');
  const [imageExpanded, setImageExpanded] = useState(false);

  // Review states
  const [reviews, setReviews] = useState([]);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');
  const [reviewSuccess, setReviewSuccess] = useState('');
  const [reviewError, setReviewError] = useState('');

  // Fetch product detail and related products
  useEffect(() => {
    const loadData = async () => {
      const prod = await fetchProductDetails(slug);
      if (prod) {
        if (prod.flavors && prod.flavors.length > 0) {
          setActiveFlavor(prod.flavors[0]);
        }
        if (prod.sizes && prod.sizes.length > 0) {
          setActiveSize(prod.sizes[0]);
        }

        // Fetch reviews
        try {
          const res = await api.get(`/reviews/${prod._id}`);
          setReviews(res.data);
        } catch (e) {
          setReviews([]);
        }
      }
    };

    loadData();
    setQuantity(1);
    setReviewText('');
    setReviewSuccess('');
    setReviewError('');
    setImageExpanded(false);
  }, [slug, fetchProductDetails]);

  useEffect(() => {
    if (!imageExpanded) return;

    const onKeyDown = (e) => {
      if (e.key === 'Escape') setImageExpanded(false);
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [imageExpanded]);

  if (loading) {
    return (
      <IssueLoader
        title="Loading"
        subtitle="LOADING PRODUCT FORMULATION..."
      />
    );
  }

  if (!activeProduct || error) {
    return (
      <IssueLoader
        title="Loading"
        subtitle={error ? 'FAILED TO LOAD PRODUCT DATA.' : 'PRODUCT NOT FOUND.'}
        action={
          <Link to="/products" className="btn-gold">
            BROWSE CATALOG
          </Link>
        }
      />
    );
  }

  const currentFlavor = activeFlavor || activeProduct.flavors?.[0];
  const currentSize = activeSize || activeProduct.sizes?.[0];

  if (!currentFlavor || !currentSize) {
    return null;
  }

  const discount = getDiscountPercent(currentSize.mrp, currentSize.price);
  const imageUrl = getProductImageUrl(activeProduct.image);

  const handleAddToCart = () => {
    if (!activeProduct.purchasable) return;
    addItem({
      product: activeProduct._id,
      name: activeProduct.name,
      flavor: currentFlavor.name,
      size: currentSize.weight,
      price: currentSize.price,
      image: activeProduct.image,
      quantity: quantity,
    });
    navigate('/cart');
  };

  const handleWriteReview = async (e) => {
    e.preventDefault();
    if (!reviewText.trim()) return;

    try {
      const res = await api.post('/reviews', {
        productId: activeProduct._id,
        rating: reviewRating,
        text: reviewText
      });
      setReviewSuccess('Review submitted successfully!');
      setReviews(prev => [res.data, ...prev]);
      setReviewText('');
      
      // Reload product details to update average score
      fetchProductDetails(slug);
    } catch (err) {
      setReviewError(err.response?.data?.message || 'Failed to submit review');
    }
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Breadcrumbs */}
        <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', letterSpacing: '2px', marginBottom: '40px' }}>
          <Link to="/" style={{ color: 'inherit', textDecoration: 'none' }}>HOME</Link> &gt; 
          <Link to="/products" style={{ color: 'inherit', textDecoration: 'none', marginLeft: '6px' }}> PRODUCTS</Link> &gt; 
          <span style={{ color: 'var(--gold)', marginLeft: '6px' }}>{activeProduct.name}</span>
        </div>

        {/* Above Fold Info Panel */}
        <div style={{ display: 'grid', gridTemplateColumns: '55% 45%', gap: '60px', marginBottom: '80px' }} className="product-fold-layout">
          
          {/* Left - Product image + 3D accent */}
          <div style={{ background: 'var(--black3)', border: '1px solid rgba(255, 255, 255, 0.03)', padding: '24px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ flex: 1, minHeight: '520px', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', background: 'var(--black4)' }}>
              {imageUrl ? (
                <button
                  type="button"
                  onClick={() => setImageExpanded(true)}
                  className="interactive-element"
                  aria-label="View larger product image"
                  style={{
                    background: 'none',
                    border: 'none',
                    padding: 0,
                    cursor: 'zoom-in',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '100%',
                    height: '100%',
                  }}
                >
                  <img
                    src={imageUrl}
                    alt={`${activeProduct.name} - ${activeProduct.flavor}`}
                    style={{ maxWidth: '100%', maxHeight: '500px', width: 'auto', objectFit: 'contain' }}
                  />
                </button>
              ) : (
                <div style={{ width: '100%', height: '500px' }}>
                  <ProductViewer3D flavorColor={currentFlavor.colorHex} />
                </div>
              )}
            </div>

            {/* Flavor chips row under canvas */}
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '20px', textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', letterSpacing: '2px', display: 'block', marginBottom: '14px' }}>
                SELECT FLAVOR CORE
              </span>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '14px' }}>
                {activeProduct.flavors.map((flavor, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveFlavor(flavor)}
                    className="interactive-element"
                    title={flavor.name}
                    style={{
                      width: '32px',
                      height: '32px',
                      borderRadius: '50%',
                      background: flavor.colorHex,
                      border: currentFlavor.name === flavor.name ? '2px solid var(--white)' : '2px solid transparent',
                      cursor: 'pointer',
                      boxShadow: currentFlavor.name === flavor.name ? '0 0 15px ' + flavor.colorHex : 'none',
                      transition: 'all 0.3s ease'
                    }}
                  />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--ff-display)', fontSize: '20px', color: 'var(--gold)', letterSpacing: '1px', display: 'block', marginTop: '12px' }}>
                {currentFlavor.name.toUpperCase()}
              </span>
            </div>
          </div>

          {/* Right - Buy Box info panel */}
          <div>
            <SectionTag text={activeProduct.category} />
            <h1 style={{ fontSize: 'clamp(36px, 4vw, 56px)', marginBottom: '8px', lineHeight: '1' }}>{activeProduct.name}</h1>
            <p style={{ fontFamily: 'var(--ff-mono)', fontSize: '13px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '12px', textTransform: 'uppercase' }}>
              Flavor: {activeProduct.flavor}
            </p>
            {activeProduct.tags?.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {activeProduct.tags.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      fontFamily: 'var(--ff-mono)',
                      fontSize: '9px',
                      fontWeight: 'bold',
                      letterSpacing: '2px',
                      background: 'rgba(201, 168, 76, 0.15)',
                      color: 'var(--gold)',
                      padding: '4px 10px',
                      border: '1px solid rgba(201, 168, 76, 0.3)',
                      textTransform: 'uppercase',
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Rating summary */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px' }}>
              <div style={{ display: 'flex', color: 'var(--gold-bright)' }}>
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={16} 
                    fill={i < Math.floor(activeProduct.rating) ? 'var(--gold-bright)' : 'none'} 
                    strokeWidth={1.5}
                  />
                ))}
              </div>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '12px', color: 'var(--white)' }}>
                {activeProduct.rating} / 5.0
              </span>
              <span style={{ color: 'rgba(255,255,255,0.2)' }}>|</span>
              <a href="#tab-section" onClick={() => setActiveTab('reviews')} style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', textDecoration: 'none' }}>
                ({reviews.length || activeProduct.reviewCount} ATHLETE REVIEWS)
              </a>
            </div>

            {/* Price Box */}
            {activeProduct.purchasable ? (
              <div style={{ background: 'var(--black3)', padding: '24px', borderLeft: '3px solid var(--gold)', marginBottom: '30px' }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '16px', flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: 'var(--ff-display)', fontSize: '44px', color: 'var(--white)' }}>
                    ₹{currentSize.price.toLocaleString('en-IN')}
                  </span>
                  {currentSize.mrp > 0 && (
                    <span style={{ fontSize: '16px', textDecoration: 'line-through', color: 'var(--white-muted)' }}>
                      MRP ₹{currentSize.mrp.toLocaleString('en-IN')}
                    </span>
                  )}
                  {discount > 0 && (
                    <span style={{ background: 'var(--terminal-green)', color: 'var(--black)', fontSize: '11px', fontFamily: 'var(--ff-mono)', fontWeight: 'bold', padding: '2px 8px' }}>
                      {discount}% OFF
                    </span>
                  )}
                </div>
                <p style={{ fontSize: '13px', color: 'var(--terminal-green)', marginTop: '8px', fontFamily: 'var(--ff-mono)' }}>
                  INCLUSIVE OF ALL TAXES · FREE SHIPPING IN INDIA
                </p>
              </div>
            ) : (
              <div style={{ background: 'var(--black3)', padding: '24px', borderLeft: '3px solid var(--gold)', marginBottom: '30px' }}>
                <p style={{ fontSize: '16px', lineHeight: '1.6' }}>{activeProduct.description}</p>
                <Link to="/products" className="btn-gold" style={{ display: 'inline-block', marginTop: '16px', padding: '12px 24px' }}>
                  EXPLORE ALL PRODUCTS
                </Link>
              </div>
            )}

            {/* Size Selectors */}
            <div style={{ marginBottom: '30px' }}>
              <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '10px', color: 'var(--white-muted)', letterSpacing: '2px', display: 'block', marginBottom: '12px' }}>
                SELECT CONTAINER SIZE
              </span>
              <div style={{ display: 'flex', gap: '12px' }}>
                {activeProduct.sizes.map((sizeOption, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveSize(sizeOption)}
                    className="interactive-element"
                    style={{
                      padding: '12px 24px',
                      background: currentSize.weight === sizeOption.weight ? 'rgba(201, 168, 76, 0.08)' : 'var(--black3)',
                      border: currentSize.weight === sizeOption.weight ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.05)',
                      color: currentSize.weight === sizeOption.weight ? 'var(--gold)' : 'var(--white)',
                      fontFamily: 'var(--ff-mono)',
                      fontSize: '12px',
                      fontWeight: 'bold',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                  >
                    {sizeOption.weight.toUpperCase()}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity Selector + Add CTA */}
            {activeProduct.purchasable && (
              <div style={{ display: 'flex', gap: '16px', marginBottom: '40px', alignItems: 'center' }}>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    background: 'var(--black3)',
                    border: '1px solid rgba(255,255,255,0.05)',
                    height: '52px',
                  }}
                >
                  <button
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    style={{ width: '40px', height: '100%', border: 'none', background: 'none', color: '#FFF', cursor: 'pointer' }}
                  >
                    <Minus size={14} />
                  </button>
                  <span style={{ width: '40px', textAlign: 'center', fontFamily: 'var(--ff-display)', fontSize: '20px' }}>
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity((q) => q + 1)}
                    style={{ width: '40px', height: '100%', border: 'none', background: 'none', color: '#FFF', cursor: 'pointer' }}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <GoldButton onClick={handleAddToCart} style={{ flex: 1, height: '52px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  ADD TO ATHLETE STACK
                </GoldButton>
              </div>
            )}

            {/* Key Macros Strip */}
            <div 
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '12px',
                background: 'var(--black3)',
                padding: '20px',
                border: '1px solid rgba(255,255,255,0.02)',
                marginBottom: '40px'
              }}
            >
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)' }}>PROTEIN</div>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: '22px', color: 'var(--gold)', marginTop: '4px' }}>
                  {activeProduct.macros?.protein || 0}g
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)' }}>CARBS</div>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: '22px', color: 'var(--gold)', marginTop: '4px' }}>
                  {activeProduct.macros?.carbs || 0}g
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)' }}>FAT</div>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: '22px', color: 'var(--gold)', marginTop: '4px' }}>
                  {activeProduct.macros?.fat || 0}g
                </div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '10px', fontFamily: 'var(--ff-mono)', color: 'var(--white-muted)' }}>CALORIES</div>
                <div style={{ fontFamily: 'var(--ff-display)', fontSize: '22px', color: 'var(--gold)', marginTop: '4px' }}>
                  {activeProduct.macros?.calories || 0}
                </div>
              </div>
            </div>

            {/* Trust Badges */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <ShieldCheck size={16} style={{ color: 'var(--gold)' }} />
                <span>Lab certified formulation. QR verified batch analysis.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <Truck size={16} style={{ color: 'var(--gold)' }} />
                <span>Free delivery across India. Dispatched in 24 hours.</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '14px' }}>
                <RefreshCcw size={16} style={{ color: 'var(--gold)' }} />
                <span>30-day seal-preserved hassle-free returns support.</span>
              </div>
            </div>

          </div>
        </div>

        {/* Below Fold Tabs */}
        <div id="tab-section" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '40px' }}>
          <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
            {['overview', 'nutrition facts', 'ingredients', 'reviews'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className="interactive-element"
                style={{
                  background: 'none',
                  border: 'none',
                  color: activeTab === tab ? 'var(--gold)' : 'var(--white-muted)',
                  fontFamily: 'var(--ff-display)',
                  fontSize: '20px',
                  letterSpacing: '1px',
                  padding: '16px 0',
                  cursor: 'pointer',
                  borderBottom: activeTab === tab ? '2px solid var(--gold)' : '2px solid transparent',
                  transition: 'all 0.3s ease',
                  textTransform: 'uppercase'
                }}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content Panels */}
        <div style={{ marginBottom: '80px', minHeight: '200px' }}>
          {activeTab === 'overview' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>FORMULA BLUEPRINT</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                {activeProduct.description}
              </p>
            </div>
          )}

          {activeTab === 'nutrition facts' && (
            <div style={{ maxWidth: '400px', background: 'var(--black3)', border: '1px solid rgba(255,255,255,0.05)', padding: '30px' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '4px', textAlign: 'center' }}>NUTRITION FACTS</h3>
              <div style={{ borderBottom: '8px solid var(--white)', marginBottom: '14px' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '4px' }}>
                <span>Serving Size</span>
                <span>{activeProduct.macros?.servingSize || '1 Scoop'}</span>
              </div>
              <div style={{ borderBottom: '4px solid var(--white)', marginBottom: '10px' }}></div>

              <div style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', marginBottom: '10px' }}>Amount Per Serving</div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '18px', fontWeight: 'bold', borderBottom: '4px solid var(--white)', paddingBottom: '6px', marginBottom: '12px' }}>
                <span>CALORIES</span>
                <span>{activeProduct.macros?.calories || 0}</span>
              </div>

              {/* Macro lines */}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '8px' }}>
                <span>Protein</span>
                <strong>{activeProduct.macros?.protein || 0}g</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '8px' }}>
                <span>Total Carbohydrates</span>
                <strong>{activeProduct.macros?.carbs || 0}g</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '15px', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '6px', marginBottom: '12px' }}>
                <span>Total Fat</span>
                <strong>{activeProduct.macros?.fat || 0}g</strong>
              </div>

              <div style={{ fontSize: '11px', color: 'var(--white-muted)', fontStyle: 'italic', lineHeight: '1.4' }}>
                * Percent Daily Values are based on a 2,000 calorie diet. Your daily values may be higher or lower depending on your calorie needs.
              </div>
            </div>
          )}

          {activeTab === 'ingredients' && (
            <div style={{ maxWidth: '800px' }}>
              <h3 style={{ fontSize: '28px', marginBottom: '20px' }}>CERTIFIED INGREDIENT PROFILE</h3>
              <p style={{ fontSize: '16px', lineHeight: '1.8' }}>
                {activeProduct.ingredients}
              </p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '60px' }} className="reviews-layout">
                {/* Reviews List */}
                <div>
                  <h3 style={{ fontSize: '26px', marginBottom: '30px' }}>ATHLETE FEEDBACK</h3>
                  
                  {reviews.length === 0 ? (
                    <div style={{ padding: '40px 0', color: 'var(--white-muted)' }}>
                      No reviews posted yet. Be the first to share your athletic feedback!
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {reviews.map((rev) => (
                        <div key={rev._id} style={{ background: 'var(--black3)', border: '1px solid rgba(255,255,255,0.03)', padding: '24px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '1px' }}>{rev.userName.toUpperCase()}</span>
                            <span style={{ fontSize: '11px', color: 'var(--white-muted)' }}>{new Date(rev.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div style={{ display: 'flex', color: 'var(--gold-bright)', marginBottom: '12px' }}>
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} size={11} fill={i < rev.rating ? 'var(--gold-bright)' : 'none'} strokeWidth={1} />
                            ))}
                            {rev.verified && (
                              <span style={{ fontSize: '9px', fontFamily: 'var(--ff-mono)', color: 'var(--terminal-green)', border: '1px solid var(--terminal-green)', padding: '1px 4px', marginLeft: '12px' }}>
                                VERIFIED ATHLETE
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '14px', lineHeight: '1.5', color: '#FFF' }}>{rev.text}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Post Review Form */}
                <div>
                  <h3 style={{ fontSize: '26px', marginBottom: '30px' }}>WRITE ATHLETE REVIEW</h3>
                  {user ? (
                    <form onSubmit={handleWriteReview} style={{ background: 'var(--black3)', padding: '30px', border: '1px solid rgba(255,255,255,0.05)' }}>
                      
                      {reviewSuccess && (
                        <div style={{ padding: '12px', background: 'rgba(74, 247, 163, 0.1)', color: 'var(--terminal-green)', border: '1px solid var(--terminal-green)', marginBottom: '20px', fontSize: '14px' }}>
                          {reviewSuccess}
                        </div>
                      )}
                      
                      {reviewError && (
                        <div style={{ padding: '12px', background: 'rgba(255, 95, 87, 0.1)', color: 'var(--terminal-red)', border: '1px solid var(--terminal-red)', marginBottom: '20px', fontSize: '14px' }}>
                          {reviewError}
                        </div>
                      )}

                      <div style={{ marginBottom: '20px' }}>
                        <label className="macros-label">RATING (1-5)</label>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              onClick={() => setReviewRating(star)}
                              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--gold-bright)' }}
                            >
                              <Star size={24} fill={star <= reviewRating ? 'var(--gold-bright)' : 'none'} />
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ marginBottom: '30px' }}>
                        <label className="macros-label">REVIEW CONTENT</label>
                        <textarea
                          rows={4}
                          value={reviewText}
                          onChange={(e) => setReviewText(e.target.value)}
                          placeholder="Provide details about taste, mixability, recovery, or strength gains..."
                          className="macros-input"
                          style={{ resize: 'none', height: '120px' }}
                          required
                        />
                      </div>

                      <GoldButton type="submit" style={{ width: '100%' }}>SUBMIT ATHLETE FEEDBACK</GoldButton>
                    </form>
                  ) : (
                    <div style={{ background: 'var(--black3)', border: '1px solid rgba(255, 255, 255, 0.05)', padding: '40px', textAlign: 'center' }}>
                      <ShieldAlert size={36} style={{ color: 'var(--gold)', marginBottom: '16px' }} />
                      <h4 style={{ fontSize: '20px', marginBottom: '8px' }}>AUTH REQUIRED</h4>
                      <p style={{ marginBottom: '20px' }}>You must sign in to submit review logs.</p>
                      <Link to="/login" className="btn-gold" style={{ padding: '10px 24px' }}>SIGN IN</Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        <GoldLine />

        {/* Related Products Section */}
        <div>
          <h2 style={{ fontSize: '36px', marginBottom: '40px', textAlign: 'center' }}>YOU MAY ALSO NEED</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '30px' }}>
            {relatedProducts.map((p) => (
              <ProductCard key={p._id} product={p} />
            ))}
          </div>
        </div>

      </div>

      {imageExpanded && imageUrl && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Expanded product image"
          onClick={() => setImageExpanded(false)}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 10000,
            background: 'rgba(5, 5, 5, 0.94)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '40px',
            cursor: 'zoom-out',
          }}
        >
          <img
            src={imageUrl}
            alt={`${activeProduct.name} - ${activeProduct.flavor}`}
            onClick={(e) => e.stopPropagation()}
            style={{ maxWidth: 'min(95vw, 900px)', maxHeight: '90vh', objectFit: 'contain' }}
          />
        </div>
      )}

      <style>{`
        @media (max-width: 991px) {
          .product-fold-layout {
            grid-template-columns: 1fr !important;
            gap: 40px !important;
          }
          .reviews-layout {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductDetailPage;
