/*
 * LandingPage component implementing the new UX design requested by the user.
 *
 * This React component renders a hero section with an analog clock on the right
 * and a call‑to‑action on the left, followed by three feature cards and a
 * testimonials section. The layout and colours follow the mockup provided
 * by the user: light, neutral backgrounds with a warm accent colour for
 * interactive elements.
 */

import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

// Define a colour palette based on predicted 2025 design trends.
const COLOR_PALETTE = {
  background: '#EEE5DE',
  heroBg: '#F8F2EE',
  accent: '#D58BBD',
  text: '#385739',
  feature1: '#FFFFFF',
  feature2: '#FFFFFF',
  feature3: '#FFFFFF',
};

/*
 * AnalogClock
 *
 * A simple analogue clock component. It uses CSS for the clock face and
 * JavaScript to update the hour, minute and second hands every second.
 * The colours are chosen to match the neutral theme of the landing page.
 */
const AnalogClock: React.FC = React.memo(() => {
  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateClock = () => {
      const now = new Date();
      const hours = now.getHours() % 12;
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const hourAngle = (hours + minutes / 60) * 30;
      const minuteAngle = (minutes + seconds / 60) * 6;
      const secondAngle = seconds * 6;
      if (hourRef.current) hourRef.current.style.transform = `rotate(${hourAngle}deg)`;
      if (minuteRef.current) minuteRef.current.style.transform = `rotate(${minuteAngle}deg)`;
      if (secondRef.current) secondRef.current.style.transform = `rotate(${secondAngle}deg)`;
    };
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analog-clock">
      <div className="clock-face">
        <div ref={hourRef} className="clock-hand hour" />
        <div ref={minuteRef} className="clock-hand minute" />
        <div ref={secondRef} className="clock-hand second" />
      </div>
    </div>
  );
});

/*
 * FeatureCard
 *
 * A small reusable component for the three feature highlights. Each card
 * contains an SVG icon, a heading and a brief description. The icon
 * accepts an SVG path (string) so you can easily swap or update icons.
 */
interface FeatureCardProps {
  title: string;
  description: string;
  svgPath: string;
}

const FeatureCard: React.FC<FeatureCardProps> = React.memo(({ title, description, svgPath }) => (
  <div className="feature-card">
    <div className="icon-wrapper">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="feature-icon" aria-hidden="true">
        <path d={svgPath} />
      </svg>
    </div>
    <h3 className="feature-title">{title}</h3>
    <p className="feature-description">{description}</p>
  </div>
));

/*
 * TestimonialCard
 *
 * Displays a user testimonial with a star rating, the quote and the author’s name.
 */
interface TestimonialCardProps {
  quote: string;
  author: string;
}

const STAR_PATH =
  'M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z';

const TestimonialCard: React.FC<TestimonialCardProps> = React.memo(({ quote, author }) => {
  const stars = React.useMemo(
    () =>
      Array.from({ length: 5 }, (_, i) => (
        <svg key={i} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="star-icon" aria-hidden="true">
          <path d={STAR_PATH} />
        </svg>
      )),
    []
  );

  return (
    <div className="testimonial-card">
      <div className="stars" aria-label="5 star rating">{stars}</div>
      <p className="testimonial-quote">“{quote}”</p>
      <p className="testimonial-author">{author}</p>
    </div>
  );
});

/*
 * LandingPage
 *
 * Combines the hero section, features and testimonials into one cohesive page.
 */
const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const features = [
    {
      title: 'Easy Scheduling',
      description: 'Quickly add and organise your events',
      svgPath: 'M10.854 7.146a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708 0l-1.5-1.5a.5.5 0 1 1 .708-.708L7.5 9.793l2.646-2.647a.5.5 0 0 1 .708 0 M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z',
    },
    {
      title: 'Roster Capture',
      description: 'Extract events seamlessly from PDFs',
      svgPath: 'M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z',
    },
    {
      title: 'Advanced Features',
      description: 'Utilise powerful tools to enhance productivity',
      svgPath: 'M0 0h1v15h15v1H0zm14.817 3.113a.5.5 0 0 1 .07.704l-4.5 5.5a.5.5 0 0 1-.74.037L7.06 6.767l-3.656 5.027a.5.5 0 0 1-.808-.588l4-5.5a.5.5 0 0 1 .758-.06l2.609 2.61 4.15-5.073a.5.5 0 0 1 .704-.07',
    },
  ];

  const testimonials = [
    {
      quote: 'No more printing my roster — I just upload and check it on my phone.',
      author: 'Jordan',
    },
    {
      quote: 'A must‑have for anyone looking to get organised and boost productivity!',
      author: 'Alexander',
    },
  ];

  const handleGetStarted = () => {
    navigate('/upload');
  };

  return (
    <div className="landing-container" style={{ backgroundColor: COLOR_PALETTE.background, color: COLOR_PALETTE.text }}>
      {/* Header with logo */}
      <header className="logo-header" style={{ padding: '1rem 2rem', display: 'flex', alignItems: 'center' }}>
        <img src="/logo.png" alt="RosterFlow logo" style={{ height: 40, width: 40 }} />
      </header>

      {/* Hero Section */}
      <section className="hero-card" style={{ backgroundColor: COLOR_PALETTE.heroBg, borderRadius: '1rem', boxShadow: '0 4px 12px rgba(0,0,0,0.05)', padding: '3rem', margin: '2rem auto', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', maxWidth: '980px' }}>
        <div className="hero-content" style={{ flex: '1 1 420px' }}>
          <h1 className="hero-title" style={{ fontSize: '2.75rem', fontWeight: 700, marginBottom: '1rem', lineHeight: 1.2 }}>
            No More Printing Roster
          </h1>
          <p className="hero-subtitle" style={{ fontSize: '1.2rem', marginBottom: '1.5rem', maxWidth: '480px' }}>
            Upload and check on my calendar on my phone
          </p>
          <button className="cta-button" onClick={handleGetStarted} style={{ backgroundColor: COLOR_PALETTE.accent, color: '#ffffff', border: 'none', padding: '0.75rem 1.5rem', borderRadius: '0.5rem', fontSize: '1rem', fontWeight: 600, cursor: 'pointer' }}>
            Upload Roster
          </button>
        </div>
        <div className="hero-clock" style={{ flex: '0 0 260px', display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: '2rem' }}>
          <AnalogClock />
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section" style={{ maxWidth: '980px', margin: '0 auto', padding: '0 2rem', display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'space-between' }}>
        {features.map((feature) => (
          <div key={feature.title} className="feature-wrapper" style={{ flex: '1 1 280px', backgroundColor: COLOR_PALETTE.feature1, borderRadius: '1rem', padding: '2rem', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <FeatureCard title={feature.title} description={feature.description} svgPath={feature.svgPath} />
          </div>
        ))}
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section" style={{ maxWidth: '980px', margin: '3rem auto', padding: '0 2rem' }}>
        <h2 className="testimonials-title" style={{ fontSize: '2rem', fontWeight: 700, textAlign: 'center', marginBottom: '2rem' }}>What Our Users Are Saying</h2>
        <div className="testimonials-wrapper" style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center' }}>
          {testimonials.map((t) => (
            <div key={t.author} className="testimonial-wrapper" style={{ flex: '1 1 280px', maxWidth: '340px' }}>
              <TestimonialCard quote={t.quote} author={t.author} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
