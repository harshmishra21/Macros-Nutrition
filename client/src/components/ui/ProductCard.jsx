import React from 'react';
import { Link } from 'react-router-dom';
import { Star, ShoppingCart, Eye } from 'lucide-react';
import { useCartStore } from '../../store/cartStore.js';
import { getProductImageUrl, getDiscountPercent } from '../../utils/products.js';

export function ProductCard({ product }) {
  const { addItem } = useCartStore();

  const defaultSize = product.sizes?.[0] || { weight: 'Standard', price: product.price, mrp: product.mrp };
  const discount = getDiscountPercent(defaultSize.mrp, defaultSize.price);
  const imageUrl = getProductImageUrl(product.image);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.purchasable) return;

    addItem({
      product: product._id,
      name: product.name,
      flavor: product.flavor,
      size: defaultSize.weight,
      price: defaultSize.price,
      image: product.image,
      quantity: 1,
    });
  };

  return (
    <div className="product-card interactive-element" style={{ position: 'relative', display: 'flex', flexDirection: 'column' }}>
      {/* Product Image */}
      <div style={{ position: 'relative', height: '200px', overflow: 'hidden', background: 'var(--black4)', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
        {imageUrl && (
          <img
            src={imageUrl}
            alt={`${product.name} - ${product.flavor}`}
            className="product-card-img"
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'contain',
              padding: '16px',
              transition: 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)',
            }}
            onError={(e) => {
              e.target.style.display = 'none';
            }}
          />
        )}

        {/* Top Badges */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            left: '12px',
            display: 'flex',
            flexDirection: 'column',
            gap: '6px',
            zIndex: 3,
          }}
        >
          <span
            style={{
              fontFamily: 'var(--ff-mono)',
              fontSize: '8px',
              fontWeight: 'bold',
              letterSpacing: '2px',
              background: 'rgba(255,255,255,0.08)',
              color: 'var(--white)',
              padding: '4px 8px',
              border: '1px solid rgba(255,255,255,0.15)',
              textTransform: 'uppercase',
            }}
          >
            {product.category}
          </span>
          {product.tags?.slice(0, 2).map((tag, idx) => (
            <span
              key={idx}
              style={{
                fontFamily: 'var(--ff-mono)',
                fontSize: '8px',
                fontWeight: 'bold',
                letterSpacing: '2px',
                background: 'rgba(201, 168, 76, 0.15)',
                color: 'var(--gold)',
                padding: '4px 8px',
                border: '1px solid rgba(201, 168, 76, 0.3)',
                textTransform: 'uppercase',
              }}
            >
              {tag}
            </span>
          ))}
        </div>

        {discount > 0 && (
          <div
            style={{
              position: 'absolute',
              top: '12px',
              right: '12px',
              background: 'var(--terminal-green)',
              color: 'var(--black)',
              fontFamily: 'var(--ff-mono)',
              fontSize: '9px',
              fontWeight: 'bold',
              padding: '2px 6px',
              zIndex: 3,
            }}
          >
            -{discount}%
          </div>
        )}
      </div>

      {/* Card Content */}
      <div style={{ padding: '24px 20px', flex: 1, display: 'flex', flexDirection: 'column' }}>
        <span
          style={{
            fontFamily: 'var(--ff-mono)',
            fontSize: '9px',
            color: 'var(--gold)',
            letterSpacing: '2px',
            textTransform: 'uppercase',
            display: 'block',
            marginBottom: '6px',
          }}
        >
          {product.flavor}
        </span>

        <h3
          className="product-card-title"
          style={{
            fontFamily: 'var(--ff-display)',
            fontSize: '22px',
            color: 'var(--white)',
            marginBottom: '10px',
            lineHeight: '1.1',
            transition: 'transform 0.3s ease, color 0.3s ease',
          }}
        >
          {product.name.replace('Macros Nutrition ', '')}
        </h3>

        <p
          style={{
            fontSize: '13px',
            lineHeight: '1.5',
            height: '40px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            marginBottom: '14px',
            color: 'var(--white-muted)',
          }}
        >
          {product.shortDesc || product.description}
        </p>

        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '16px' }}>
          <div style={{ display: 'flex', color: 'var(--gold-bright)' }}>
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                size={12}
                fill={i < Math.floor(product.rating || 5) ? 'var(--gold-bright)' : 'none'}
                strokeWidth={1.5}
              />
            ))}
          </div>
          <span style={{ fontFamily: 'var(--ff-mono)', fontSize: '11px', color: 'var(--white-muted)' }}>
            ({product.reviewCount || 10})
          </span>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            paddingTop: '16px',
            marginTop: 'auto',
          }}
        >
          <div>
            <div style={{ fontFamily: 'var(--ff-display)', fontSize: '24px', color: 'var(--gold)' }}>
              {product.purchasable ? `₹${defaultSize.price.toLocaleString('en-IN')}` : '—'}
            </div>
            {defaultSize.mrp > 0 && (
              <div style={{ fontSize: '11px', textDecoration: 'line-through', color: 'var(--white-muted)' }}>
                ₹{defaultSize.mrp.toLocaleString('en-IN')}
              </div>
            )}
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
          {product.purchasable && (
            <button
              onClick={handleAddToCart}
              className="btn-gold interactive-element"
              style={{
                flex: 1,
                padding: '10px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
                fontSize: '11px',
              }}
            >
              <ShoppingCart size={13} />
              <span>ADD</span>
            </button>
          )}
          <Link
            to={`/products/${product.slug}`}
            className="btn-ghost interactive-element"
            style={{
              flex: 1,
              padding: '10px 12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              fontSize: '11px',
              textDecoration: 'none',
            }}
          >
            <Eye size={13} />
            <span>DETAILS</span>
          </Link>
        </div>
      </div>

      <style>{`
        .product-card:hover .product-card-img {
          transform: scale(1.05);
        }
        .product-card:hover .product-card-title {
          transform: translateY(-2px);
          color: var(--gold-bright) !important;
        }
      `}</style>
    </div>
  );
}

export default ProductCard;
