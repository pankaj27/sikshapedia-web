import React from 'react';
import { FiPlus, FiTrash2, FiCopy, FiChevronUp, FiChevronDown } from 'react-icons/fi';

/**
 * Reusable FAQ Builder Component
 */
const FaqBuilder = ({
  faqs = [],
  onChange,
  title = 'FAQs',
  collegeName = '',
  showQuickTemplates = true,
  compact = false
}) => {
  const addFaq = () => {
    onChange([...faqs, { question: '', answer: '' }]);
  };

  const updateFaq = (index, field, value) => {
    const newFaqs = [...faqs];
    newFaqs[index][field] = value;
    onChange(newFaqs);
  };

  const removeFaq = (index) => {
    onChange(faqs.filter((_, i) => i !== index));
  };

  const moveFaq = (index, direction) => {
    const newFaqs = [...faqs];
    const newIndex = index + direction;
    if (newIndex >= 0 && newIndex < faqs.length) {
      [newFaqs[index], newFaqs[newIndex]] = [newFaqs[newIndex], newFaqs[index]];
      onChange(newFaqs);
    }
  };

  const commonTemplates = [
    { q: `What is the admission process for ${collegeName || 'this college'}?`, a: 'The admission process involves...' },
    { q: `What are the eligibility criteria for ${collegeName || 'this college'}?`, a: 'The eligibility criteria are...' },
    { q: `What is the fee structure at ${collegeName || 'this college'}?`, a: 'The fee structure varies by program...' },
    { q: `Does ${collegeName || 'this college'} provide placement assistance?`, a: 'Yes, the college has a dedicated placement cell...' },
    { q: `What are the hostel facilities available?`, a: 'The college provides separate hostels for boys and girls...' },
    { q: `What scholarships are available?`, a: 'Various scholarships are available based on merit and need...' }
  ];

  const addTemplate = (template) => {
    onChange([...faqs, { question: template.q, answer: template.a }]);
  };

  const copyFaqSchema = () => {
    const schema = {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": faqs.map(faq => ({
        "@type": "Question",
        "name": faq.question,
        "acceptedAnswer": {
          "@type": "Answer",
          "text": faq.answer
        }
      }))
    };
    navigator.clipboard.writeText(JSON.stringify(schema, null, 2));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className={compact ? 'text-xs font-semibold text-gray-700' : 'text-sm font-medium'}>
          {title}
        </p>
        <div className="flex items-center gap-2">
          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{faqs.length} FAQs</span>
          <button
            type="button"
            onClick={addFaq}
            className={compact ? 'text-xs bg-blue-500 text-white px-2 py-1 rounded hover:bg-blue-600' : 'px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600'}
          >
            <FiPlus className="inline mr-1" /> Add FAQ
          </button>
        </div>
      </div>

      {/* FAQ Items */}
      {faqs.length === 0 ? (
        <p className="text-xs text-gray-500 italic">No FAQs added yet. Click "+ Add FAQ" to add.</p>
      ) : (
        <div className="space-y-3">
          {faqs.map((faq, index) => (
            <div key={index} className="bg-gray-50 rounded-lg p-3 border">
              <div className="flex items-start gap-2">
                <div className="flex-1 space-y-2">
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Question</label>
                    <input
                      type="text"
                      value={faq.question}
                      onChange={(e) => updateFaq(index, 'question', e.target.value)}
                      placeholder="Enter question..."
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 mb-1">Answer</label>
                    <textarea
                      value={faq.answer}
                      onChange={(e) => updateFaq(index, 'answer', e.target.value)}
                      placeholder="Enter answer..."
                      rows={2}
                      className="w-full border rounded px-2 py-1 text-sm"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1">
                  <button type="button" onClick={() => moveFaq(index, -1)} disabled={index === 0} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                    <FiChevronUp size={14} />
                  </button>
                  <button type="button" onClick={() => moveFaq(index, 1)} disabled={index === faqs.length - 1} className="p-1 hover:bg-gray-200 rounded disabled:opacity-30">
                    <FiChevronDown size={14} />
                  </button>
                  <button type="button" onClick={() => removeFaq(index)} className="p-1 hover:bg-red-100 rounded text-red-500">
                    <FiTrash2 size={14} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick Templates */}
      {showQuickTemplates && (
        <div className="mt-3 pt-3 border-t">
          <p className="text-xs text-gray-600 mb-2">💡 Common FAQ Templates:</p>
          <div className="flex flex-wrap gap-2">
            {commonTemplates.slice(0, 4).map((template, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => addTemplate(template)}
                className="text-xs bg-gray-100 hover:bg-gray-200 px-2 py-1 rounded truncate max-w-[200px]"
                title={template.q}
              >
                + {template.q.substring(0, 30)}...
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Copy Schema */}
      {faqs.length > 0 && (
        <div className="flex justify-end">
          <button
            type="button"
            onClick={copyFaqSchema}
            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
          >
            <FiCopy size={12} /> Copy FAQ Schema (JSON-LD)
          </button>
        </div>
      )}
    </div>
  );
};

export default FaqBuilder;
