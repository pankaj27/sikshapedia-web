import { useEffect, useState } from 'react';
import api from '../api/axios';

/**
 * TrackingScripts Component
 * Fetches tracking settings from API and injects them into document head/body
 * Handles: Google Analytics, Search Console, GTM, Facebook Pixel, Clarity, Custom Scripts
 */
const TrackingScripts = () => {
  const [settings, setSettings] = useState(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/seo/tracking-settings/public');
        setSettings(response.data);
      } catch (error) {
        console.log('Tracking settings not available');
      }
    };
    fetchSettings();
  }, []);

  useEffect(() => {
    if (!settings || loaded) return;

    // Helper to create and append script
    const appendScript = (content, id, isExternal = false, src = '') => {
      if (document.getElementById(id)) return; // Already exists
      
      const script = document.createElement('script');
      script.id = id;
      if (isExternal) {
        script.src = src;
        script.async = true;
      } else {
        script.innerHTML = content;
      }
      document.head.appendChild(script);
    };

    // Helper to create and append meta tag
    const appendMeta = (name, content, property = false) => {
      if (!content) return;
      const existingMeta = document.querySelector(`meta[${property ? 'property' : 'name'}="${name}"]`);
      if (existingMeta) {
        existingMeta.setAttribute('content', content);
        return;
      }
      const meta = document.createElement('meta');
      if (property) {
        meta.setAttribute('property', name);
      } else {
        meta.setAttribute('name', name);
      }
      meta.setAttribute('content', content);
      document.head.appendChild(meta);
    };

    // 1. Google Analytics (GA4)
    if (settings.google_analytics_id) {
      appendScript('', 'ga-script-external', true, 
        `https://www.googletagmanager.com/gtag/js?id=${settings.google_analytics_id}`);
      
      appendScript(`
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', '${settings.google_analytics_id}');
      `, 'ga-script-init');
    }

    // 2. Google Search Console Verification
    if (settings.google_search_console_verification) {
      appendMeta('google-site-verification', settings.google_search_console_verification);
    }

    // 3. Google Tag Manager
    if (settings.google_tag_manager_id) {
      appendScript(`
        (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
        new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
        j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
        'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
        })(window,document,'script','dataLayer','${settings.google_tag_manager_id}');
      `, 'gtm-script');

      // GTM noscript iframe (append to body)
      if (!document.getElementById('gtm-noscript')) {
        const noscript = document.createElement('noscript');
        noscript.id = 'gtm-noscript';
        noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${settings.google_tag_manager_id}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
        document.body.insertBefore(noscript, document.body.firstChild);
      }
    }

    // 4. Facebook Pixel
    if (settings.facebook_pixel_id) {
      appendScript(`
        !function(f,b,e,v,n,t,s)
        {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
        n.callMethod.apply(n,arguments):n.queue.push(arguments)};
        if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
        n.queue=[];t=b.createElement(e);t.async=!0;
        t.src=v;s=b.getElementsByTagName(e)[0];
        s.parentNode.insertBefore(t,s)}(window, document,'script',
        'https://connect.facebook.net/en_US/fbevents.js');
        fbq('init', '${settings.facebook_pixel_id}');
        fbq('track', 'PageView');
      `, 'fb-pixel-script');
    }

    // 5. Microsoft Clarity
    if (settings.microsoft_clarity_id) {
      appendScript(`
        (function(c,l,a,r,i,t,y){
          c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
          t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
          y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
        })(window, document, "clarity", "script", "${settings.microsoft_clarity_id}");
      `, 'clarity-script');
    }

    // 6. Default Meta Tags
    if (settings.meta_tags) {
      const meta = settings.meta_tags;
      if (meta.default_keywords) appendMeta('keywords', meta.default_keywords);
      if (meta.og_image) appendMeta('og:image', meta.og_image, true);
      if (meta.twitter_card) appendMeta('twitter:card', meta.twitter_card);
      if (meta.twitter_site) appendMeta('twitter:site', meta.twitter_site);
    }

    // 7. Custom Head Scripts
    if (settings.custom_head_scripts) {
      const customHead = document.createElement('div');
      customHead.id = 'custom-head-scripts';
      customHead.innerHTML = settings.custom_head_scripts;
      // Move scripts from div to head
      const scripts = customHead.querySelectorAll('script');
      scripts.forEach(script => {
        const newScript = document.createElement('script');
        if (script.src) {
          newScript.src = script.src;
          newScript.async = script.async;
        } else {
          newScript.innerHTML = script.innerHTML;
        }
        document.head.appendChild(newScript);
      });
      // Move meta tags from div to head
      const metas = customHead.querySelectorAll('meta');
      metas.forEach(meta => {
        document.head.appendChild(meta.cloneNode(true));
      });
    }

    // 8. Custom Body Scripts
    if (settings.custom_body_scripts) {
      const customBody = document.createElement('div');
      customBody.id = 'custom-body-scripts';
      customBody.innerHTML = settings.custom_body_scripts;
      document.body.appendChild(customBody);
    }

    setLoaded(true);
  }, [settings, loaded]);

  return null; // This component doesn't render anything
};

export default TrackingScripts;
