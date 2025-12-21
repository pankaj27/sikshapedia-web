import React, { useRef, useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { FiDownload, FiPrinter, FiShare2, FiCopy, FiCheck, FiStar } from 'react-icons/fi';
import { Button } from './ui/button';

const ReviewQRGenerator = ({ 
  reviewLink, 
  instituteName, 
  instituteLogo,
  instituteType = 'College'
}) => {
  const [copied, setCopied] = useState(false);
  const qrRef = useRef(null);
  const printRef = useRef(null);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(reviewLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadQR = () => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 600;
    canvas.height = 800;
    
    // Gradient background
    const gradient = ctx.createLinearGradient(0, 0, 600, 800);
    gradient.addColorStop(0, '#f97316');
    gradient.addColorStop(1, '#ea580c');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 600, 800);
    
    // White card background
    ctx.fillStyle = 'white';
    ctx.beginPath();
    ctx.roundRect(30, 30, 540, 740, 20);
    ctx.fill();
    
    // admissionbuddy Logo & Branding
    ctx.fillStyle = '#f97316';
    ctx.font = 'bold 28px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('🎓 admissionbuddy', 300, 80);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '14px Arial';
    ctx.fillText('India\'s Trusted Education Platform', 300, 105);
    
    // Divider line
    ctx.strokeStyle = '#e5e7eb';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(60, 125);
    ctx.lineTo(540, 125);
    ctx.stroke();
    
    // Institution name
    ctx.fillStyle = '#1f2937';
    ctx.font = 'bold 24px Arial';
    ctx.fillText(instituteName, 300, 170);
    
    ctx.fillStyle = '#6b7280';
    ctx.font = '16px Arial';
    ctx.fillText(instituteType, 300, 195);
    
    // QR Code area with border
    ctx.fillStyle = '#fff7ed';
    ctx.beginPath();
    ctx.roundRect(150, 220, 300, 300, 16);
    ctx.fill();
    
    ctx.strokeStyle = '#fed7aa';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(150, 220, 300, 300, 16);
    ctx.stroke();
    
    // Draw QR Code
    const svg = qrRef.current?.querySelector('svg');
    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const img = new Image();
      img.onload = () => {
        ctx.drawImage(img, 175, 245, 250, 250);
        finishDrawing();
      };
      img.src = 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svgData)));
    } else {
      finishDrawing();
    }
    
    function finishDrawing() {
      // Scan instruction
      ctx.fillStyle = '#1f2937';
      ctx.font = 'bold 22px Arial';
      ctx.fillText('📱 Scan to Review', 300, 560);
      
      ctx.fillStyle = '#6b7280';
      ctx.font = '14px Arial';
      ctx.fillText('Share your experience with future students!', 300, 585);
      
      // Stars decoration
      ctx.font = '24px Arial';
      ctx.fillText('⭐ ⭐ ⭐ ⭐ ⭐', 300, 630);
      
      // Footer
      ctx.fillStyle = '#f97316';
      ctx.fillRect(30, 700, 540, 70);
      
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.fillText('Your feedback helps students make better choices!', 300, 735);
      
      ctx.font = '12px Arial';
      ctx.fillText('www.admissionbuddy.co', 300, 755);
      
      // Download
      const link = document.createElement('a');
      link.download = `${instituteName.replace(/\\s+/g, '_')}_Review_QR.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  };

  const handlePrint = () => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Review QR Code - ${instituteName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body {
            font-family: 'Segoe UI', Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            padding: 20px;
          }
          .card {
            background: white;
            border-radius: 24px;
            padding: 40px;
            max-width: 450px;
            box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
          }
          .brand {
            text-align: center;
            margin-bottom: 20px;
            padding-bottom: 20px;
            border-bottom: 2px solid #f3f4f6;
          }
          .brand-logo {
            font-size: 28px;
            font-weight: bold;
            color: #f97316;
          }
          .brand-tagline {
            font-size: 12px;
            color: #6b7280;
            margin-top: 4px;
          }
          .institute {
            text-align: center;
            margin-bottom: 24px;
          }
          .institute-logo {
            width: 70px;
            height: 70px;
            border-radius: 50%;
            margin: 0 auto 12px;
            object-fit: cover;
            border: 3px solid #fed7aa;
          }
          .institute-name {
            font-size: 22px;
            font-weight: bold;
            color: #1f2937;
          }
          .institute-type {
            font-size: 14px;
            color: #6b7280;
            text-transform: capitalize;
          }
          .qr-container {
            background: linear-gradient(135deg, #fff7ed 0%, #ffedd5 100%);
            border-radius: 20px;
            padding: 30px;
            text-align: center;
            margin-bottom: 24px;
            border: 2px solid #fed7aa;
          }
          .qr-container svg {
            width: 200px !important;
            height: 200px !important;
          }
          .instruction {
            text-align: center;
            margin-bottom: 20px;
          }
          .instruction-title {
            font-size: 20px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 8px;
          }
          .instruction-subtitle {
            font-size: 14px;
            color: #6b7280;
          }
          .stars {
            text-align: center;
            font-size: 28px;
            margin-bottom: 24px;
            letter-spacing: 4px;
          }
          .footer {
            background: linear-gradient(135deg, #f97316 0%, #ea580c 100%);
            border-radius: 16px;
            padding: 20px;
            text-align: center;
            color: white;
          }
          .footer-text {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
          }
          .footer-url {
            font-size: 12px;
            opacity: 0.9;
          }
          @media print {
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; background: white; }
            .card { box-shadow: none; }
          }
        </style>
      </head>
      <body>
        <div class="card">
          <div class="brand">
            <div class="brand-logo">🎓 admissionbuddy</div>
            <div class="brand-tagline">India's Trusted Education Platform</div>
          </div>
          
          <div class="institute">
            ${instituteLogo ? `<img src="${instituteLogo}" alt="" class="institute-logo" />` : ''}
            <div class="institute-name">${instituteName}</div>
            <div class="institute-type">${instituteType}</div>
          </div>
          
          <div class="qr-container">
            ${qrRef.current?.innerHTML || ''}
          </div>
          
          <div class="instruction">
            <div class="instruction-title">📱 Scan to Leave a Review</div>
            <div class="instruction-subtitle">Share your experience with future students!</div>
          </div>
          
          <div class="stars">⭐ ⭐ ⭐ ⭐ ⭐</div>
          
          <div class="footer">
            <div class="footer-text">Your feedback helps students make better choices!</div>
            <div class="footer-url">www.admissionbuddy.co</div>
          </div>
        </div>
        <script>window.onload = function() { window.print(); }</script>
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
          text: `Share your experience at ${instituteName} on admissionbuddy`,
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
    <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-1">
      <div className="bg-white rounded-xl overflow-hidden">
        {/* Header with admissionbuddy Branding */}
        <div className="bg-gradient-to-r from-orange-50 to-yellow-50 px-6 py-4 border-b">
          <div className="flex items-center justify-center gap-2">
            <span className="text-2xl">🎓</span>
            <span className="text-xl font-bold text-orange-600">admissionbuddy</span>
          </div>
          <p className="text-center text-xs text-gray-500 mt-1">India's Trusted Education Platform</p>
        </div>

        <div className="p-6">
          {/* Institution Info */}
          <div className="text-center mb-6">
            {instituteLogo ? (
              <img src={instituteLogo} alt="" className="w-16 h-16 rounded-full mx-auto mb-3 object-cover border-3 border-orange-200" />
            ) : (
              <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-orange-500 rounded-full mx-auto mb-3 flex items-center justify-center">
                <span className="text-2xl text-white">🏫</span>
              </div>
            )}
            <h3 className="text-xl font-bold text-gray-800">{instituteName}</h3>
            <p className="text-sm text-gray-500 capitalize">{instituteType}</p>
          </div>

          {/* QR Code with Decorative Border */}
          <div ref={qrRef} className="relative bg-gradient-to-br from-orange-50 to-yellow-50 rounded-2xl p-6 mb-6 border-2 border-orange-200">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-white px-4 py-1 rounded-full border border-orange-200">
              <span className="text-xs font-semibold text-orange-600">SCAN ME</span>
            </div>
            <div className="flex justify-center">
              <QRCodeSVG 
                value={reviewLink} 
                size={180} 
                level="H"
                includeMargin={false}
                bgColor="transparent"
                fgColor="#1f2937"
              />
            </div>
          </div>

          {/* Instruction */}
          <div className="text-center mb-6">
            <p className="font-bold text-gray-800 text-lg mb-1">📱 Scan to Leave a Review</p>
            <p className="text-sm text-gray-500">Share your experience with future students!</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1 mb-6">
            {[1, 2, 3, 4, 5].map((i) => (
              <FiStar key={i} className="fill-yellow-400 text-yellow-400" size={24} />
            ))}
          </div>

          {/* Link Display */}
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-xs text-gray-500 mb-2 font-medium">Review Link</p>
            <div className="flex items-center gap-2 bg-white rounded-lg border p-2">
              <input 
                type="text" 
                value={reviewLink} 
                readOnly 
                className="flex-1 bg-transparent text-sm text-gray-700 truncate outline-none"
              />
              <button 
                onClick={handleCopyLink}
                className={`p-2 rounded-lg transition-all ${copied ? 'bg-green-100' : 'hover:bg-gray-100'}`}
                title="Copy link"
              >
                {copied ? <FiCheck className="text-green-600" size={18} /> : <FiCopy className="text-gray-600" size={18} />}
              </button>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-3">
            <Button 
              variant="outline" 
              onClick={handleDownloadQR} 
              className="flex flex-col items-center gap-2 py-4 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <FiDownload size={22} className="text-orange-600" />
              <span className="text-xs font-medium">Download</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handlePrint} 
              className="flex flex-col items-center gap-2 py-4 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <FiPrinter size={22} className="text-orange-600" />
              <span className="text-xs font-medium">Print</span>
            </Button>
            <Button 
              variant="outline" 
              onClick={handleShare} 
              className="flex flex-col items-center gap-2 py-4 border-orange-200 hover:bg-orange-50 hover:border-orange-300"
            >
              <FiShare2 size={22} className="text-orange-600" />
              <span className="text-xs font-medium">Share</span>
            </Button>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-center text-white">
          <p className="font-medium text-sm">Your feedback helps students make better choices!</p>
          <p className="text-xs opacity-90 mt-1">www.admissionbuddy.co</p>
        </div>
      </div>
    </div>
  );
};

export default ReviewQRGenerator;
