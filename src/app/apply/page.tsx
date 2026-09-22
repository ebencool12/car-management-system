'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Application,
  getStoredApplications,
  saveStoredApplications,
} from '@/lib/demo-data';

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  // Form details
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    reason: '',
    licenseNumber: '',
    ghanaCardNumber: '',
    experienceYears: 3,
  });

  // Uploaded documents (base64)
  const [licenseUrl, setLicenseUrl] = useState<string | null>(null);
  const [ghanaCardUrl, setGhanaCardUrl] = useState<string | null>(null);
  const licenseInputRef = useRef<HTMLInputElement>(null);
  const ghanaCardInputRef = useRef<HTMLInputElement>(null);

  // Live selfie camera state
  const [cameraActive, setCameraActive] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [selfieUrl, setSelfieUrl] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const fallbackSelfieInputRef = useRef<HTMLInputElement>(null);

  // Stop camera when component unmounts or step changes
  useEffect(() => {
    if (step === 3 && !selfieUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [step, selfieUrl]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access not supported by this browser. You may upload a photo below.');
        return;
      }
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
      setCameraActive(true);
    } catch (err: unknown) {
      console.warn('Camera access denied or unavailable', err);
      setCameraError('Unable to access camera. Please allow camera permissions or upload a portrait photo below.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    setCameraActive(false);
  };

  const captureSelfie = () => {
    if (!videoRef.current) return;
    const video = videoRef.current;
    const canvas = document.createElement('canvas');
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Mirror image horizontally for natural selfie
      ctx.translate(canvas.width, 0);
      ctx.scale(-1, 1);
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setSelfieUrl(dataUrl);
      stopCamera();
    }
  };

  const retakeSelfie = () => {
    setSelfieUrl(null);
    startCamera();
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'license' | 'ghanaCard' | 'selfie') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'license') setLicenseUrl(result);
      if (target === 'ghanaCard') setGhanaCardUrl(result);
      if (target === 'selfie') setSelfieUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Step advancement with Soft Validation (allows user to move forward even if incomplete)
  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    const applications = getStoredApplications();
    const newApp: Application = {
      id: `app-${Date.now()}`,
      fullName: formData.fullName.trim() || 'New Applicant',
      phone: formData.phone.trim() || '024-000-0000',
      email: formData.email.trim() || 'applicant@fleet.byt.com',
      reason: formData.reason.trim() || 'Excited to drive with BYT Fleet.',
      status: 'PENDING',
      createdAt: new Date().toISOString().split('T')[0],
      licenseNumber: formData.licenseNumber || undefined,
      ghanaCardNumber: formData.ghanaCardNumber || undefined,
      licenseUrl: licenseUrl || undefined,
      ghanaCardUrl: ghanaCardUrl || undefined,
      selfieUrl: selfieUrl || undefined,
      experienceYears: formData.experienceYears,
    };

    saveStoredApplications([newApp, ...applications]);
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
          <p className="text-muted" style={{ maxWidth: 420, margin: '0 auto', lineHeight: 1.7 }}>
            Thank you, <strong>{formData.fullName || 'Applicant'}</strong>. Your application, documents, and identity verification have been submitted directly to the BYT Operations Admin desk.
          </p>
          <div style={{ margin: 'var(--space-lg) auto', maxWidth: 360, padding: 'var(--space-md)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', textAlign: 'left', fontSize: '0.85rem' }}>
            <div><strong>Phone Contact:</strong> {formData.phone || 'Provided on file'}</div>
            <div><strong>Documents Attached:</strong> {licenseUrl ? '✓ License ' : ''}{ghanaCardUrl ? '✓ Ghana Card ' : ''}{selfieUrl ? '✓ Live Selfie' : ''}</div>
            <div style={{ marginTop: '4px', color: 'var(--color-text-muted)' }}>Status: <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>PENDING ADMIN APPROVAL</span></div>
          </div>
          <p className="text-sm text-muted" style={{ marginTop: 'var(--space-md)' }}>
            You will be contacted via phone or SMS once reviewed.
          </p>
          <Link href="/" className="btn btn-secondary" style={{ marginTop: 'var(--space-xl)' }}>
            ← Back to Login
          </Link>
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

      {/* Step Progress indicator */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)', marginBottom: 'var(--space-xl)', justifyContent: 'center' }}>
        {[1, 2, 3].map(s => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-sm)' }}>
            <button
              type="button"
              onClick={() => setStep(s)}
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.82rem',
                fontWeight: 700,
                background: step >= s ? 'linear-gradient(135deg, var(--byt-gold), var(--byt-gold-dark))' : 'var(--color-bg-input)',
                color: step >= s ? 'var(--color-text-inverse)' : 'var(--color-text-muted)',
                border: step >= s ? 'none' : '1px solid var(--color-border)',
                cursor: 'pointer',
                transition: 'all var(--transition-base)',
              }}
              title={`Go to Step ${s}`}
            >
              {step > s ? '✓' : s}
            </button>
            {s < 3 && (
              <div
                style={{
                  width: 44,
                  height: 2,
                  background: step > s ? 'var(--byt-gold)' : 'var(--color-border)',
                  transition: 'background var(--transition-base)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      <div className="form-card animate-in">
        <form onSubmit={handleNextStep}>
          {/* ── STEP 1: PERSONAL INFORMATION ── */}
          {step === 1 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
                    Phase 1 of 3
                  </span>
                  <h3 style={{ marginTop: '2px' }}>Personal Information</h3>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(2)}
                  style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                >
                  Skip to Docs →
                </button>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label" htmlFor="apply-name">Full Name</label>
                <input
                  id="apply-name"
                  className="form-input"
                  placeholder="e.g. Kwame Mensah"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>

              <div className="grid-2" style={{ marginBottom: 'var(--space-md)' }}>
                <div className="form-group">
                  <label className="form-label" htmlFor="apply-phone">Phone Number</label>
                  <input
                    id="apply-phone"
                    className="form-input font-mono"
                    type="tel"
                    placeholder="024-XXX-XXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="apply-experience">Driving Experience (Years)</label>
                  <input
                    id="apply-experience"
                    className="form-input font-mono"
                    type="number"
                    min="1"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label" htmlFor="apply-email">Email Address (Optional)</label>
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
                <label className="form-label" htmlFor="apply-reason">Why do you want to drive with BYT?</label>
                <textarea
                  id="apply-reason"
                  className="form-textarea"
                  rows={3}
                  placeholder="Tell us about your driving background, routes you know best in Accra, and vehicle handling experience..."
                  value={formData.reason}
                  onChange={e => setFormData({ ...formData, reason: e.target.value })}
                />
              </div>
            </>
          )}

          {/* ── STEP 2: DOCUMENT UPLOADS ── */}
          {step === 2 && (
            <>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
                <div>
                  <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
                    Phase 2 of 3
                  </span>
                  <h3 style={{ marginTop: '2px' }}>Document Uploads</h3>
                </div>
                <button
                  type="button"
                  className="btn btn-ghost btn-sm"
                  onClick={() => setStep(3)}
                  style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}
                >
                  Skip to Selfie →
                </button>
              </div>

              {/* Driver's License Upload */}
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Driver&apos;s License (Photo / Scan)</label>
                  <span className="text-xs text-muted">Class B or above</span>
                </div>

                <input
                  ref={licenseInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleDocUpload(e, 'license')}
                />

                <div
                  className="upload-zone"
                  onClick={() => licenseInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: licenseUrl ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-input)',
                  }}
                >
                  {licenseUrl ? (
                    <div>
                      <img src={licenseUrl} alt="License preview" style={{ maxHeight: 130, borderRadius: 6, margin: '0 auto 8px' }} />
                      <div className="text-xs text-green" style={{ fontWeight: 600 }}>✓ License Attached (Tap to replace)</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '2rem', marginBottom: '4px' }}>📄</div>
                      <div className="font-semibold text-sm">Tap to upload Driver&apos;s License</div>
                      <div className="text-xs text-muted">Clear photo of the front of your license</div>
                    </>
                  )}
                </div>

                <input
                  className="form-input font-mono"
                  style={{ marginTop: 'var(--space-xs)', fontSize: '0.85rem' }}
                  placeholder="License Number (e.g. GL-1982-XXXX)"
                  value={formData.licenseNumber}
                  onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>

              {/* Ghana Card Upload */}
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                  <label className="form-label" style={{ margin: 0 }}>Ghana Card (National ID)</label>
                  <span className="text-xs text-muted">National Identification</span>
                </div>

                <input
                  ref={ghanaCardInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleDocUpload(e, 'ghanaCard')}
                />

                <div
                  className="upload-zone"
                  onClick={() => ghanaCardInputRef.current?.click()}
                  style={{
                    border: '2px dashed var(--color-border)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    textAlign: 'center',
                    cursor: 'pointer',
                    background: ghanaCardUrl ? 'rgba(16, 185, 129, 0.05)' : 'var(--color-bg-input)',
                  }}
                >
                  {ghanaCardUrl ? (
                    <div>
                      <img src={ghanaCardUrl} alt="Ghana Card preview" style={{ maxHeight: 130, borderRadius: 6, margin: '0 auto 8px' }} />
                      <div className="text-xs text-green" style={{ fontWeight: 600 }}>✓ Ghana Card Attached (Tap to replace)</div>
                    </div>
                  ) : (
                    <>
                      <div style={{ fontSize: '2rem', marginBottom: '4px' }}>🆔</div>
                      <div className="font-semibold text-sm">Tap to upload Ghana Card</div>
                      <div className="text-xs text-muted">Clear photo of your Ghana Card ID</div>
                    </>
                  )}
                </div>

                <input
                  className="form-input font-mono"
                  style={{ marginTop: 'var(--space-xs)', fontSize: '0.85rem' }}
                  placeholder="Ghana Card PIN (e.g. GHA-723849102-4)"
                  value={formData.ghanaCardNumber}
                  onChange={e => setFormData({ ...formData, ghanaCardNumber: e.target.value })}
                />
              </div>

              <div style={{ padding: 'var(--space-sm) var(--space-md)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
                💡 <em>Note:</em> You can move to the next phase even if your physical documents are not immediately on hand.
              </div>
            </>
          )}

          {/* ── STEP 3: LIVE SELFIE VERIFICATION ── */}
          {step === 3 && (
            <>
              <div style={{ marginBottom: 'var(--space-md)' }}>
                <span className="eyebrow" style={{ textTransform: 'uppercase', letterSpacing: '0.08em', fontSize: '0.72rem', color: 'var(--byt-gold)', fontWeight: 700 }}>
                  Phase 3 of 3
                </span>
                <h3 style={{ marginTop: '2px' }}>Live Selfie Identity Verification</h3>
                <p className="text-xs text-muted" style={{ marginTop: '2px' }}>
                  Position your face clearly within the frame to verify matching biometric identity.
                </p>
              </div>

              {/* Camera Frame / Selfie Preview */}
              <div
                style={{
                  width: '100%',
                  aspectRatio: '4/3',
                  background: '#091322',
                  borderRadius: 'var(--radius-lg)',
                  border: '2px solid var(--color-border)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  position: 'relative',
                  overflow: 'hidden',
                  marginBottom: 'var(--space-md)',
                }}
              >
                {selfieUrl ? (
                  // Captured Photo Preview
                  <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <img src={selfieUrl} alt="Captured Selfie" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <div
                      style={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: 'rgba(16, 185, 129, 0.9)',
                        color: 'white',
                        padding: '3px 8px',
                        borderRadius: 'var(--radius-full)',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                      }}
                    >
                      ✓ Live Selfie Verified
                    </div>
                  </div>
                ) : (
                  // Live Camera Stream
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        transform: 'scaleX(-1)', // Mirror effect
                      }}
                    />

                    {/* Face Oval Overlay Guide */}
                    <div
                      style={{
                        position: 'absolute',
                        width: 170,
                        height: 220,
                        border: '3px dashed var(--byt-gold)',
                        borderRadius: '50%',
                        boxShadow: '0 0 0 9999px rgba(10, 22, 40, 0.4)',
                        pointerEvents: 'none',
                      }}
                    />

                    {cameraActive && (
                      <div
                        style={{
                          position: 'absolute',
                          top: 12,
                          background: 'rgba(0, 0, 0, 0.65)',
                          padding: '4px 10px',
                          borderRadius: 'var(--radius-full)',
                          fontSize: '0.75rem',
                          color: '#fff',
                        }}
                      >
                        ● Live Camera Stream Active
                      </div>
                    )}

                    {!cameraActive && cameraError && (
                      <div style={{ position: 'absolute', padding: 'var(--space-md)', textAlign: 'center', color: 'var(--color-text-muted)', maxWidth: 280 }}>
                        <div style={{ fontSize: '1.8rem', marginBottom: '4px' }}>📷</div>
                        <div className="text-xs" style={{ color: '#f87171', marginBottom: '8px' }}>{cameraError}</div>
                        <button type="button" className="btn btn-secondary btn-sm" onClick={startCamera}>
                          Retry Camera
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Camera Action Buttons */}
              <div style={{ display: 'flex', gap: 'var(--space-sm)', marginBottom: 'var(--space-md)', flexWrap: 'wrap' }}>
                {selfieUrl ? (
                  <button type="button" className="btn btn-secondary btn-sm" onClick={retakeSelfie} style={{ flex: 1 }}>
                    🔄 Retake Selfie
                  </button>
                ) : (
                  <>
                    <button
                      type="button"
                      className="btn btn-primary btn-sm"
                      onClick={captureSelfie}
                      disabled={!cameraActive}
                      style={{ flex: 2 }}
                    >
                      📸 Capture Live Selfie
                    </button>
                    <button
                      type="button"
                      className="btn btn-ghost btn-sm"
                      onClick={() => fallbackSelfieInputRef.current?.click()}
                      style={{ flex: 1, border: '1px solid var(--color-border)' }}
                    >
                      📁 Upload Photo
                    </button>
                  </>
                )}
              </div>

              <input
                ref={fallbackSelfieInputRef}
                type="file"
                accept="image/*"
                capture="user"
                style={{ display: 'none' }}
                onChange={e => handleDocUpload(e, 'selfie')}
              />

              {/* Summary card */}
              <div style={{ padding: 'var(--space-md)', background: 'var(--color-bg-input)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--space-md)' }}>
                <div className="text-xs text-muted" style={{ marginBottom: 'var(--space-sm)', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                  Application Overview
                </div>
                <div className="text-sm"><strong>Applicant:</strong> {formData.fullName || '—'}</div>
                <div className="text-sm"><strong>Phone:</strong> {formData.phone || '—'}</div>
                <div className="text-sm"><strong>Experience:</strong> {formData.experienceYears} Years</div>
                <div className="text-sm">
                  <strong>Verification Proofs:</strong>{' '}
                  <span style={{ color: licenseUrl ? '#10b981' : '#f59e0b' }}>{licenseUrl ? 'License ✓' : 'License (Pending)'}</span> •{' '}
                  <span style={{ color: ghanaCardUrl ? '#10b981' : '#f59e0b' }}>{ghanaCardUrl ? 'Ghana Card ✓' : 'Ghana Card (Pending)'}</span> •{' '}
                  <span style={{ color: selfieUrl ? '#10b981' : '#f59e0b' }}>{selfieUrl ? 'Live Selfie ✓' : 'Selfie (Pending)'}</span>
                </div>
              </div>
            </>
          )}

          {/* Navigation Controls */}
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {step > 1 && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setStep(step - 1)}
                style={{ flex: 1 }}
              >
                ← Back
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              style={{ flex: 2 }}
            >
              {step < 3 ? 'Continue to Next Phase →' : '🚀 Complete & Submit Application'}
            </button>
          </div>
        </form>
      </div>

      <div style={{ textAlign: 'center', marginTop: 'var(--space-xl)' }}>
        <Link href="/" className="text-sm text-muted">
          Already have an account? Sign in →
        </Link>
      </div>
    </div>
  );
}
