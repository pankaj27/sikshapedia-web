import React, { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiPrinter, FiShare2, FiCopy, FiCheck } from 'react-icons/fi';
import { Button } from './ui/button';

const ReviewQRGenerator = ({ 
  reviewLink, 
  instituteName, 
  instituteLogo,
  instituteType = 'College'
}) => {
  const [copied, setCopied] = React.useState(false);
  const qrRef = useRef(null);
  const printRef = useRef(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const svg = qrRef.current?.querySelector('svg');
    if (!svg) return;
    
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      canvas.width = 400;
      canvas.height = 500;
      
      // White background
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      // Draw QR code centered
      ctx.drawImage(img, 50, 80, 300, 300);
      
      // Add text
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 20px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(instituteName, canvas.width / 2, 40);
      
      ctx.font = '14px Arial';
      ctx.fillStyle = '#6b7280';
      ctx.fillText('Scan to leave a review', canvas.width / 2, 60);
      ctx.fillText('Share your experience with us!', canvas.width / 2, 420);
      
      // Download
      const link = document.createElement('a');
      link.download = `${instituteName.replace(/\s+/g, '_')}_Review_QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    };
    
    img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Review QR Code - ${instituteName}</title>
        <style>
          body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            margin: 0;
            background: white;
          }
          .print-container {
            text-align: center;
            padding: 40px;
            border: 2px solid #e5e7eb;
            border-radius: 16px;
            max-width: 400px;
          }
          .logo {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            margin: 0 auto 20px;
            object-fit: cover;
          }
          .institute-name {
            font-size: 24px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .institute-type {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 24px;
          }
          .qr-container {
            padding: 20px;
            background: #f9fafb;
            border-radius: 12px;
            margin-bottom: 20px;
          }
          .qr-container svg {
            width: 200px !important;
            height: 200px !important;
          }
          .instruction {
            font-size: 18px;
            color: #374151;
            font-weight: 600;
            margin-bottom: 8px;
          }
          .sub-instruction {
            font-size: 14px;
            color: #6b7280;
          }
          .footer {
            margin-top: 24px;
            padding-top: 16px;
            border-top: 1px solid #e5e7eb;
            font-size: 12px;
            color: #9ca3af;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
        </style>
      </head>
      <body>
        ${printContent.innerHTML}
        <script>window.onload = function() { window.print(); window.close(); }</script>
      </body>
      </html>
    `);
    printWindow.document.close();
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Review ${instituteName}`,
          text: `Share your experience at ${instituteName}`,
          url: reviewLink
        });
      } catch (err) {
        console.log('Share cancelled');
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border">
      {/* Print Template (Hidden) */}
      <div ref={printRef} className="hidden">
        <div className="print-container">
          {instituteLogo && <img src={instituteLogo} alt="" className="logo" />}
          <div className="institute-name">{instituteName}</div>
          <div className="institute-type">{instituteType}</div>
          <div className="qr-container">
            <QRCodeSVG value={reviewLink} size={200} level="H" />
          </div>
          <div className="instruction">📱 Scan to Review</div>
          <div className="sub-instruction">Share your experience with future students!</div>
          <div className="footer">Powered by AdmissionBuddy</div>
        </div>
      </div>

      {/* Visible Component */}
      <div className="p-6">
        <div className="text-center mb-6">
          {instituteLogo && (
            <img src={instituteLogo} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-2 border-gray-200" />
          )}
          <h3 className="text-xl font-bold text-gray-800">{instituteName}</h3>
          <p className="text-sm text-gray-500">{instituteType}</p>
        </div>

        <div ref={qrRef} className="bg-gradient-to-br from-orange-50 to-yellow-50 rounded-xl p-6 flex justify-center mb-6">
          <QRCodeSVG 
            value={reviewLink} 
            size={200} 
            level="H"
            includeMargin={true}
            bgColor="transparent"
          />
        </div>

        <div className="text-center mb-6">
          <p className="font-semibold text-gray-800 mb-1">Scan to Leave a Review</p>
          <p className="text-sm text-gray-500">Students can scan this QR code with their phone camera</p>
        </div>

        {/* Link Display */}
        <div className="bg-gray-50 rounded-lg p-3 mb-4">
          <p className="text-xs text-gray-500 mb-1">Review Link</p>
          <div className="flex items-center gap-2">
            <input 
              type="text" 
              value={reviewLink} 
              readOnly 
              className="flex-1 bg-transparent text-sm text-gray-700 truncate outline-none"
            />
            <button 
              onClick={handleCopyLink}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
              title="Copy link"
            >
              {copied ? <FiCheck className="text-green-600" /> : <FiCopy className="text-gray-600" />}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" onClick={handleDownloadQR} className="flex flex-col items-center gap-1 py-4">
            <FiDownload size={20} />
            <span className="text-xs">Download</span>
          </Button>
          <Button variant="outline" onClick={handlePrint} className="flex flex-col items-center gap-1 py-4">
            <FiPrinter size={20} />
            <span className="text-xs">Print</span>
          </Button>
          <Button variant="outline" onClick={handleShare} className="flex flex-col items-center gap-1 py-4">
            <FiShare2 size={20} />
            <span className="text-xs">Share</span>
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ReviewQRGenerator;
