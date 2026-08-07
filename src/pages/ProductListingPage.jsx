import React, { useState, useMemo } from 'react';
import { SearchX, Filter, ArrowLeft, X, SlidersHorizontal, ChevronDown, Check } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { PRODUCTS_DATA } from '../data/products';
import { ProductCard } from '../components/ProductCard';

export const ProductListingPage = () => {
  const { filters, setFilters, formatINR } = useStore();
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Local draft state for mobile filter drawer
  const [draftFilters, setDraftFilters] = useState(filters);

  const openMobileFilter = () => {
    setDraftFilters(filters);
    setMobileFilterOpen(true);
  };

  const applyMobileFilter = () => {
    setFilters(draftFilters);
    setMobileFilterOpen(false);
  };

  const resetFilters = () => {
    const defaultF = { search: '', category: 'All', brand: 'All', maxPrice: 200000, sort: 'popularity' };
    setFilters(defaultF);
    setDraftFilters(defaultF);
  };

  const filtered = useMemo(() => {
    let result = PRODUCTS_DATA.filter(p => {
      const matchCat = filters.category === 'All' || p.category === filters.category || (filters.category === 'Apple' && p.subCategory === 'Apple');
      const matchBrand = filters.brand === 'All' || p.brand === filters.brand;
      const matchSearch = !filters.search || p.name.toLowerCase().includes(filters.search.toLowerCase()) || p.brand.toLowerCase().includes(filters.search.toLowerCase());
      const matchPrice = p.price <= filters.maxPrice;
      return matchCat && matchBrand && matchSearch && matchPrice;
    });

    if (filters.sort === 'price-low') result.sort((a, b) => a.price - b.price);
    if (filters.sort === 'price-high') result.sort((a, b) => b.price - a.price);
    if (filters.sort === 'rating') result.sort((a, b) => b.rating - a.rating);

    return result;
  }, [filters]);

  const activeFilterCount = (filters.category !== 'All' ? 1 : 0) + (filters.brand !== 'All' ? 1 : 0) + (filters.maxPrice < 200000 ? 1 : 0) + (filters.search ? 1 : 0);

  return (
    <div className="container">
      {/* MOBILE TOP CONTROLS & FILTER TRIGGER BAR */}
      <div className="mobile-listing-controls">
        <div className="mobile-listing-title-row">
          <div>
            <h2 className="mobile-category-title">
              {filters.category === 'All' ? 'All Products' : filters.category}
            </h2>
            <span className="mobile-product-count">{filtered.length} Items found</span>
          </div>
          {filters.search && <span className="badge badge-blue">Search: "{filters.search}"</span>}
        </div>

        <div className="mobile-filter-bar">
          <button className={`mobile-filter-chip ${activeFilterCount > 0 ? 'active' : ''}`} onClick={openMobileFilter}>
            <SlidersHorizontal size={14} />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          <button className={`mobile-filter-chip ${filters.brand !== 'All' ? 'active' : ''}`} onClick={openMobileFilter}>
            <span>Brand: {filters.brand}</span>
            <ChevronDown size={12} />
          </button>

          <button className={`mobile-filter-chip ${filters.maxPrice < 200000 ? 'active' : ''}`} onClick={openMobileFilter}>
            <span>Under {formatINR(filters.maxPrice)}</span>
            <ChevronDown size={12} />
          </button>

          <select 
            className="mobile-sort-select"
            value={filters.sort} 
            onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
          >
            <option value="popularity">Popularity</option>
            <option value="price-low">Price: Low to High</option>
            <option value="price-high">Price: High to Low</option>
            <option value="rating">Rating</option>
          </select>
        </div>
      </div>

      <div className="listing-layout">
        {/* Desktop Sidebar */}
        <aside className="filter-sidebar desktop-filter-sidebar">
          <div className="filter-group">
            <h3 className="filter-title">Category</h3>
            <div className="filter-checkbox-list">
              {['All', 'Mobiles', 'Apple', 'Wearables', 'Audio', 'Chargers & Cables', 'Accessories'].map(c => (
                <label key={c} className="filter-checkbox-item">
                  <input 
                    type="radio" 
                    name="catFilter" 
                    checked={filters.category === c} 
                    onChange={() => setFilters(f => ({ ...f, category: c }))} 
                  />
                  {c}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Brand</h3>
            <div className="filter-checkbox-list">
              {['All', 'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Google', 'boAt'].map(b => (
                <label key={b} className="filter-checkbox-item">
                  <input 
                    type="radio" 
                    name="brandFilter" 
                    checked={filters.brand === b} 
                    onChange={() => setFilters(f => ({ ...f, brand: b }))} 
                  />
                  {b}
                </label>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <h3 className="filter-title">Max Price: {formatINR(filters.maxPrice)}</h3>
            <input 
              type="range" 
              min="2000" 
              max="200000" 
              step="5000" 
              value={filters.maxPrice} 
              style={{ width: '100%' }} 
              onChange={(e) => setFilters(f => ({ ...f, maxPrice: Number(e.target.value) }))} 
            />
          </div>

          <button className="btn btn-outline btn-sm" style={{ width: '100%' }} onClick={resetFilters}>
            Reset All Filters
          </button>
        </aside>

        {/* Products Grid Content */}
        <main className="listing-main-content">
          <div className="listing-header desktop-only-header">
            <div>
              <h2 style={{ fontWeight: 800, fontSize: '1.25rem' }}>Showing {filtered.length} Products</h2>
              {filters.search && <span className="badge badge-blue">Search: "{filters.search}"</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Sort By:</label>
              <select 
                className="sort-select" 
                value={filters.sort} 
                onChange={(e) => setFilters(f => ({ ...f, sort: e.target.value }))}
              >
                <option value="popularity">Popularity</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Customer Rating</option>
              </select>
            </div>
          </div>

          {filtered.length > 0 ? (
            <div className="products-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', background: '#FFFFFF', borderRadius: 'var(--radius-lg)' }}>
              <SearchX style={{ width: 48, height: 48, color: 'var(--text-muted)', marginBottom: '1rem' }} />
              <h3>No products matched your selected filters</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '1rem', fontSize: '0.85rem' }}>Try clearing your search query or adjusting price parameters.</p>
              <button className="btn btn-primary" onClick={resetFilters}>Reset Filters</button>
            </div>
          )}
        </main>
      </div>

      {/* MOBILE FILTER DRAWER / BOTTOM SHEET */}
      {mobileFilterOpen && (
        <div className="mobile-filter-modal-overlay" onClick={() => setMobileFilterOpen(false)}>
          <div className="mobile-filter-sheet" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="mobile-filter-sheet-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <SlidersHorizontal size={18} color="var(--primary)" />
                <h3 style={{ fontWeight: 800, fontSize: '1.05rem', margin: 0 }}>Filters</h3>
              </div>
              <button className="modal-close-btn" onClick={() => setMobileFilterOpen(false)}>
                <X size={20} />
              </button>
            </div>

            {/* Sheet Body */}
            <div className="mobile-filter-sheet-body">
              {/* Category */}
              <div className="filter-group">
                <h4 className="filter-title">Category</h4>
                <div className="filter-radio-grid">
                  {['All', 'Mobiles', 'Apple', 'Wearables', 'Audio', 'Chargers & Cables', 'Accessories'].map(c => (
                    <label key={c} className={`filter-radio-chip ${draftFilters.category === c ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="mobileCat" 
                        checked={draftFilters.category === c} 
                        onChange={() => setDraftFilters(d => ({ ...d, category: c }))} 
                      />
                      <span>{c}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Brand */}
              <div className="filter-group">
                <h4 className="filter-title">Brand</h4>
                <div className="filter-radio-grid">
                  {['All', 'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Vivo', 'Google', 'boAt'].map(b => (
                    <label key={b} className={`filter-radio-chip ${draftFilters.brand === b ? 'selected' : ''}`}>
                      <input 
                        type="radio" 
                        name="mobileBrand" 
                        checked={draftFilters.brand === b} 
                        onChange={() => setDraftFilters(d => ({ ...d, brand: b }))} 
                      />
                      <span>{b}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div className="filter-group">
                <h4 className="filter-title">Max Price: {formatINR(draftFilters.maxPrice)}</h4>
                <input 
                  type="range" 
                  min="2000" 
                  max="200000" 
                  step="5000" 
                  value={draftFilters.maxPrice} 
                  style={{ width: '100%', margin: '0.5rem 0' }} 
                  onChange={(e) => setDraftFilters(d => ({ ...d, maxPrice: Number(e.target.value) }))} 
                />
              </div>

              {/* Sort */}
              <div className="filter-group">
                <h4 className="filter-title">Sort By</h4>
                <select 
                  className="sort-select" 
                  style={{ width: '100%', padding: '0.6rem' }}
                  value={draftFilters.sort} 
                  onChange={(e) => setDraftFilters(d => ({ ...d, sort: e.target.value }))}
                >
                  <option value="popularity">Popularity</option>
                  <option value="price-low">Price: Low to High</option>
                  <option value="price-high">Price: High to Low</option>
                  <option value="rating">Customer Rating</option>
                </select>
              </div>
            </div>

            {/* Footer Sticky Actions */}
            <div className="mobile-filter-sheet-footer">
              <button 
                className="btn btn-outline" 
                style={{ flex: 1 }} 
                onClick={() => setDraftFilters({ search: '', category: 'All', brand: 'All', maxPrice: 200000, sort: 'popularity' })}
              >
                Clear All
              </button>
              <button className="btn btn-primary" style={{ flex: 1.5 }} onClick={applyMobileFilter}>
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
