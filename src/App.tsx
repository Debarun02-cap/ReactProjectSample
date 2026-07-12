import React, { useState, useEffect } from 'react';
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
    const [view, setView] = useState<'home' | 'register-complaint' | 'usage'>('home');
    const [profileOpen, setProfileOpen] = useState(false);

    // Extract role from the logged-in user object
    const loginUserObj = user as any;
    const role = loginUserObj?.user?.role || '';

    // Reset view to home when logging out or role changes
    useEffect(() => {
        setView('home');
        setProfileOpen(false);
    }, [user]);

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
