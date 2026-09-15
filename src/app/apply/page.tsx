'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '', phone: '', email: '', reason: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
      return;
    }
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="apply-page">
        <div className="login-logo" style={{ marginBottom: 'var(--space-2xl)' }}>
          <div className="logo-icon">BYT</div>
          <h1>BYT Fleet Management</h1>
          <p className="motto">Your Fleet. Your Control. Your Trust.</p>
        </div>
        <div className="form-card animate-in" style={{ textAlign: 'center', padding: 'var(--space-3xl) var(--space-xl)' }}>
          <div style={{ fontSize: '4rem', marginBottom: 'var(--space-lg)' }}>🎉</div>
          <h2 style={{ marginBottom: 'var(--space-md)' }}>Application Submitted!</h2>
          <p className="text-muted" style={{ maxWidth: 400, margin: '0 auto', lineHeight: 1.7 }}>
            Thank you, <strong>{formData.fullName}</strong>. Your application has been received and is now pending review by the BYT admin.
          </p>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-lg)' }}>
            You will be notified at <strong>{formData.phone}</strong> once a decision is made.
          </p>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: 'var(--space-xl)' }}>← Back to Login</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="apply-page">
      {/* Header */}
      <div className="login-logo" style={{ marginBottom: 'var(--space-2xl)' }}>
        <div className="logo-icon">BYT</div>
        <h1>Drive for BYT</h1>
        <p className="motto">Join our trusted fleet of professional drivers</p>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', justifyContent: 'center' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <div style={{
              width: 32, height: 32, borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.8rem', fontWeight: 700,
              background: step >= s ? 'linear-gradient(135deg, var(--byt-gold), var(--byt-gold-dark))' : 'var(--color-bg-input)',
              color: step >= s ? 'var(--color-text-inverse)' : 'var(--color-text-muted)',
              border: step >= s ? 'none' : '1px solid var(--color-border)',
              transition: 'all var(--transition-base)',
            }}>
              {step > s ? '✓' : s}
            </div>
            {s < 3 && (
              <div style={{
                width: 40, height: 2,
                background: step > s ? 'var(--byt-gold)' : 'var(--color-border)',
                transition: 'background var(--transition-base)',
              }} />
            )}
          </div>
        ))}
      </div>

      <div className="form-card animate-in">
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Personal Information</h3>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label" htmlFor="apply-name">Full Name</label>
                <input
                  id="apply-name"
                  className="form-input"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label" htmlFor="apply-phone">Phone Number</label>
                <input
                  id="apply-phone"
                  className="form-input"
                  type="tel"
                  placeholder="024-XXX-XXXX"
                  value={formData.phone}
                  onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  required
                />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label" htmlFor="apply-email">Email (optional)</label>
                <input
                  id="apply-email"
                  className="form-input"
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label" htmlFor="apply-reason">Why do you want to drive for BYT?</label>
                <textarea
                  id="apply-reason"
                  className="form-textarea"
                  placeholder="Tell us about your driving experience and why you'd like to join..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                  required
                />
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <h3 style={{ marginBottom: 'var(--space-lg)' }}>Document Upload</h3>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Driver&apos;s License</label>
                <div className="upload-zone">
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>📄</div>
                  <div className="font-semibold text-sm">Upload Driver&apos;s License</div>
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Take a photo or upload a clear image</div>
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Ghana Card</label>
                <div className="upload-zone">
                  <div style={{ fontSize: '2rem', marginBottom: 'var(--space-sm)' }}>🆔</div>
                  <div className="font-semibold text-sm">Upload Ghana Card</div>
                  <div className="text-xs text-muted" style={{ marginTop: '4px' }}>Front side of your Ghana Card</div>
                </div>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <h3 style={{ marginBottom: 'var(--space-md)' }}>Identity Verification</h3>
              <p className="text-sm text-muted" style={{ marginBottom: 'var(--space-lg)' }}>
                For your security, we need to verify your identity with a live selfie. Position your face within the frame and ensure good lighting.
              </p>
              <div style={{
                width: '100%', aspectRatio: '4/3',
                background: 'linear-gradient(145deg, #0d2240, #0a1628)',
                borderRadius: 'var(--radius-lg)',
                border: '2px solid var(--color-border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexDirection: 'column', gap: 'var(--space-md)',
                marginBottom: 'var(--space-lg)',
                position: 'relative', overflow: 'hidden',
              }}>
                {/* Face outline guide */}
                <div style={{
                  width: 160, height: 200,
                  border: '2px dashed var(--byt-gold)',
                  borderRadius: '50%',
                  opacity: 0.5,
                }} />
                <div className="text-sm text-muted">Camera preview would appear here</div>
                <button type="button" className="btn btn-primary" style={{ position: 'absolute', bottom: 'var(--space-lg)' }}>
                  📷 Capture Selfie
                </button>
              </div>

              {/* Review summary */}
              <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                <div className="text-xs text-muted" style={{ marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Review Your Application</div>
                <div className="text-sm"><strong>Name:</strong> {formData.fullName || '—'}</div>
                <div className="text-sm"><strong>Phone:</strong> {formData.phone || '—'}</div>
                {formData.email && <div className="text-sm"><strong>Email:</strong> {formData.email}</div>}
              </div>
            </>
          )}

          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {step > 1 && (
              <button type="button" className="btn btn-secondary" onClick={() => setStep(step - 1)} style={{ flex: 1 }}>
                ← Back
              </button>
            )}
            <button type="submit" className="btn btn-primary btn-lg" style={{ flex: 2 }}>
              {step < 3 ? 'Continue →' : '🚀 Submit Application'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
        <Link href="/" className="text-sm text-muted">Already have an account? Sign in →</Link>
      </div>
    </div>
  );
}
