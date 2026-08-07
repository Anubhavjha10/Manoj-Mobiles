import React, { useState, useEffect } from 'react';
import { ArrowRight, Zap } from 'lucide-react';
import { useStore } from '../context/StoreContext';

export const HeroCarousel = () => {
  const { navigateTo, addToCart, formatINR, products } = useStore();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      img: "https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=1200&auto=format&fit=crop&q=80",
      tag: "NEW LAUNCH EXCLUSIVE",
      title: "iPhone 15 Pro Max Titanium",
      sub: "Get Flat ₹10,000 Instant Cashback on HDFC Cards + No Cost EMI up to 24 Months.",
      productId: "m1"
    },
    {
      img: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=1200&auto=format&fit=crop&q=80",
      tag: "GALAXY AI IS HERE",
      title: "Samsung S24 Ultra 5G",
      sub: "Unleash whole new levels of mobile creativity. Exchange bonus up to ₹12,000!",
      productId: "m2"
    },
    {
      img: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=1200&auto=format&fit=crop&q=80",
      tag: "MONSOON GADGET FEST",
      title: "Up to 70% OFF Audio & Wearables",
      sub: "Sony, boAt, Apple AirPods & Smartwatches at guaranteed lowest prices.",
      category: "Audio"
    }
  ];

  const picks = products.slice(0, 2);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-grid">
          {/* Main Carousel */}
          <div className="hero-carousel">
            {slides.map((s, idx) => (
              <div key={idx} className={`carousel-slide ${idx === currentSlide ? 'active' : ''}`}>
                <img src={s.img} className="slide-bg-img" alt={s.title} />
                <div className="slide-content">
                  <span className="slide-tag">{s.tag}</span>
                  <h1 className="slide-title">{s.title}</h1>
                  <p className="slide-subtitle">{s.sub}</p>
                  <button 
                    className="btn btn-primary slide-btn" 
                    onClick={() => {
                      if (s.productId) navigateTo('product-detail', { productId: s.productId });
                      else if (s.category) navigateTo('products', { category: s.category });
                    }}
                  >
                    Shop Now <ArrowRight size={16} />
                  </button>
                </div>
              </div>
            ))}

            <div className="carousel-dots">
              {slides.map((_, idx) => (
                <span 
                  key={idx} 
                  className={`dot ${idx === currentSlide ? 'active' : ''}`}
                  onClick={() => setCurrentSlide(idx)}
                ></span>
              ))}
            </div>
          </div>

          {/* Today's 2 Best Picks Widget */}
          <div className="best-picks-widget">
            <div className="best-picks-header">
              <span className="best-picks-title"><Zap size={18} color="#F59E0B" fill="#F59E0B" /> Today's 2 Best Picks</span>
              <span className="badge badge-discount">Editor's Pick</span>
            </div>

            {picks.map(p => (
              <div key={p.id} className="pick-card">
                <img src={p.image} className="pick-img" alt={p.name} />
                <div className="pick-details">
                  <h4 className="pick-name">{p.name}</h4>
                  <div className="pick-price-row">
                    <span className="pick-price">{formatINR(p.price)}</span>
                    <span className="pick-orig-price">{formatINR(p.originalPrice)}</span>
                  </div>
                  <button className="btn btn-outline btn-sm pick-btn" onClick={() => addToCart(p.id)}>
                    Buy Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
