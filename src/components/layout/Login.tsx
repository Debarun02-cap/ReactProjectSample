import React, { useState } from 'react';
import './Registration.css';
import { Divider } from '@mui/material';

interface LoginProps {
    setValue: (value: string) => void;
}

export default function Login({ setValue }: LoginProps) {
    const [loginMode, setLoginMode] = useState<'citizen' | 'admin'>('citizen');
    const [userId, setUserId] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert(`Logging in as ${loginMode === 'admin' ? 'Admin' : 'Citizen'} with ID: ${userId}`);
    };

    return (
        <div className="registration-shell" style={{ minHeight: 'auto', padding: '5' }}>
            <div className="reg-hero-panel" >

                {/* Header */}
                <div className="form-title-group">
                    <h2>Login</h2>
                    <p>Enter your credentials to access your account.</p>
                </div>


                {/* Form */}
                <form className="auth-form-modern" onSubmit={handleSubmit} noValidate autoComplete="off">

                    {/* UserID Input */}
                    <div className="input-group">
                        <label htmlFor="login-userid">
                            {loginMode === 'admin' ? 'Admin ID' : 'User ID'}
                        </label>
                        <div className="input-wrapper">
                            <svg className="input-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                            <input
                                required
                                id="login-userid"
                                type="text"
                                placeholder={loginMode === 'admin' ? "admin@fixmycity" : "Enter your User ID"}
                                value={userId}
                                onChange={(e) => setUserId(e.target.value)}
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
                            />
                        </div>
                    </div>
                    {/* Mode Toggle Pill */}
                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                        <div className="mode-toggle-pill">
                            <button
                                type="button"
                                className={`mode-btn ${loginMode === 'citizen' ? 'is-active' : ''}`}
                                onClick={() => {
                                    setLoginMode('citizen');
                                    setUserId('');
                                    setPassword('');
                                }}
                            >
                                Citizen
                            </button>
                            <button
                                type="button"
                                className={`mode-btn ${loginMode === 'admin' ? 'is-active' : ''}`}
                                onClick={() => {
                                    setLoginMode('admin');
                                    setUserId('');
                                    setPassword('');
                                }}
                            >
                                Admin
                            </button>
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="primary-btn" style={{ marginTop: '1rem' }}>
                        Log In
                    </button>
                </form>
                <Divider sx={{ my: 3, borderColor: 'rgba(12, 24, 22, 0.15)' }} />
                {/* Footer */}
                <div className="reg-footer-note">
                    <span>Don't have an account?</span>
                    <button type="button" className="ghost-btn" onClick={() => { setValue("1") }}>Register</button>
                </div>
            </div>
        </div>
    );
}
