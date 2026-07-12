import React, { useState, useEffect } from 'react';
import './Registration.css';
import { Divider } from '@mui/material';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/store';
import type { RootState } from '../../reducers';
import { loginRequest, loginSuccess, loginError } from '../../actions/auth.slice';

interface LoginProps {
    setValue: (value: string) => void;
}

/** Shape the backend returns on successful login */
interface LoginUser {
    id: string;
    role: string;   // 'admin' | 'citizen'
    name: string;
}

export default function Login({ setValue }: LoginProps) {
    const dispatch = useAppDispatch();
    const { loading, error, user } = useSelector((state: RootState) => state.auth);

    const [loginMode, setLoginMode] = useState<'citizen' | 'admin' | 'superadmin'>('citizen');
    const [email, setEmail]         = useState('');
    const [password, setPassword]   = useState('');
    const [otp, setOtp]             = useState('');
    const [showOtpPrompt, setShowOtpPrompt] = useState(false);
    const [otpError, setOtpError]   = useState<string | null>(null);

    // ── Submit handler ────────────────────────────────────────────────────────
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setOtpError(null);
        if (loginMode === 'superadmin') {
            if (email === 'superadmin@fixmycity.com' && password === 'superadminpassword') {
                setShowOtpPrompt(true);
            } else {
                dispatch(loginError('Invalid Super Admin credentials. Use superadmin@fixmycity.com / superadminpassword'));
            }
        } else {
            dispatch(
                loginRequest({
                    email,
                    password,
                    role: loginMode,   // 'citizen' | 'admin' — backend reads req.body.role
                })
            );
        }
    };

    const handleVerifyOtp = (e: React.FormEvent) => {
        e.preventDefault();
        if (otp === '123456') {
            const superadminUser = {
                success: true,
                message: "Login successful",
                user: {
                    id: "superadmin-id",
                    role: "superadmin",
                    name: "Super Admin",
                    firstname: "Super",
                    lastname: "Admin",
                    email: "superadmin@fixmycity.com",
                    mobile: "1234567890"
                }
            };
            sessionStorage.setItem('user', JSON.stringify(superadminUser));
            dispatch(loginSuccess(superadminUser));
        } else {
            setOtpError('Invalid OTP code. Please enter 123456.');
        }
    };

    // ── Reset fields when switching mode ─────────────────────────────────────
    const switchMode = (mode: 'citizen' | 'admin' | 'superadmin') => {
        setLoginMode(mode);
        setEmail('');
        setPassword('');
        setOtp('');
        setShowOtpPrompt(false);
        setOtpError(null);
    };

    if (showOtpPrompt) {
        return (
            <div className="registration-shell" style={{ minHeight: 'auto', padding: '5' }}>
                <div className="reg-hero-panel">
                    <div className="form-title-group">
                        <h2>OTP Verification</h2>
                        <p>A verification code has been sent to your registered device. Enter the code below.</p>
                    </div>
                    <form className="auth-form-modern" onSubmit={handleVerifyOtp} noValidate>
                        <div className="input-group">
                            <label htmlFor="login-otp">Enter OTP (use 123456)</label>
                            <div className="input-wrapper">
                                <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                                <input
                                    required
                                    id="login-otp"
                                    type="text"
                                    placeholder="e.g. 123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                />
                            </div>
                        </div>
                        {otpError && (
                            <div
                                role="alert"
                                style={{
                                    background: 'rgba(239,68,68,0.1)',
                                    border: '1px solid rgba(239,68,68,0.4)',
                                    borderRadius: '8px',
                                    color: '#dc2626',
                                    padding: '0.6rem 1rem',
                                    fontSize: '0.875rem',
                                    marginBottom: '1rem',
                                    textAlign: 'center',
                                }}
                            >
                                {otpError}
                            </div>
                        )}
                        <button type="submit" className="primary-btn">
                            Verify & Log In
                        </button>
                        <button
                            type="button"
                            className="ghost-btn"
                            style={{ marginTop: '1rem', width: '100%' }}
                            onClick={() => {
                                setShowOtpPrompt(false);
                                setOtp('');
                                setOtpError(null);
                            }}
                        >
                            Cancel
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="registration-shell" style={{ minHeight: 'auto', padding: '5' }}>
            <div className="reg-hero-panel">

                {/* Header */}
                <div className="form-title-group">
                    <h2>Login</h2>
                    <p>Enter your credentials to access your account.</p>
                </div>

                {/* Form */}
                <form className="auth-form-modern" onSubmit={handleSubmit} noValidate autoComplete="off">

                    {/* Email Input */}
                    <div className="input-group">
                        <label htmlFor="login-email">Email</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                required
                                id="login-email"
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="input-group">
                        <label htmlFor="login-password">Password</label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4" />
                            </svg>
                            <input
                                required
                                id="login-password"
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                autoComplete="current-password"
                                disabled={loading}
                            />
                        </div>
                    </div>

                    {/* Mode Toggle Pill */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div className="mode-toggle-pill">
                            <button
                                type="button"
                                className={`mode-btn ${loginMode === 'citizen' ? 'is-active' : ''}`}
                                onClick={() => switchMode('citizen')}
                                disabled={loading}
                            >
                                Citizen
                            </button>
                            <button
                                type="button"
                                className={`mode-btn ${loginMode === 'admin' ? 'is-active' : ''}`}
                                onClick={() => switchMode('admin')}
                                disabled={loading}
                            >
                                Admin
                            </button>
                            <button
                                type="button"
                                className={`mode-btn ${loginMode === 'superadmin' ? 'is-active' : ''}`}
                                onClick={() => switchMode('superadmin')}
                                disabled={loading}
                            >
                                Super Admin
                            </button>
                        </div>
                    </div>

                    {/* Error Banner */}
                    {error && (
                        <div
                            role="alert"
                            style={{
                                background: 'rgba(239,68,68,0.1)',
                                border: '1px solid rgba(239,68,68,0.4)',
                                borderRadius: '8px',
                                color: '#dc2626',
                                padding: '0.6rem 1rem',
                                fontSize: '0.875rem',
                                marginBottom: '1rem',
                                textAlign: 'center',
                            }}
                        >
                            {error}
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="primary-btn"
                        style={{ marginTop: '1rem' }}
                        disabled={loading}
                    >
                        {loading ? 'Logging in…' : 'Log In'}
                    </button>
                </form>

                <Divider sx={{ my: 3, borderColor: 'rgba(12, 24, 22, 0.15)' }} />

                {/* Footer */}
                <div className="reg-footer-note">
                    <span>Don't have an account?</span>
                    <button type="button" className="ghost-btn" onClick={() => setValue('1')}>
                        Register
                    </button>
                </div>
            </div>
        </div>
    );
}
