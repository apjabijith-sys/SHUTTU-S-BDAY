import React, { useState, useEffect } from 'react';
import { FloralCanvas } from './components/ThreeCanvas/FloralCanvas';
import { Gatekeeper } from './components/Gatekeeper/Gatekeeper';
import { Navbar } from './components/Navigation/Navbar';
import { HeroSection } from './components/Hero/HeroSection';
import { ScratchCardSection } from './components/Sections/ScratchCardSection';
import { PhilosophySection } from './components/Sections/PhilosophySection';
import { MarqueeBanner } from './components/Sections/MarqueeBanner';
import { CollectionsSection, MemoryItem } from './components/Sections/CollectionsSection';
import { FavouritesSection } from './components/Sections/FavouritesSection';
import { SignatureInstallation } from './components/Sections/SignatureInstallation';
import { ForeverAgreementSection } from './components/Sections/ForeverAgreementSection';
import { Footer } from './components/Sections/Footer';
import { PhotoUploadModal } from './components/Modals/PhotoUploadModal';
import { LoveLetterModal } from './components/Modals/LoveLetterModal';
import { CollectionModal } from './components/Modals/CollectionModal';
import { sound } from './utils/soundEffects';

export const App: React.FC = () => {
  // Gatekeeper state: checks sessionStorage
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => {
    return sessionStorage.getItem('shuttu_atelier_unlocked') === 'true';
  });

  // Current Photo for Shuttu (Permanently set to her portrait)
  const [photoUrl, setPhotoUrl] = useState<string>(() => {
    return (
      localStorage.getItem('shuttu_photo_url_v2') ||
      '/images/shuttu_photo_editorial.jpg'
    );
  });

  // Modals
  const [isPhotoModalOpen, setIsPhotoModalOpen] = useState(false);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [selectedCollection, setSelectedCollection] = useState<MemoryItem | null>(null);

  const handleUnlock = () => {
    setIsUnlocked(true);
    sessionStorage.setItem('shuttu_atelier_unlocked', 'true');
  };

  const handleReLock = () => {
    setIsUnlocked(false);
    sessionStorage.removeItem('shuttu_atelier_unlocked');
  };

  const handleSavePhoto = (newUrl: string) => {
    setPhotoUrl(newUrl);
    localStorage.setItem('shuttu_photo_url_v2', newUrl);
  };

  const scrollToScratchCard = () => {
    sound.playHover();
    const elem = document.getElementById('scratch-card');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const scrollToMemories = () => {
    sound.playHover();
    const elem = document.getElementById('memories');
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        backgroundColor: '#4A0E17',
        color: '#FAF5F2',
        overflowX: 'hidden',
      }}
    >
      {/* Three.js 3D Floral Background & Interactive Canvas */}
      <FloralCanvas isUnlocked={isUnlocked} />

      {/* Security Gatekeeper Screen */}
      {!isUnlocked && <Gatekeeper onUnlock={handleUnlock} />}

      {/* Main Website (visible beneath gatekeeper & interactive once unlocked) */}
      <div
        style={{
          opacity: isUnlocked ? 1 : 0.82,
          filter: isUnlocked ? 'none' : 'blur(4px)',
          transition: 'filter 0.8s ease, opacity 0.8s ease',
          pointerEvents: isUnlocked ? 'auto' : 'none',
        }}
      >
        {/* Navigation Bar */}
        <Navbar
          onReLock={handleReLock}
          onOpenLoveLetter={() => setIsLetterModalOpen(true)}
        />

        <main>
          {/* Hero Section */}
          <HeroSection
            currentPhotoUrl={photoUrl}
            onOpenPhotoModal={() => setIsPhotoModalOpen(true)}
            onExploreClick={scrollToScratchCard}
          />

          {/* Second Page: Luxury Scratch Card Prize */}
          <ScratchCardSection />

          {/* Philosophy Section */}
          <PhilosophySection onDiscoverClick={scrollToMemories} />

          {/* Infinite Marquee Ribbon */}
          <MarqueeBanner />

          {/* Collections Section */}
          <CollectionsSection
            onSelectCollection={(item) => setSelectedCollection(item)}
          />

          {/* Favourites Section: Soundtrack, Movies & Characters */}
          <FavouritesSection />

          {/* Signature Floral Installation Banner */}
          <SignatureInstallation
            onOpenLetter={() => setIsLetterModalOpen(true)}
          />

          {/* Grand Finale: The Forever & Always Binding Agreement with iPad Signature Pad */}
          <ForeverAgreementSection />
        </main>

        {/* Footer */}
        <Footer />
      </div>

      {/* Modals */}
      <PhotoUploadModal
        isOpen={isPhotoModalOpen}
        onClose={() => setIsPhotoModalOpen(false)}
        currentPhotoUrl={photoUrl}
        onSavePhoto={handleSavePhoto}
      />

      <LoveLetterModal
        isOpen={isLetterModalOpen}
        onClose={() => setIsLetterModalOpen(false)}
      />

      <CollectionModal
        item={selectedCollection}
        onClose={() => setSelectedCollection(null)}
      />
    </div>
  );
};

export default App;
