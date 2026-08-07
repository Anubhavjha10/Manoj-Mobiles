import React from 'react';
import { Sparkles, ArrowLeft, ArrowRight, RefreshCw } from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { ProductCard } from './ProductCard';

export const AiMobileFinder = () => {
  const { aiWizard, setAiWizard, formatINR, products } = useStore();

  const moveStep = (delta) => {
    setAiWizard(prev => {
      let next = prev.step + delta;
      if (next < 1) next = 1;
      if (next > 4) next = 4;
      return { ...prev, step: next };
    });
  };

  const setBudget = (val) => {
    setAiWizard(prev => ({ ...prev, budget: val, step: 2 }));
  };

  const setUseCase = (val) => {
    setAiWizard(prev => ({ ...prev, useCase: val, step: 3 }));
  };

  const setBrand = (val) => {
    setAiWizard(prev => ({ ...prev, brand: val, step: 4 }));
  };

  const resetWizard = () => {
    setAiWizard({ step: 1, budget: 80000, useCase: 'Camera', brand: 'All', storage: '256GB' });
  };

  const matches = products.filter(p => {
    const brandMatch = aiWizard.brand === 'All' || p.brand === aiWizard.brand;
    const priceMatch = p.price <= (aiWizard.budget * 1.25);
    return brandMatch && priceMatch;
  }).slice(0, 2);

  const bestMatch = matches[0] || products[0] || {};

  return (
    <section className="ai-finder-section" id="ai-finder">
      <div className="container">
        <div className="ai-finder-card">
          <div className="ai-finder-header">
            <span className="badge badge-blue" style={{ marginBottom: '0.5rem' }}>
              <Sparkles size={14} /> AI Powered Assistant
            </span>
            <h2 className="ai-finder-title">Find Your Perfect Smartphone</h2>
            <p className="ai-finder-subtitle">Answer 4 quick questions to get personalized recommendations tailored to your exact budget & needs.</p>
          </div>

          {/* Progress Steps */}
          <div className="wizard-progress-bar">
            <div className="wizard-progress-line">
              <div className="wizard-progress-fill" style={{ width: `${(aiWizard.step - 1) * 33.3}%` }}></div>
            </div>
            <div className={`step-bubble ${aiWizard.step >= 1 ? 'active' : ''}`}>1</div>
            <div className={`step-bubble ${aiWizard.step >= 2 ? 'active' : ''}`}>2</div>
            <div className={`step-bubble ${aiWizard.step >= 3 ? 'active' : ''}`}>3</div>
            <div className={`step-bubble ${aiWizard.step >= 4 ? 'active' : ''}`}>4</div>
          </div>

          {/* Step 1 */}
          {aiWizard.step === 1 && (
            <div className="wizard-step-content active">
              <h3 className="wizard-question">1. What is your budget range?</h3>
              <div className="chips-grid">
                <div className={`option-chip-card ${aiWizard.budget === 20000 ? 'selected' : ''}`} onClick={() => setBudget(20000)}>
                  <span className="option-icon">💰</span>
                  <span className="option-label">Under ₹20,000</span>
                </div>
                <div className={`option-chip-card ${aiWizard.budget === 40000 ? 'selected' : ''}`} onClick={() => setBudget(40000)}>
                  <span className="option-icon">💳</span>
                  <span className="option-label">₹20,000 - ₹40,000</span>
                </div>
                <div className={`option-chip-card ${aiWizard.budget === 80000 ? 'selected' : ''}`} onClick={() => setBudget(80000)}>
                  <span className="option-icon">🌟</span>
                  <span className="option-label">₹40,000 - ₹80,000</span>
                </div>
                <div className={`option-chip-card ${aiWizard.budget === 150000 ? 'selected' : ''}`} onClick={() => setBudget(150000)}>
                  <span className="option-icon">👑</span>
                  <span className="option-label">Above ₹80,000</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 2 */}
          {aiWizard.step === 2 && (
            <div className="wizard-step-content active">
              <h3 className="wizard-question">2. What is your primary priority?</h3>
              <div className="chips-grid">
                <div className={`option-chip-card ${aiWizard.useCase === 'Camera' ? 'selected' : ''}`} onClick={() => setUseCase('Camera')}>
                  <span className="option-icon">📸</span>
                  <span className="option-label">Pro Photography</span>
                </div>
                <div className={`option-chip-card ${aiWizard.useCase === 'Gaming' ? 'selected' : ''}`} onClick={() => setUseCase('Gaming')}>
                  <span className="option-icon">🎮</span>
                  <span className="option-label">Heavy Gaming</span>
                </div>
                <div className={`option-chip-card ${aiWizard.useCase === 'Battery life' ? 'selected' : ''}`} onClick={() => setUseCase('Battery life')}>
                  <span className="option-icon">🔋</span>
                  <span className="option-label">Long Battery Life</span>
                </div>
                <div className={`option-chip-card ${aiWizard.useCase === 'Everyday use' ? 'selected' : ''}`} onClick={() => setUseCase('Everyday use')}>
                  <span className="option-icon">📱</span>
                  <span className="option-label">Everyday Use</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {aiWizard.step === 3 && (
            <div className="wizard-step-content active">
              <h3 className="wizard-question">3. Do you have a preferred brand?</h3>
              <div className="chips-grid">
                <div className={`option-chip-card ${aiWizard.brand === 'All' ? 'selected' : ''}`} onClick={() => setBrand('All')}>
                  <span className="option-icon">🌐</span>
                  <span className="option-label">Any Brand</span>
                </div>
                <div className={`option-chip-card ${aiWizard.brand === 'Apple' ? 'selected' : ''}`} onClick={() => setBrand('Apple')}>
                  <span className="option-icon">🍎</span>
                  <span className="option-label">Apple</span>
                </div>
                <div className={`option-chip-card ${aiWizard.brand === 'Samsung' ? 'selected' : ''}`} onClick={() => setBrand('Samsung')}>
                  <span className="option-icon">🌌</span>
                  <span className="option-label">Samsung</span>
                </div>
                <div className={`option-chip-card ${aiWizard.brand === 'OnePlus' ? 'selected' : ''}`} onClick={() => setBrand('OnePlus')}>
                  <span className="option-icon">⚡</span>
                  <span className="option-label">OnePlus</span>
                </div>
              </div>
            </div>
          )}

          {/* Step 4 */}
          {aiWizard.step === 4 && (
            <div className="wizard-step-content active">
              <h3 className="wizard-question">✨ Recommended Smartphones For You</h3>
              <div className="ai-results-box">
                <div className="ai-recommend-reason">
                  🎯 <strong>AI Recommendation Rationale:</strong> We matched {bestMatch.name} for you because it delivers top tier {aiWizard.useCase} performance within your target budget of {formatINR(aiWizard.budget)}.
                </div>
                <div className="products-grid">
                  {matches.map(p => <ProductCard key={p.id} product={p} />)}
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="wizard-nav-btns">
            {aiWizard.step > 1 ? (
              <button className="btn btn-secondary" onClick={() => moveStep(-1)}>
                <ArrowLeft size={16} /> Previous
              </button>
            ) : <div></div>}

            {aiWizard.step < 4 ? (
              <button className="btn btn-primary" onClick={() => moveStep(1)}>
                Next Step <ArrowRight size={16} />
              </button>
            ) : (
              <button className="btn btn-outline" onClick={resetWizard}>
                <RefreshCw size={16} /> Start Over
              </button>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
