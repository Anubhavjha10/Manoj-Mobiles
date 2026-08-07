import React, { useState, useEffect, useMemo } from 'react';
import { Grid, Smartphone, Apple, Watch, Headphones, BatteryCharging, ShieldCheck, Award, Flame, PlayCircle, Play, TrendingUp, CheckCircle2, Truck, RefreshCw, CreditCard, Store, Heart, ChevronRight } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { VIDEOS_DATA, TESTIMONIALS_DATA } from '../data/products';
import { HeroCarousel } from '../components/HeroCarousel';
import { ProductCard } from '../components/ProductCard';
import { AiMobileFinder } from '../components/AiMobileFinder';
import { motion } from 'framer-motion';

const fadeUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
};

// Isolated Countdown Timer Component to prevent main-thread re-renders
const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState({ hrs: 8, mins: 42, secs: 15 });

  useEffect(() => {
    let totalSecs = 8 * 3600 + 42 * 60 + 15;
    const timer = setInterval(() => {
      totalSecs--;
      if (totalSecs <= 0) totalSecs = 8 * 3600;
      setTimeLeft({
        hrs: Math.floor(totalSecs / 3600),
        mins: Math.floor((totalSecs % 3600) / 60),
        secs: totalSecs % 60
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="countdown-box">
      <span>Deals End In:</span>
      <span className="timer-num">{String(timeLeft.hrs).padStart(2, '0')}</span>h :
      <span className="timer-num">{String(timeLeft.mins).padStart(2, '0')}</span>m :
      <span className="timer-num">{String(timeLeft.secs).padStart(2, '0')}</span>s
    </div>
  );
};

export const HomePage = () => {
  const { navigateTo, setActiveVideo, showToast, formatINR, products, categories, brands } = useStore();

  const dailyDeals = useMemo(() => products.filter(p => p.isDeal).slice(0, 8), [products]);
  const trendingProducts = useMemo(() => products.filter(p => p.isTrending).slice(0, 6), [products]);
  const appleProducts = useMemo(() => products.filter(p => p.isAppleSpotlight), [products]);

  const handleNewsletter = (e) => {
    e.preventDefault();
    showToast('Subscribed! Coupon MM500 sent to your email.');
    e.target.reset();
  };

  return (
    <>
      <HeroCarousel />

      {/* SHOP BY CATEGORY */}
      <motion.section 
        className="category-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={fadeUpVariant}
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <h2 className="section-title"><Grid color="#0056D2" /> Shop by Category</h2>
              <p className="section-subtitle">Explore 1,000+ authentic electronics across premier categories</p>
            </div>
          </div>

          <div className="category-grid">
            {categories.slice(0, 6).map((c, idx) => {
              let Icon = Grid;
              if (c.name.includes('Mobile')) Icon = Smartphone;
              if (c.name.includes('Apple')) Icon = Apple;
              if (c.name.includes('Wearable') || c.name.includes('Watch')) Icon = Watch;
              if (c.name.includes('Audio')) Icon = Headphones;
              if (c.name.includes('Charger')) Icon = BatteryCharging;
              if (c.name.includes('Accessories')) Icon = ShieldCheck;
              
              return (
                <motion.div 
                  key={c.id || idx} 
                  className="category-card" 
                  onClick={() => navigateTo('products', { category: c.name })}
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <div className="category-icon-wrapper"><Icon /></div>
                  <h3 className="category-title">{c.name}</h3>
                  <span className="category-subtitle">Explore {c.name}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* SHOP BY BRAND */}
      <section className="brands-section">
        <div className="container">
          <div className="section-heading" style={{ marginBottom: '1rem' }}>
            <h2 className="section-title"><Award color="#0056D2" /> Authorised Brand Store</h2>
          </div>
          <div className="brands-grid">
            {brands.map(b => (
              <div key={b.name} className="brand-chip" onClick={() => navigateTo('products', { brand: b.name })}>
                {b.name}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* DAILY DEALS */}
      <motion.section 
        className="deals-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={fadeUpVariant}
      >
        <div className="container">
          <div className="deal-header-box">
            <div className="deal-header-title">
              <Flame color="#FDE047" /> Today's Super Saver Deals
            </div>
            <CountdownTimer />
          </div>

          <div className="products-grid">
            {dailyDeals.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </motion.section>

      {/* AI MOBILE FINDER */}
      <AiMobileFinder />

      {/* PROMOTIONAL VIDEOS */}
      <motion.section 
        className="video-section"
        initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-50px" }}
        variants={fadeUpVariant}
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <h2 className="section-title"><PlayCircle color="#0056D2" /> Watch & Explore</h2>
              <p className="section-subtitle">Real unboxings, camera tests & store walkthroughs by Manoj Mobiles experts</p>
            </div>
          </div>

          <div className="video-carousel-wrapper">
            {VIDEOS_DATA.map(v => (
              <motion.div 
                key={v.id} 
                className="video-card" 
                onClick={() => setActiveVideo(v)}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <img src={v.thumbnail} className="video-thumb" alt={v.title} />
                <div className="video-overlay">
                  <span className="badge badge-solid" style={{ width: 'fit-content' }}>{v.duration}</span>
                  <div className="video-play-btn"><Play fill="#FFFFFF" size={20} /></div>
                  <div>
                    <h4 className="video-info-title">{v.title}</h4>
                    <span className="video-info-meta">👀 {v.views} views</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* TRENDING PRODUCTS */}
      <section className="deals-section" style={{ background: '#FFFFFF' }}>
        <div className="container">
          <div className="section-heading">
            <div>
              <h2 className="section-title"><TrendingUp color="#0056D2" /> Trending Electronics</h2>
              <p className="section-subtitle">Most popular picks bought by tech enthusiasts this week</p>
            </div>
            <a className="view-all-link" onClick={() => navigateTo('products')}>View All Products <ChevronRight size={16} /></a>
          </div>

          <div className="products-grid">
            {trendingProducts.map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </section>

      {/* APPLE SPOTLIGHT */}
      <section className="apple-spotlight-section">
        <div className="container">
          <div className="apple-header">
            <span className="apple-logo-badge"> Authorized Ecosystem</span>
            <h2 className="apple-title">The Complete Apple Experience</h2>
            <p className="apple-subtitle">Explore genuine iPhones, Apple Watch, AirPods and iPad with Official India Warranty.</p>
          </div>

          <div className="apple-grid">
            {appleProducts.map(p => (
              <div key={p.id} className="apple-card">
                <img src={p.image} className="apple-card-img" alt={p.name} />
                <h3 className="apple-card-name">{p.name}</h3>
                <p className="apple-card-price">{formatINR(p.price)}</p>
                <button 
                  className="btn btn-outline btn-sm" 
                  style={{ color: '#FFFFFF', borderColor: '#60A5FA', width: '100%' }}
                  onClick={() => navigateTo('product-detail', { productId: p.id })}
                >
                  View Specs & Buy
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TRUST BADGES */}
      <section className="trust-section">
        <div className="container">
          <div className="trust-grid">
            <div className="trust-item">
              <div className="trust-icon"><CheckCircle2 /></div>
              <div>
                <h4 className="trust-title">100% Genuine</h4>
                <p className="trust-desc">Sealed boxes with official brand warranty</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><Truck /></div>
              <div>
                <h4 className="trust-title">Free Delivery</h4>
                <p className="trust-desc">Same day delivery across metro cities</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><RefreshCw /></div>
              <div>
                <h4 className="trust-title">7-Day Return</h4>
                <p className="trust-desc">Hassle-free replacement policy</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><CreditCard /></div>
              <div>
                <h4 className="trust-title">No Cost EMI</h4>
                <p className="trust-desc">0% Interest on major bank credit cards</p>
              </div>
            </div>

            <div className="trust-item">
              <div className="trust-icon"><Store /></div>
              <div>
                <h4 className="trust-title">50+ Physical Stores</h4>
                <p className="trust-desc">Try & buy experience near you</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-heading">
            <div>
              <h2 className="section-title"><Heart color="#0056D2" /> Customer Testimonials</h2>
              <p className="section-subtitle">Over 1,00,000+ satisfied tech buyers across India</p>
            </div>
          </div>

          <div className="testimonials-grid">
            {TESTIMONIALS_DATA.map(t => (
              <div key={t.id} className="testimonial-card">
                <div className="testimonial-header">
                  <img src={t.avatar} className="user-avatar" alt={t.name} />
                  <div>
                    <h4 className="user-name">{t.name}</h4>
                    <span className="user-city">📍 {t.city} • Verified Purchase</span>
                  </div>
                </div>
                <div className="rating-stars" style={{ marginBottom: '0.5rem' }}>
                  {'★'.repeat(t.rating)}
                </div>
                <p className="testimonial-text">"{t.comment}"</p>
                <span className="badge badge-blue" style={{ marginTop: '0.8rem' }}>Item: {t.verifiedProduct}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* NEWSLETTER */}
      <section className="container">
        <div className="newsletter-band">
          <h2 className="newsletter-title">Get ₹500 OFF On Your First Purchase</h2>
          <p className="newsletter-sub">Subscribe to Manoj Mobiles VIP Club for secret deals, flash sales & tech launches!</p>
          <form className="newsletter-form" onSubmit={handleNewsletter}>
            <input type="email" className="newsletter-input" placeholder="Enter your email address..." required />
            <button type="submit" className="btn btn-primary">Subscribe</button>
          </form>
        </div>
      </section>
    </>
  );
};
