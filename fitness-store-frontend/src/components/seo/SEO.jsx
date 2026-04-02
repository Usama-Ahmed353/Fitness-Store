import React from 'react';
import { Helmet } from 'react-helmet-async';

const SEO = ({
  title = 'CrunchFit Pro - Fitness Gym Membership & Classes',
  description = 'Crush your fitness goals with CrunchFit Pro. Access 100+ group fitness classes, personal training, and state-of-the-art gym facilities.',
  canonical = 'https://www.crunchfit.com',
  ogTitle,
  ogDescription,
  ogImage = 'https://www.crunchfit.com/og-image.jpg',
  ogType = 'website',
  ogUrl,
  twitterCard = 'summary_large_image',
  twitterSite = '@crunchfitpro',
  twitterCreator = '@crunchfitpro',
  noindex = false,
}) => {
  const fullTitle = title.includes('CrunchFit') ? title : `${title} | CrunchFit Pro`;
  const finalOgTitle = ogTitle || title;
  const finalOgDescription = ogDescription || description;
  const finalOgUrl = ogUrl || canonical;

  return (
    <Helmet>
      {/* Basic Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="charset" content="utf-8" />
      <meta name="language" content="English" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={canonical} />

      {/* Robots */}
      <meta name="robots" content={noindex ? 'noindex, nofollow' : 'index, follow'} />
      <meta name="googlebot" content={noindex ? 'noindex, nofollow' : 'index, follow'} />

      {/* Open Graph */}
      <meta property="og:type" content={ogType} />
      <meta property="og:title" content={finalOgTitle} />
      <meta property="og:description" content={finalOgDescription} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:url" content={finalOgUrl} />
      <meta property="og:site_name" content="CrunchFit Pro" />

      {/* Twitter Card */}
      <meta name="twitter:card" content={twitterCard} />
      <meta name="twitter:title" content={finalOgTitle} />
      <meta name="twitter:description" content={finalOgDescription} />
      <meta name="twitter:image" content={ogImage} />
      <meta name="twitter:site" content={twitterSite} />
      <meta name="twitter:creator" content={twitterCreator} />

      {/* Additional SEO Tags */}
      <meta name="theme-color" content="#1A1A2E" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      <meta name="apple-mobile-web-app-capable" content="yes" />

      {/* Structured Data (JSON-LD) */}
      <script type="application/ld+json">
        {JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'LocalBusiness',
          name: 'CrunchFit Pro',
          description: description,
          url: canonical,
          logo: 'https://www.crunchfit.com/logo.png',
          image: ogImage,
          telephone: '+1-800-CRUNCH',
          sameAs: [
            'https://www.facebook.com/crunchfit',
            'https://www.twitter.com/crunchfitpro',
            'https://www.instagram.com/crunchfitpro',
          ],
          address: {
            '@type': 'PostalAddress',
            addressCountry: 'US',
            addressRegion: 'NY',
          },
          contactPoint: {
            '@type': 'ContactPoint',
            contactType: 'Customer Service',
            telephone: '+1-800-CRUNCH',
          },
        })}
      </script>
    </Helmet>
  );
};

export default SEO;
