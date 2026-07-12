import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import ResponsiveAppBar from './components/layout/ResponsiveAppBar';
import TabGroup from './components/layout/TabGroup';
import UserHome from './components/layout/userHome';
import AdminHome from './components/layout/adminHome';
import ComplaintRegister from './components/layout/complaintRegister';
import Profile from './components/layout/Profile';
// Usage analytics component for superadmin
import Useage from './components/layout/useage.tsx';
import type { RootState } from './reducers';

function App() {
    const { user } = useSelector((state: RootState) => state.auth);
    // Persist the active view across page refreshes so a superadmin sitting on the
    // usage page doesn't get bounced back to the dashboard on reload.
    const [view, setView] = useState<'home' | 'register-complaint' | 'usage'>(
        () => (sessionStorage.getItem('view') as 'home' | 'register-complaint' | 'usage') || 'home'
    );
    const [profileOpen, setProfileOpen] = useState(false);

    // Extract role from the logged-in user object
    const loginUserObj = user as any;
    const role = loginUserObj?.user?.role || '';
    const userId = loginUserObj?.user?.id;

    // Keep the persisted view in sync so a refresh restores the current screen.
    useEffect(() => {
        sessionStorage.setItem('view', view);
    }, [view]);

    // Reset the view only when the logged-in identity actually changes (login /
    // logout / role switch) — NOT on the rehydration that happens on every refresh.
    const prevUserIdRef = useRef<string | undefined>(userId);
    useEffect(() => {
        if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) {
            setView('home');
            setProfileOpen(false);
        }
        // Handle logout (id goes from defined -> undefined) as well.
        if (prevUserIdRef.current !== undefined && userId === undefined) {
            setView('home');
            setProfileOpen(false);
        }
        prevUserIdRef.current = userId;
    }, [userId]);

    return (
        <>
            <ResponsiveAppBar 
                onProfileClick={() => setProfileOpen(true)} 
                onDashboardClick={() => setView('home')} 
                onUsageClick={() => setView('usage')}
            />
            {role === 'citizen' ? (
                <>
                    {view === 'home' && (
                        <UserHome onRegisterClick={() => setView('register-complaint')} />
                    )}
                    {view === 'register-complaint' && (
                        <ComplaintRegister onCancel={() => setView('home')} />
                    )}
                </>
            ) : role === 'admin' ? (
                <AdminHome />
            ) : role === 'superadmin' ? (
                <>
                    {view === 'home' && <AdminHome />}
                    {view === 'usage' && <Useage />}
                </>
            ) : (
                <TabGroup />
            )}

            {/* Profile Modal — rendered as an overlay on top of any view */}
            <Profile open={profileOpen} onClose={() => setProfileOpen(false)} />
        </>
    );
}

export default App;
