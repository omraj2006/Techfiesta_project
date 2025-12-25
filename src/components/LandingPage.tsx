import React, { useState } from 'react';
import { Header } from './landing/Header';
import { Hero } from './landing/Hero';
import { ProblemSection } from './landing/ProblemSection';
import { HowItWorks } from './landing/HowItWorks';
import { Features } from './landing/Features';
import { Security } from './landing/Security';
import { FAQ } from './landing/FAQ';
import { Footer } from './landing/Footer';
import { ClaimInterface } from './user/ClaimInterface';

// Define the interface to accept the sign-in function from App.tsx
interface LandingPageProps {
  onSignIn?: () => void;
}

export function LandingPage({ onSignIn }: LandingPageProps) {
  const [showClaimInterface, setShowClaimInterface] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Pass the onSignIn function to the Header */}
      <Header 
        onStartClaim={() => setShowClaimInterface(true)} 
        onSignIn={onSignIn}
      />
      <main>
        <Hero onStartClaim={() => setShowClaimInterface(true)} />
        <ProblemSection />
        <HowItWorks />
        <Features />
        <Security />
        <FAQ />
      </main>
      <Footer />
      
      {showClaimInterface && (
        <ClaimInterface onClose={() => setShowClaimInterface(false)} />
      )}
    </div>
  );
}