import React, { useState, useEffect } from 'react';
import {
  Car,
  User,
  ShieldAlert,
  Lock,
  Crown,
  PhoneCall,
  Menu,
  X,
  Compass,
  CreditCard,
  LogIn,
  CheckCircle,
} from 'lucide-react';
import { PassengerHome } from './components/passenger/PassengerHome';
import { CaptainHome } from './components/captain/CaptainHome';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { AdminAccessGate } from './components/admin/AdminAccessGate';
import { SplashWelcome } from './components/common/SplashWelcome';
import { SosEmergencyModal } from './components/common/SosEmergencyModal';
import { AuthModal } from './components/auth/AuthModal';
import { rideStore } from './services/store';
import { nativeGeolocationService } from './services/nativeGeolocationService';
import { pushNotificationService } from './services/pushNotificationService';
import { FOUNDER_NAME, FOUNDER_TAGLINE, FOUNDER_SOS_HOTLINE } from './data/constants';
import { UserProfile } from './types';

export default function App() {
  const [currentRole, setCurrentRole] = useState<'passenger' | 'captain' | 'admin'>('passenger');
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);

  const [showSplash, setShowSplash] = useState(true);
  const [isSosOpen, setIsSosOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [userProfile, setUserProfile] = useState<UserProfile | null>(rideStore.getUserProfile());

  // Initialize Native Capacitor Plugins (Background Geolocation & Push Notifications)
  useEffect(() => {
    // 1. Initialize Background Geolocation tracking for real-time fleet synchronization
    nativeGeolocationService
      .initializeBackgroundTracking((location) => {
        // Feed live GPS coordinates to current role
        if (currentRole === 'captain') {
          rideStore.updateCaptainCurrentLocation(location.lat, location.lng);
        }
      })
      .catch((err) => {
        console.info('[Capacitor] Background geolocation initialized in browser/hybrid mode:', err);
      });

    // 2. Initialize Native Push Notifications
    pushNotificationService.initializePushNotifications().catch((err) => {
      console.info('[Capacitor] Push notifications initialized in browser/hybrid mode:', err);
    });

    // 3. Subscribe to central state changes
    const unsub = rideStore.subscribe(() => {
      setUserProfile(rideStore.getUserProfile());
    });

    return () => {
      unsub();
      nativeGeolocationService.stopBackgroundTracking().catch(() => {});
    };
  }, [currentRole]);

  return (
    <div className="w-full h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center overflow-hidden font-sans">
      {/* Mobile Frame Container (Max 480px on desktop for realistic native mobile view) */}
      <div className="w-full h-full max-w-md mx-auto flex flex-col bg-slate-900 shadow-2xl relative overflow-hidden sm:border sm:border-slate-800 sm:rounded-3xl">
        {/* View Switcher based on current role */}
        <main className="flex-1 w-full h-full relative overflow-hidden flex flex-col">
          {currentRole === 'passenger' && (
            <PassengerHome
              onOpenSos={() => setIsSosOpen(true)}
              onOpenSplash={() => setShowSplash(true)}
            />
          )}

          {currentRole === 'captain' && (
            <CaptainHome
              onOpenSos={() => setIsSosOpen(true)}
            />
          )}

          {currentRole === 'admin' &&
            (!isAdminUnlocked ? (
              <AdminAccessGate onUnlock={() => setIsAdminUnlocked(true)} />
            ) : (
              <AdminDashboard
                onLockGate={() => setIsAdminUnlocked(false)}
              />
            ))}
        </main>

        {/* Bottom Persistent Role Navigation Bar */}
        <footer className="flex-shrink-0 z-30 bg-slate-950/95 border-t border-slate-800 px-3 py-1.5 flex items-center justify-around text-[10px] select-none">
          <button
            onClick={() => setCurrentRole('passenger')}
            id="nav-tab-passenger"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              currentRole === 'passenger'
                ? 'text-amber-400 font-extrabold bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-4 h-4" />
            <span>सवारी (Passenger)</span>
          </button>

          <button
            onClick={() => setCurrentRole('captain')}
            id="nav-tab-captain"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              currentRole === 'captain'
                ? 'text-amber-400 font-extrabold bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Car className="w-4 h-4" />
            <span>कैप्टन (Captain)</span>
          </button>

          <button
            onClick={() => setCurrentRole('admin')}
            id="nav-tab-admin"
            className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all ${
              currentRole === 'admin'
                ? 'text-amber-400 font-extrabold bg-amber-500/10'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Crown className="w-4 h-4" />
            <span>एडमिन (HQ)</span>
          </button>

          <button
            onClick={() => setIsAuthModalOpen(true)}
            id="btn-auth-profile"
            className="flex flex-col items-center gap-0.5 py-1 px-2 rounded-xl text-slate-400 hover:text-slate-200 transition-all"
            title="Profile / Fast2SMS Login"
          >
            <LogIn className="w-4 h-4" />
            <span>प्रोफाइल (Auth)</span>
          </button>
        </footer>
      </div>

      {/* Global Modals */}
      <SplashWelcome
        isOpen={showSplash}
        onStart={() => setShowSplash(false)}
      />

      <SosEmergencyModal
        isOpen={isSosOpen}
        onClose={() => setIsSosOpen(false)}
        role={currentRole === 'captain' ? 'captain' : 'passenger'}
        userName={userProfile?.name || 'Alwar Resident'}
        userPhone={userProfile?.phone || '+91 98295 12044'}
      />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        defaultRole={currentRole === 'captain' ? 'captain' : 'passenger'}
      />
    </div>
  );
}
