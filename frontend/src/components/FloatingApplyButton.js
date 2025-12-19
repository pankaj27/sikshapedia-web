import React, { useState, useEffect } from 'react';
import { FiEdit3 } from 'react-icons/fi';
import ApplyNowModal from './ApplyNowModal';
import api from '../api/axios';

const FloatingApplyButton = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [settings, setSettings] = useState(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/lead-settings');
        setSettings(response.data);
      } catch (err) {
        console.error('Failed to fetch lead settings:', err);
      }
    };
    fetchSettings();
  }, []);

  // Don't render if floating CTA is disabled
  if (settings && !settings.show_floating_cta) {
    return null;
  }

  const buttonText = settings?.cta_button_text || 'Apply Now';
  const buttonColor = settings?.cta_button_color || '#f97316';

  return (
    <>
      {/* Floating Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-6 right-6 z-40 flex items-center gap-2 px-5 py-3 text-white font-semibold rounded-full shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
        style={{ backgroundColor: buttonColor }}
      >
        <FiEdit3 className="w-5 h-5" />
        <span>{buttonText}</span>
      </button>

      {/* Modal */}
      <ApplyNowModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        formHeading={settings?.general_form_heading}
        source="floating_cta"
      />

      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-5px);
          }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default FloatingApplyButton;
