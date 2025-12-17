import React from 'react';
import { FiPlus, FiTrash2, FiArrowUp, FiArrowDown } from 'react-icons/fi';
import { Button } from '../../ui/button';
import CollapsibleSection from '../CollapsibleSection';

const FAQsSection = ({ formData, addFAQ, updateFAQ, removeFAQ, moveFAQ }) => {
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
        <>
          {formData.seo_faqs.map((faq, index) => (
            <div key={index} className="border rounded-lg p-4 mb-4 bg-gray-50">
              <div className="flex justify-between items-start mb-3">
                <span className="bg-orange-100 text-orange-700 text-xs font-medium px-2 py-1 rounded">
                  FAQ #{index + 1}
                </span>
                <div className="flex gap-1">
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFAQ && moveFAQ(index, 'up')}
                    disabled={index === 0}
                    className="p-1"
                  >
                    <FiArrowUp size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => moveFAQ && moveFAQ(index, 'down')}
                    disabled={index === formData.seo_faqs.length - 1}
                    className="p-1"
                  >
                    <FiArrowDown size={14} />
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFAQ(index)}
                    className="p-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <FiTrash2 size={14} />
                  </Button>
                </div>
              </div>
              
              <div className="space-y-3">
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Question *</label>
                  <input
                    type="text"
                    placeholder="e.g., What is the admission process for this college?"
                    value={faq.question}
                    onChange={(e) => updateFAQ(index, 'question', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-600 mb-1 font-medium">Answer *</label>
                  <textarea
                    placeholder="Provide a detailed answer to the question..."
                    value={faq.answer}
                    onChange={(e) => updateFAQ(index, 'answer', e.target.value)}
                    className="w-full border rounded px-3 py-2"
                    rows="4"
                  />
                </div>
              </div>
            </div>
          ))}
          
          <Button type="button" onClick={addFAQ} size="sm">
            <FiPlus className="mr-2" /> Add Another FAQ
          </Button>
        </>
      )}
    </CollapsibleSection>
  );
};

export default FAQsSection;
