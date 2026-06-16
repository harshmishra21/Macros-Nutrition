import React, { useEffect, useState } from 'react';
import { useProductStore } from '../store/productStore.js';
import ProductCard from '../components/ui/ProductCard.jsx';
import SectionTag from '../components/ui/SectionTag.jsx';
import GhostButton from '../components/ui/GhostButton.jsx';
import { Search, Filter, ChevronLeft, ChevronRight } from 'lucide-react';
import { PRODUCT_CATEGORIES, MAX_CATALOG_PRICE } from '../utils/products.js';

export function ProductsPage() {
  const { products, fetchProducts, loading, totalPages, currentPage, totalProducts } = useProductStore();

  const [category, setCategory] = useState('all');
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [maxPrice, setMaxPrice] = useState(MAX_CATALOG_PRICE);
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('featured');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const filters = {
      category,
      sort,
      page,
      limit: 9,
    };

    if (selectedGoals.length > 0) {
      filters.goal = selectedGoals.join(',');
    }

    if (maxPrice < MAX_CATALOG_PRICE) {
      filters.maxPrice = maxPrice;
    }

    if (search.trim()) {
      filters.search = search;
    }

    fetchProducts(filters);
  }, [category, selectedGoals, maxPrice, search, sort, page, fetchProducts]);

  const handleGoalToggle = (goal) => {
    setSelectedGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
    setPage(1);
  };

  const handleClearFilters = () => {
    setCategory('all');
    setSelectedGoals([]);
    setMaxPrice(MAX_CATALOG_PRICE);
    setSearch('');
    setSort('featured');
    setPage(1);
  };

  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>
        <div style={{ marginBottom: '60px' }}>
          <SectionTag text="PREMIUM SUPPLEMENT CATALOG" />
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '20px' }}>
            ENGINEERED <span className="text-gold-gradient">FORMULAS</span>
          </h1>
          <p style={{ maxWidth: '600px' }}>
            Browse through our sports nutrition catalog. All products are cold-processed, heavy-metal tested, and formulated for pure physical recovery.
          </p>
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            background: 'var(--black3)',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            padding: '16px 24px',
            marginBottom: '40px',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', background: 'var(--black4)', border: '1px solid rgba(255,255,255,0.1)', padding: '10px 16px', width: '100%', maxWidth: '320px' }}>
            <Search size={18} style={{ color: 'var(--white-muted)', marginRight: '10px' }} />
            <input
              type="text"
              placeholder="SEARCH FORMULAS..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--white)',
                fontFamily: 'var(--ff-body)',
                letterSpacing: '1px',
                outline: 'none',
                width: '100%',
              }}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--white-muted)' }}>
              {totalProducts} PRODUCTS
            </span>
            <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--white-muted)' }}>SORT BY:</span>
            <select
              value={sort}
              onChange={(e) => { setSort(e.target.value); setPage(1); }}
              style={{
                background: 'var(--black4)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: 'var(--white)',
                fontFamily: 'var(--ff-body)',
                fontSize: '14px',
                padding: '10px 16px',
                outline: 'none',
                cursor: 'pointer',
              }}
            >
              <option value="featured">FEATURED</option>
              <option value="bestsellers">BESTSELLERS</option>
              <option value="price-asc">PRICE: LOW-HIGH</option>
              <option value="price-desc">PRICE: HIGH-LOW</option>
              <option value="newest">NEWEST ARRIVALS</option>
            </select>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '40px' }} className="products-layout">
          <div
            style={{
              width: '280px',
              flexShrink: 0,
              background: 'var(--black3)',
              border: '1px solid rgba(201, 168, 76, 0.15)',
              padding: '30px',
              height: 'fit-content',
              position: 'sticky',
              top: '120px',
            }}
            className="filter-sidebar"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '30px', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '12px' }}>
              <Filter size={16} style={{ color: 'var(--gold)' }} />
              <span style={{ fontFamily: 'var(--ff-display)', fontSize: '22px', letterSpacing: '1px' }}>FILTERS</span>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h5 style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '16px' }}>CATEGORIES</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '15px' }} className="interactive-element">
                  <input
                    type="radio"
                    name="category"
                    checked={category === 'all'}
                    onChange={() => { setCategory('all'); setPage(1); }}
                    style={{ accentColor: 'var(--gold)' }}
                  />
                  <span style={{ textTransform: 'uppercase' }}>All Products</span>
                </label>
                {PRODUCT_CATEGORIES.map((cat) => (
                  <label key={cat} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '15px' }} className="interactive-element">
                    <input
                      type="radio"
                      name="category"
                      checked={category === cat.toLowerCase().replace(/\s+/g, '-')}
                      onChange={() => { setCategory(cat.toLowerCase().replace(/\s+/g, '-')); setPage(1); }}
                      style={{ accentColor: 'var(--gold)' }}
                    />
                    <span>{cat}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h5 style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px', marginBottom: '16px' }}>FITNESS GOALS</h5>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {[
                  { key: 'muscle', label: 'Muscle Gain' },
                  { key: 'fatloss', label: 'Fat Loss' },
                  { key: 'performance', label: 'Performance' },
                  { key: 'recovery', label: 'Recovery' },
                  { key: 'wellness', label: 'Wellness' },
                ].map((goalObj) => (
                  <label key={goalObj.key} style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer', fontSize: '15px' }} className="interactive-element">
                    <input
                      type="checkbox"
                      checked={selectedGoals.includes(goalObj.key)}
                      onChange={() => handleGoalToggle(goalObj.key)}
                      style={{ accentColor: 'var(--gold)' }}
                    />
                    <span>{goalObj.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div style={{ marginBottom: '40px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <h5 style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--gold)', letterSpacing: '2px' }}>MAX PRICE</h5>
                <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px' }}>₹{maxPrice}</span>
              </div>
              <input
                type="range"
                min="50"
                max={MAX_CATALOG_PRICE}
                step="50"
                value={maxPrice}
                onChange={(e) => { setMaxPrice(Number(e.target.value)); setPage(1); }}
                style={{ width: '100%', accentColor: 'var(--gold)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '11px', color: 'var(--white-muted)', marginTop: '6px' }}>
                <span>₹50</span>
                <span>₹{MAX_CATALOG_PRICE.toLocaleString('en-IN')}+</span>
              </div>
            </div>

            <GhostButton onClick={handleClearFilters} style={{ width: '100%', padding: '12px 20px' }}>
              RESET FILTERS
            </GhostButton>
          </div>

          <div style={{ flex: 1 }}>
            {loading ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
                <span className="text-gold-gradient" style={{ fontFamily: 'var(--ff-display)', fontSize: '28px', letterSpacing: '2px' }}>
                  FETCHING ATHLETE METADATA...
                </span>
              </div>
            ) : products.length === 0 ? (
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px', flexDirection: 'column', gap: '16px' }}>
                <span style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', color: 'var(--white-muted)' }}>NO PRODUCTS MATCH YOUR FILTERS</span>
                <GhostButton onClick={handleClearFilters}>CLEAR FILTERS</GhostButton>
              </div>
            ) : (
              <>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '30px', marginBottom: '60px' }}>
                  {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
                </div>

                {totalPages > 1 && (
                  <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                    <button
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      disabled={currentPage === 1}
                      style={{ background: 'none', border: 'none', color: currentPage === 1 ? 'rgba(255,255,255,0.2)' : 'var(--white)', cursor: 'pointer' }}
                    >
                      <ChevronLeft size={24} />
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setPage(i + 1)}
                        style={{
                          background: currentPage === i + 1 ? 'var(--gold)' : 'var(--black3)',
                          border: currentPage === i + 1 ? '1px solid var(--gold)' : '1px solid rgba(255,255,255,0.1)',
                          color: currentPage === i + 1 ? 'var(--black)' : 'var(--white)',
                          width: '40px',
                          height: '40px',
                          fontFamily: 'var(--ff-mono)',
                          fontWeight: 'bold',
                          cursor: 'pointer',
                          transition: 'all 0.2s',
                        }}
                      >
                        {i + 1}
                      </button>
                    ))}

                    <button
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      disabled={currentPage === totalPages}
                      style={{ background: 'none', border: 'none', color: currentPage === totalPages ? 'rgba(255,255,255,0.2)' : 'var(--white)', cursor: 'pointer' }}
                    >
                      <ChevronRight size={24} />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 991px) {
          .products-layout {
            flex-direction: column !important;
          }
          .filter-sidebar {
            width: 100% !important;
            position: relative !important;
            top: 0 !important;
            margin-bottom: 40px;
          }
        }
        @media (max-width: 600px) {
          .container {
            padding: 0 20px !important;
          }
        }
      `}</style>
    </div>
  );
}

export default ProductsPage;
