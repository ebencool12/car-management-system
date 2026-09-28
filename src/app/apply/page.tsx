'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Application,
  getStoredApplications,
  saveStoredApplications,
} from '@/lib/demo-data';

export default function ApplyPage() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

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

  // Completeness tracking per step
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(t => t.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  }, []);

  const startCamera = useCallback(async () => {
    setCameraError(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setCameraError('Camera access is not supported by this browser. Please use a device with a camera to complete verification.');
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
      setCameraError('Unable to access camera. Please allow camera permissions in your browser settings to proceed with live verification.');
      setCameraActive(false);
    }
  }, []);

  // Start camera when entering step 3 without a selfie; stop on leave or selfie captured
  useEffect(() => {
    if (step === 3 && !selfieUrl) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selfieUrl]);

  // Cleanup camera on component unmount
  useEffect(() => {
    return () => {
      stopCamera();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

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
    // Camera will start via useEffect
  };

  const handleDocUpload = (e: React.ChangeEvent<HTMLInputElement>, target: 'license' | 'ghanaCard') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      if (target === 'license') setLicenseUrl(result);
      if (target === 'ghanaCard') setGhanaCardUrl(result);
    };
    reader.readAsDataURL(file);
  };

  // Validation per step
  const validateStep = (s: number): string[] => {
    const errors: string[] = [];
    if (s === 1) {
      if (!formData.fullName.trim()) errors.push('Full name is required.');
      if (!formData.phone.trim()) errors.push('Phone number is required.');
      if (!formData.reason.trim()) errors.push('Please provide a reason for wanting to drive with BYT.');
      if (formData.experienceYears < 1) errors.push('Driving experience must be at least 1 year.');
    }
    if (s === 2) {
      if (!licenseUrl) errors.push("Driver's license document is required.");
      if (!formData.licenseNumber.trim()) errors.push('License number is required.');
      if (!ghanaCardUrl) errors.push('Ghana Card document is required.');
      if (!formData.ghanaCardNumber.trim()) errors.push('Ghana Card PIN is required.');
    }
    if (s === 3) {
      if (!selfieUrl) errors.push('A live selfie capture is required for identity verification.');
    }
    return errors;
  };

  const handleNextStep = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const errors = validateStep(step);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    setCompletedSteps(prev => new Set(prev).add(step));
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleFinalSubmit();
    }
  };

  const handleFinalSubmit = () => {
    // Final comprehensive validation
    const allErrors = [
      ...validateStep(1),
      ...validateStep(2),
      ...validateStep(3),
    ];
    if (allErrors.length > 0) {
      setValidationErrors(allErrors);
      return;
    }

    const applications = getStoredApplications();
    const newApp: Application = {
      id: `app-${Date.now()}`,
      fullName: formData.fullName.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim() || '',
      reason: formData.reason.trim(),
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
    
    // Persist to Supabase database
    fetch('/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: newApp.fullName,
        phone: newApp.phone,
        email: newApp.email,
        reason: newApp.reason,
        licenseNumber: newApp.licenseNumber,
        ghanaCardNumber: newApp.ghanaCardNumber,
        experienceYears: newApp.experienceYears,
        licenseUrl: newApp.licenseUrl,
        ghanaCardUrl: newApp.ghanaCardUrl,
        selfieUrl: newApp.selfieUrl,
      }),
    }).catch(err => console.warn('Supabase application sync error:', err));

    stopCamera();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="apply-page">
        <div className="apply-header">
          <div className="apply-brand">
            <div className="apply-logo-icon">BYT</div>
            <div>
              <h1 className="apply-title">BYT Fleet Management</h1>
              <p className="apply-motto">Your Fleet. Your Control. Your Trust.</p>
            </div>
          </div>
        </div>
        <div className="apply-card apply-success-card">
          <div className="apply-success-icon">
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
          <h2 className="apply-success-title">Application Submitted Successfully</h2>
          <p className="apply-success-text">
            Thank you, <strong>{formData.fullName}</strong>. Your application, documents, and live identity verification have been submitted to the BYT Operations team for review.
          </p>
          <div className="apply-success-summary">
            <div className="apply-summary-row">
              <span className="apply-summary-label">Applicant</span>
              <span className="apply-summary-value">{formData.fullName}</span>
            </div>
            <div className="apply-summary-row">
              <span className="apply-summary-label">Phone</span>
              <span className="apply-summary-value font-mono">{formData.phone}</span>
            </div>
            <div className="apply-summary-row">
              <span className="apply-summary-label">Documents</span>
              <span className="apply-summary-value">
                {licenseUrl ? '✓ License ' : ''}{ghanaCardUrl ? '✓ Ghana Card ' : ''}{selfieUrl ? '✓ Live Selfie' : ''}
              </span>
            </div>
            <div className="apply-summary-row">
              <span className="apply-summary-label">Status</span>
              <span className="apply-status-badge">PENDING REVIEW</span>
            </div>
          </div>
          <p className="apply-success-note">
            You will be contacted via phone or SMS once your application has been reviewed.
          </p>
          <Link href="/" className="apply-btn-back">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="19" y1="12" x2="5" y2="12" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
            Back to Login
          </Link>
        </div>
      </div>
    );
  }

  const stepLabels = ['Personal Info', 'Documents', 'Verification'];

  return (
    <div className="apply-page">
      {/* Enterprise Header */}
      <div className="apply-header">
        <div className="apply-brand">
          <div className="apply-logo-icon">BYT</div>
          <div>
            <h1 className="apply-title">Driver Application</h1>
            <p className="apply-motto">Join the BYT professional fleet network</p>
          </div>
        </div>
      </div>

      {/* Step Progress — cannot click to skip */}
      <div className="apply-stepper">
        {[1, 2, 3].map(s => (
          <div key={s} className="apply-step-wrapper">
            <div className={`apply-step-indicator ${step === s ? 'active' : ''} ${completedSteps.has(s) ? 'completed' : ''}`}>
              {completedSteps.has(s) ? (
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              ) : s}
            </div>
            <span className={`apply-step-label ${step === s ? 'active' : ''}`}>{stepLabels[s - 1]}</span>
            {s < 3 && <div className={`apply-step-connector ${step > s ? 'active' : ''}`} />}
          </div>
        ))}
      </div>

      {/* Validation Errors */}
      {validationErrors.length > 0 && (
        <div className="apply-validation-errors">
          <div className="apply-validation-header">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>Please fix the following to continue:</span>
          </div>
          <ul className="apply-validation-list">
            {validationErrors.map((err, i) => (
              <li key={i}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="apply-card">
        <form onSubmit={handleNextStep}>
          {/* ── STEP 1: PERSONAL INFORMATION ── */}
          {step === 1 && (
            <>
              <div className="apply-section-header">
                <div className="apply-phase-indicator">Phase 1 of 3</div>
                <h3 className="apply-section-title">Personal Information</h3>
                <p className="apply-section-desc">Tell us about yourself and your driving background.</p>
              </div>

              <div className="apply-form-group">
                <label className="apply-form-label" htmlFor="apply-name">
                  Full Name <span className="apply-required">*</span>
                </label>
                <input
                  id="apply-name"
                  className="apply-form-input"
                  placeholder="e.g. Kwame Mensah"
                  value={formData.fullName}
                  onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                  autoFocus
                />
              </div>

              <div className="apply-form-row">
                <div className="apply-form-group">
                  <label className="apply-form-label" htmlFor="apply-phone">
                    Phone Number <span className="apply-required">*</span>
                  </label>
                  <input
                    id="apply-phone"
                    className="apply-form-input font-mono"
                    type="tel"
                    placeholder="024-XXX-XXXX"
                    value={formData.phone}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                  />
                </div>
                <div className="apply-form-group">
                  <label className="apply-form-label" htmlFor="apply-experience">
                    Experience (Years) <span className="apply-required">*</span>
                  </label>
                  <input
                    id="apply-experience"
                    className="apply-form-input font-mono"
                    type="number"
                    min="1"
                    value={formData.experienceYears}
                    onChange={e => setFormData({ ...formData, experienceYears: Number(e.target.value) })}
                  />
                </div>
              </div>

              <div className="apply-form-group">
                <label className="apply-form-label" htmlFor="apply-email">
                  Email Address <span className="apply-optional">(Optional)</span>
                </label>
                <input
                  id="apply-email"
                  className="apply-form-input"
                  type="email"
                  placeholder="you@email.com"
                  value={formData.email}
                  onChange={e => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="apply-form-group">
                <label className="apply-form-label" htmlFor="apply-reason">
                  Why do you want to drive with BYT? <span className="apply-required">*</span>
                </label>
                <textarea
                  id="apply-reason"
                  className="apply-form-textarea"
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
              <div className="apply-section-header">
                <div className="apply-phase-indicator">Phase 2 of 3</div>
                <h3 className="apply-section-title">Document Uploads</h3>
                <p className="apply-section-desc">Upload clear photos or scans of your official documents.</p>
              </div>

              {/* Driver's License Upload */}
              <div className="apply-form-group" style={{ marginBottom: '1.5rem' }}>
                <div className="apply-doc-header">
                  <label className="apply-form-label" style={{ margin: 0 }}>
                    Driver&apos;s License <span className="apply-required">*</span>
                  </label>
                  <span className="apply-doc-hint">Class B or above</span>
                </div>

                <input
                  ref={licenseInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleDocUpload(e, 'license')}
                />

                <div
                  className={`apply-upload-zone ${licenseUrl ? 'has-file' : ''}`}
                  onClick={() => licenseInputRef.current?.click()}
                >
                  {licenseUrl ? (
                    <div className="apply-upload-preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={licenseUrl} alt="License preview" className="apply-upload-img" />
                      <div className="apply-upload-success">✓ License Attached — Tap to replace</div>
                    </div>
                  ) : (
                    <div className="apply-upload-placeholder">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                        <polyline points="14 2 14 8 20 8" />
                      </svg>
                      <div className="apply-upload-label">Tap to upload Driver&apos;s License</div>
                      <div className="apply-upload-sublabel">Clear photo of the front of your license</div>
                    </div>
                  )}
                </div>

                <input
                  className="apply-form-input font-mono"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="License Number (e.g. GL-1982-XXXX) *"
                  value={formData.licenseNumber}
                  onChange={e => setFormData({ ...formData, licenseNumber: e.target.value })}
                />
              </div>

              {/* Ghana Card Upload */}
              <div className="apply-form-group" style={{ marginBottom: '1.5rem' }}>
                <div className="apply-doc-header">
                  <label className="apply-form-label" style={{ margin: 0 }}>
                    Ghana Card (National ID) <span className="apply-required">*</span>
                  </label>
                  <span className="apply-doc-hint">National Identification</span>
                </div>

                <input
                  ref={ghanaCardInputRef}
                  type="file"
                  accept="image/*,application/pdf"
                  style={{ display: 'none' }}
                  onChange={e => handleDocUpload(e, 'ghanaCard')}
                />

                <div
                  className={`apply-upload-zone ${ghanaCardUrl ? 'has-file' : ''}`}
                  onClick={() => ghanaCardInputRef.current?.click()}
                >
                  {ghanaCardUrl ? (
                    <div className="apply-upload-preview">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={ghanaCardUrl} alt="Ghana Card preview" className="apply-upload-img" />
                      <div className="apply-upload-success">✓ Ghana Card Attached — Tap to replace</div>
                    </div>
                  ) : (
                    <div className="apply-upload-placeholder">
                      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="5" width="18" height="14" rx="2" ry="2" />
                        <line x1="3" y1="10" x2="21" y2="10" />
                      </svg>
                      <div className="apply-upload-label">Tap to upload Ghana Card</div>
                      <div className="apply-upload-sublabel">Clear photo of your Ghana Card ID</div>
                    </div>
                  )}
                </div>

                <input
                  className="apply-form-input font-mono"
                  style={{ marginTop: '0.5rem' }}
                  placeholder="Ghana Card PIN (e.g. GHA-723849102-4) *"
                  value={formData.ghanaCardNumber}
                  onChange={e => setFormData({ ...formData, ghanaCardNumber: e.target.value })}
                />
              </div>
            </>
          )}

          {/* ── STEP 3: LIVE SELFIE VERIFICATION (No file upload allowed) ── */}
          {step === 3 && (
            <>
              <div className="apply-section-header">
                <div className="apply-phase-indicator">Phase 3 of 3</div>
                <h3 className="apply-section-title">Live Identity Verification</h3>
                <p className="apply-section-desc">
                  Position your face clearly within the frame. This must be a live capture — file uploads are not accepted for identity verification.
                </p>
              </div>

              {/* Live Camera Frame */}
              <div className="apply-camera-frame">
                {selfieUrl ? (
                  <div className="apply-camera-captured">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={selfieUrl} alt="Captured Selfie" className="apply-camera-img" />
                    <div className="apply-camera-verified-badge">
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="20 6 9 17 4 12" />
                      </svg>
                      Live Selfie Captured
                    </div>
                  </div>
                ) : (
                  <>
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="apply-camera-video"
                    />

                    {/* Face Oval Overlay Guide */}
                    <div className="apply-camera-oval" />

                    {cameraActive && (
                      <div className="apply-camera-live-indicator">
                        <span className="apply-live-dot" />
                        Live Camera Active
                      </div>
                    )}

                    {!cameraActive && cameraError && (
                      <div className="apply-camera-error">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                          <circle cx="12" cy="13" r="4" />
                        </svg>
                        <div className="apply-camera-error-text">{cameraError}</div>
                        <button type="button" className="apply-btn-retry" onClick={startCamera}>
                          Retry Camera Access
                        </button>
                      </div>
                    )}

                    {!cameraActive && !cameraError && (
                      <div className="apply-camera-loading">
                        <div className="apply-spinner" />
                        <span>Initializing camera...</span>
                      </div>
                    )}
                  </>
                )}
              </div>

              {/* Camera Action Buttons — LIVE CAPTURE ONLY */}
              <div className="apply-camera-actions">
                {selfieUrl ? (
                  <button type="button" className="apply-btn-retake" onClick={retakeSelfie}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="23 4 23 10 17 10" />
                      <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
                    </svg>
                    Retake Live Selfie
                  </button>
                ) : (
                  <button
                    type="button"
                    className="apply-btn-capture"
                    onClick={captureSelfie}
                    disabled={!cameraActive}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                      <circle cx="12" cy="13" r="4" />
                    </svg>
                    Capture Live Selfie
                  </button>
                )}
              </div>

              <div className="apply-live-notice">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
                <span>For security, identity verification requires a live camera capture. Image uploads are not accepted.</span>
              </div>

              {/* Application Summary */}
              <div className="apply-summary-card">
                <div className="apply-summary-header">Application Overview</div>
                <div className="apply-summary-row">
                  <span className="apply-summary-label">Applicant</span>
                  <span className="apply-summary-value">{formData.fullName || '—'}</span>
                </div>
                <div className="apply-summary-row">
                  <span className="apply-summary-label">Phone</span>
                  <span className="apply-summary-value font-mono">{formData.phone || '—'}</span>
                </div>
                <div className="apply-summary-row">
                  <span className="apply-summary-label">Experience</span>
                  <span className="apply-summary-value">{formData.experienceYears} Years</span>
                </div>
                <div className="apply-summary-row">
                  <span className="apply-summary-label">Proofs</span>
                  <span className="apply-summary-value">
                    <span className={licenseUrl ? 'text-green' : 'text-amber'}>{licenseUrl ? '✓ License' : '○ License'}</span>
                    {' · '}
                    <span className={ghanaCardUrl ? 'text-green' : 'text-amber'}>{ghanaCardUrl ? '✓ Ghana Card' : '○ Ghana Card'}</span>
                    {' · '}
                    <span className={selfieUrl ? 'text-green' : 'text-amber'}>{selfieUrl ? '✓ Selfie' : '○ Selfie'}</span>
                  </span>
                </div>
              </div>
            </>
          )}

          {/* Navigation Controls */}
          <div className="apply-nav-controls">
            {step > 1 && (
              <button
                type="button"
                className="apply-btn-back"
                onClick={() => { setValidationErrors([]); setStep(step - 1); }}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back
              </button>
            )}
            <button
              type="submit"
              className="apply-btn-next"
            >
              {step < 3 ? (
                <>
                  Continue
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12" />
                    <polyline points="12 5 19 12 12 19" />
                  </svg>
                </>
              ) : (
                <>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                  Submit Application
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      <div className="apply-footer">
        <Link href="/" className="apply-footer-link">
          Already have an account? Sign in →
        </Link>
      </div>

      <style jsx>{`
        .text-green { color: #16a34a; }
        .text-amber { color: #d97706; }
      `}</style>
    </div>
  );
}
