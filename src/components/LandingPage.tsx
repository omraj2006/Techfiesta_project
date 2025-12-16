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

export function LandingPage() {
  const [showClaimInterface, setShowClaimInterface] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Header onStartClaim={() => setShowClaimInterface(true)} />
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