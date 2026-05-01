import { useEffect, useState } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import PortfolioRenderer from '../components/premium/PortfolioRenderer';
import { THEME_PRESETS } from '../lib/themePresets';
import { DEMO_BLUEPRINTS } from '../lib/demoBlueprints';

export default function Portfolio() {
  const router = useRouter();
  const [data,    setData]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState(null);

  useEffect(() => {
    if (!router.isReady) return;

    try {
      // 1. Demo gallery flow: /portfolio?demo=<slug>
      const demoSlug = typeof router.query.demo === 'string' ? router.query.demo : null;
      if (demoSlug && DEMO_BLUEPRINTS[demoSlug]) {
        const { blueprint, themeId } = DEMO_BLUEPRINTS[demoSlug];
        setData({
          blueprint,
          theme: THEME_PRESETS[themeId] || THEME_PRESETS.sleek_engineer,
        });
        setLoading(false);
        return;
      }

      // 2. Real generator flow: sessionStorage handoff from index.js
      const raw     = sessionStorage.getItem('portfolioBlueprint');
      const themeId = sessionStorage.getItem('portfolioTheme') || 'sleek_engineer';
      if (!raw) {
        setError('No portfolio data found.');
        setLoading(false);
        return;
      }
      setData({
        blueprint: JSON.parse(raw),
        theme: THEME_PRESETS[themeId] || THEME_PRESETS.sleek_engineer,
      });
    } catch (e) {
      setError('Failed to load portfolio data.');
    }
    setLoading(false);
  }, [router.isReady, router.query.demo]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#09090b' }}>
        <div style={{ color: 'rgba(255,255,255,0.5)', fontFamily: 'Inter, sans-serif', fontSize: '1rem' }}>
          Loading portfolio…
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#09090b', gap: '1.5rem' }}>
        <p style={{ color: 'rgba(255,255,255,0.7)', fontFamily: 'Inter, sans-serif', fontSize: '1.05rem' }}>
          {error || 'No portfolio data found.'}
        </p>
        <a href="/" style={{ color: '#a855f7', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem', textDecoration: 'underline' }}>
          ← Generate a portfolio
        </a>
      </div>
    );
  }

  const { blueprint, theme } = data;
  const name = blueprint?.hero?.name || 'Portfolio';

  return (
    <>
      <Head>
        <title>{name} — Portfolio</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="description" content={`Portfolio of ${name}`} />
        {theme.fontUrl && (
          <link rel="preconnect" href="https://fonts.googleapis.com" />
        )}
      </Head>
      <PortfolioRenderer blueprint={blueprint} theme={theme} />
    </>
  );
}
