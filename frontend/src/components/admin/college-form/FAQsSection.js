import React from 'react';
import { FiPlus, FiTrash2 } from 'react-icons/fi';
import { Button } from '../../ui/button';
import CollapsibleSection from '../CollapsibleSection';

const FAQsSection = ({ formData, setFormData, addFAQ, updateFAQ, removeFAQ }) => {
  // FAQ Templates for quick add
  const faqTemplates = [
    { q: 'What are the admission requirements?', a: '' },
    { q: 'What is the fee structure?', a: '' },
    { q: 'What scholarships are available?', a: '' },
    { q: 'What are the placement statistics?', a: '' },
    { q: 'What courses are offered?', a: '' },
    { q: 'Is hostel facility available?', a: '' },
  ];

  const addFAQFromTemplate = (template) => {
    setFormData({
      ...formData,
      seo_faqs: [...formData.seo_faqs, template]
    });
  };

  return (
    <CollapsibleSection title="FAQs (Frequently Asked Questions)" icon="❓" defaultOpen={false}>
      <p className="text-sm text-gray-600 mb-4">
        Add common questions and answers about this institution. These appear on the detail page and help with SEO.
      </p>
      
      {formData.seo_faqs.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
          <span className="text-4xl mb-2 block">❓</span>
          <p className="text-gray-500 mb-3">No FAQs added yet</p>
          <Button type="button" onClick={addFAQ} size="sm">
            <FiPlus className="mr-2" /> Add First FAQ
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {formData.seo_faqs.map((faq, index) => (
            <div key={index} className="border-2 rounded-lg p-4 bg-white hover:border-blue-300 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 space-y-3">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2 py-0.5 rounded">Q{index + 1}</span>
                      <label className="text-sm font-medium text-gray-700">Question</label>
                    </div>
                    <input
                      type="text"
                      placeholder="e.g., What are the admission requirements?"
                      value={faq.question}
                      onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-blue-400"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="bg-green-100 text-green-800 text-xs font-semibold px-2 py-0.5 rounded">A{index + 1}</span>
                      <label className="text-sm font-medium text-gray-700">Answer</label>
                    </div>
                    <textarea
                      placeholder="Provide a detailed answer..."
                      value={faq.answer}
                      onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                      className="w-full border-2 border-gray-200 rounded-lg px-3 py-2 focus:border-green-400"
                      rows="3"
                    />
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => removeFAQ(index)}
                  className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  title="Remove FAQ"
                >
                  <FiTrash2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          ))}
          
          <Button type="button" onClick={addFAQ} size="sm" className="mt-2">
            <FiPlus className="mr-2" /> Add Another FAQ
          </Button>
        </div>
      )}

      {/* FAQ Preview */}
      {formData.seo_faqs.length > 0 && formData.seo_faqs.some(f => f.question && f.answer) && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
          <h4 className="text-sm font-semibold text-gray-700 mb-3">👁️ FAQ Preview (as shown on page)</h4>
          <div className="space-y-3">
            {formData.seo_faqs.filter(f => f.question && f.answer).map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-3 border">
                <div className="flex items-start gap-2">
                  <span className="text-blue-600 font-bold">Q:</span>
                  <p className="font-medium text-gray-800">{faq.question}</p>
                </div>
                <div className="flex items-start gap-2 mt-2">
                  <span className="text-green-600 font-bold">A:</span>
                  <p className="text-gray-600 text-sm">{faq.answer}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Common FAQ Templates */}
      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h4 className="text-sm font-semibold text-blue-800 mb-3">💡 Quick Add Common FAQs</h4>
        <div className="flex flex-wrap gap-2">
          {faqTemplates.map((template, i) => (
            <button
              key={i}
              type="button"
              onClick={() => addFAQFromTemplate(template)}
              className="text-xs bg-white border border-blue-300 text-blue-700 px-3 py-1.5 rounded-full hover:bg-blue-100 transition-colors"
            >
              + {template.q}
            </button>
          ))}
        </div>
      </div>
    </CollapsibleSection>
  );
};

export default FAQsSection;
