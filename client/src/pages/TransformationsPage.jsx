import React from 'react';
import SectionTag from '../components/ui/SectionTag.jsx';
import TestimonialCard from '../components/ui/TestimonialCard.jsx';
import GoldLine from '../components/ui/GoldLine.jsx';

export function TransformationsPage() {
  return (
    <div style={{ background: 'var(--black)', minHeight: '100vh', paddingTop: '120px', paddingBottom: '80px' }}>
      <div className="container" style={{ padding: '0 60px' }}>
        
        {/* Header */}
        <div style={{ marginBottom: '60px', textAlign: 'center' }}>
          <SectionTag text="ATHLETE CASE LOGS" />
          <h1 style={{ fontSize: 'clamp(40px, 5vw, 64px)', marginBottom: '20px' }}>
            PHYSICAL <span className="text-gold-gradient">TRANSFORMATIONS</span>
          </h1>
          <p style={{ maxWidth: '600px', margin: '0 auto' }}>
            We do not sell quick fixes. Read detailed feedback from elite powerlifters, competitors, and runners on how precision dosing altered their performance timeline.
          </p>
        </div>

        <div className="grid-3" style={{ marginBottom: '60px' }}>
          <TestimonialCard 
            text="Gain parameters were consistent. Ditching bloating compounds allowed me to hit deadlift targets at a 3kg lower body weight class." 
            author="ARJUN KAPOOR" 
            role="National Powerlifter" 
            result="+12KG MUSCLE" 
            initials="AK"
          />
          <TestimonialCard 
            text="Using daily multi and amino profiles preserved muscle tissue while maintaining a 500 kcal daily deficit. Verified COAs give complete peace of mind." 
            author="PRIYA SHARMA" 
            role="Fitness Competitor" 
            result="-8KG FAT" 
            initials="PS"
          />
          <TestimonialCard 
            text="Intra-workout hydration ratios are perfect. Re-hydration salts dissolve instantly with zero dry mouth. PR time slashed by 18 minutes." 
            author="ROHIT VERMA" 
            role="Ultramarathon Athlete" 
            result="18M OFF PR" 
            initials="RV"
          />
        </div>

        <GoldLine />

        <div className="grid-3">
          <TestimonialCard 
            text="Dosed with Whey Concentrate and Creatine daily. Gained 8kg solid mass in 6 months. Recovery windows slashed in half." 
            author="VIKRAM NAIR" 
            role="Classic Bodybuilder" 
            result="+8KG MASS" 
            initials="VN"
          />
          <TestimonialCard 
            text="High metabolic load demands clean macros. Swapped whey for Plant Protein Cafe Mocha. Zero digest bloating and perfect amino recovery." 
            author="SNEHA GUPTA" 
            role="Crossfit Competitor" 
            result="-12KG SHRED" 
            initials="SG"
          />
          <TestimonialCard 
            text="Oats and whey isolates are my standard morning routine. Sustainable clean energy for dual training sessions." 
            author="ADITI SINHA" 
            role="Triathlon Athlete" 
            result="PR IMPROVED" 
            initials="AS"
          />
        </div>

      </div>
    </div>
  );
}

export default TransformationsPage;
