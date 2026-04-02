import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  Palette,
  Eye,
  CheckCircle,
  AlertCircle,
  Copy,
  X,
  Save,
  Settings,
  Link2,
  Mail,
  Shield,
} from 'lucide-react';
import ThemeContext from '../../context/ThemeContext';

const BrandingPage = () => {
  const { theme } = useContext(ThemeContext);
  const isDark = theme === 'dark';

  const [branding, setBranding] = useState({
    logoUrl: null,
    logoFileName: null,
    primaryColor: '#3b82f6',
    secondaryColor: '#10b981',
    faviconUrl: null,
    faviconFileName: null,
  });

  const [customDomain, setCustomDomain] = useState({
    domain: '',
    status: 'unverified', // unverified, pending, verified
    sslStatus: 'not-provisioned',
    showDNSInstructions: false,
    copyFeedback: false,
  });

  const [emailSender, setEmailSender] = useState({
    domain: '',
    hasSetupStarted: false,
    spfVerified: false,
    dkimVerified: false,
    dmarcVerified: false,
    showWizard: false,
  });

  const [planType] = useState('enterprise'); // Simulating Enterprise plan

  const handleFileUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setBranding((prev) => ({
          ...prev,
          [`${type}Url`]: event.target?.result,
          [`${type}FileName`]: file.name,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleColorChange = (color, type) => {
    setBranding((prev) => ({
      ...prev,
      [`${type}Color`]: color,
    }));
  };

  const handleDomainChange = (e) => {
    setCustomDomain((prev) => ({ ...prev, domain: e.target.value }));
  };

  const handleVerifyDomain = () => {
    if (!customDomain.domain.trim()) {
      alert('Enter a domain');
      return;
    }
    setCustomDomain((prev) => ({ ...prev, status: 'pending', showDNSInstructions: true }));
    setTimeout(() => {
      setCustomDomain((prev) => ({ ...prev, status: 'verified', sslStatus: 'provisioned' }));
    }, 2000);
  };

  const handleCopyCNAME = () => {
    navigator.clipboard.writeText(`api.crunchfit.com`);
    setCustomDomain((prev) => ({ ...prev, copyFeedback: true }));
    setTimeout(() => {
      setCustomDomain((prev) => ({ ...prev, copyFeedback: false }));
    }, 2000);
  };

  const handleEmailDomainChange = (e) => {
    setEmailSender((prev) => ({ ...prev, domain: e.target.value }));
  };

  const handleStartEmailSetup = () => {
    setEmailSender((prev) => ({ ...prev, hasSetupStarted: true, showWizard: true }));
  };

  const handleVerifyDNS = (type) => {
    console.log(`Verifying ${type} record...`);
    setEmailSender((prev) => ({
      ...prev,
      [`${type}Verified`]: true,
    }));
    alert(`${type.toUpperCase()} record verified!`);
  };

  const handleSaveBranding = () => {
    console.log('Saving branding:', branding);
    alert('✅ Branding updated successfully!');
  };

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-gray-50'} p-6`}>
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Branding & Customization</h1>
          <p className={`text-lg ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
            White-label your member portal with custom branding and domain
          </p>
        </motion.div>

        {/* White-Label Branding Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 mb-8`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Palette size={28} className="text-blue-600" />
            <h2 className="text-2xl font-bold">White-Label Branding</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left: Upload & Settings */}
            <div className="space-y-6">
              {/* Logo Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3">Gym Logo</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDark
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'logo')}
                    className="hidden"
                    id="logo-upload"
                  />
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-gray-500" />
                    <p className="font-semibold">Upload Logo</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      PNG, JPG up to 5MB (recommended 200x200px)
                    </p>
                  </label>
                </div>
                {branding.logoFileName && (
                  <p className="text-xs mt-2 text-green-600">✓ {branding.logoFileName}</p>
                )}
              </div>

              {/* Favicon Upload */}
              <div>
                <label className="block text-sm font-semibold mb-3">Favicon (Browser Tab Icon)</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                    isDark
                      ? 'border-gray-600 hover:border-gray-500 bg-gray-700'
                      : 'border-gray-300 hover:border-gray-400 bg-gray-50'
                  }`}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleFileUpload(e, 'favicon')}
                    className="hidden"
                    id="favicon-upload"
                  />
                  <label htmlFor="favicon-upload" className="cursor-pointer">
                    <Upload size={32} className="mx-auto mb-2 text-gray-500" />
                    <p className="font-semibold">Upload Favicon</p>
                    <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      ICO, PNG 32x32px
                    </p>
                  </label>
                </div>
                {branding.faviconFileName && (
                  <p className="text-xs mt-2 text-green-600">✓ {branding.faviconFileName}</p>
                )}
              </div>

              {/* Color Pickers */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold mb-3">Primary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.primaryColor}
                      onChange={(e) => handleColorChange(e.target.value, 'primary')}
                      className="w-16 h-16 rounded-lg cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold">Current</p>
                      <p className="text-sm font-mono">{branding.primaryColor}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-3">Secondary Color</label>
                  <div className="flex items-center gap-3">
                    <input
                      type="color"
                      value={branding.secondaryColor}
                      onChange={(e) => handleColorChange(e.target.value, 'secondary')}
                      className="w-16 h-16 rounded-lg cursor-pointer"
                    />
                    <div>
                      <p className="text-xs font-bold">Current</p>
                      <p className="text-sm font-mono">{branding.secondaryColor}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <button
                onClick={handleSaveBranding}
                className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center gap-2"
              >
                <Save size={18} />
                Save Branding Settings
              </button>
            </div>

            {/* Right: Live Preview */}
            <div>
              <label className="block text-sm font-semibold mb-3">Live Preview</label>
              <div
                className={`${isDark ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-300'} rounded-lg border p-6`}
                style={{
                  '--primary': branding.primaryColor,
                  '--secondary': branding.secondaryColor,
                }}
              >
                {/* Member Portal Preview */}
                <div
                  className="rounded-lg overflow-hidden"
                  style={{
                    backgroundColor: '#f3f4f6',
                  }}
                >
                  {/* Header */}
                  <div
                    className="p-4 text-white flex items-center gap-3"
                    style={{ backgroundColor: branding.primaryColor }}
                  >
                    {branding.logoUrl ? (
                      <img src={branding.logoUrl} alt="Logo" className="w-8 h-8 rounded" />
                    ) : (
                      <div className="w-8 h-8 rounded bg-white/20"></div>
                    )}
                    <div>
                      <p className="text-sm font-bold">Your Gym</p>
                      <p className="text-xs opacity-80">Member Portal</p>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 space-y-3">
                    {/* Button Preview */}
                    <button
                      className="w-full py-2 text-white rounded font-semibold text-sm"
                      style={{ backgroundColor: branding.primaryColor }}
                    >
                      Book Class
                    </button>

                    {/* Secondary Button */}
                    <button
                      className="w-full py-2 text-white rounded font-semibold text-sm"
                      style={{ backgroundColor: branding.secondaryColor }}
                    >
                      View Schedule
                    </button>

                    {/* Card Preview */}
                    <div
                      className="p-3 rounded text-white text-xs"
                      style={{
                        backgroundColor: branding.primaryColor,
                        opacity: 0.8,
                      }}
                    >
                      <p className="font-bold mb-1">Morning Yoga</p>
                      <p>6:00 AM - 7:00 AM</p>
                    </div>
                  </div>
                </div>

                <p className={`text-xs mt-4 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Preview updates in real-time as you change colors
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Custom Domain Section (Enterprise Only) */}
        {planType === 'enterprise' && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8 mb-8`}
          >
            <div className="flex items-center gap-3 mb-6">
              <Link2 size={28} className="text-purple-600" />
              <div>
                <h2 className="text-2xl font-bold">Custom Domain</h2>
                <p className={`text-xs ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Enterprise plan feature
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Domain Setup */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Your Domain</label>
                  <input
                    type="text"
                    value={customDomain.domain}
                    onChange={handleDomainChange}
                    placeholder="members.mygym.com"
                    disabled={customDomain.status === 'verified'}
                    className={`w-full px-4 py-2 rounded-lg border ${
                      isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                    } disabled:opacity-50`}
                  />
                  <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                    Must be a subdomain you own
                  </p>
                </div>

                {/* Status Badge */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">Status:</span>
                  {customDomain.status === 'verified' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold">
                      <CheckCircle size={14} />
                      Verified
                    </span>
                  ) : customDomain.status === 'pending' ? (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-bold">
                      <AlertCircle size={14} />
                      Pending Verification
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-300 text-gray-700 text-xs font-bold">
                      Not Verified
                    </span>
                  )}
                </div>

                {/* SSL Status */}
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold">SSL Certificate:</span>
                  {customDomain.sslStatus === 'provisioned' ? (
                    <span className="text-xs font-bold text-green-600">✓ Auto-provisioned (Let's Encrypt)</span>
                  ) : (
                    <span className="text-xs font-bold text-gray-600">Pending verification</span>
                  )}
                </div>

                {/* Action Button */}
                {customDomain.status !== 'verified' && (
                  <button
                    onClick={handleVerifyDomain}
                    disabled={!customDomain.domain.trim()}
                    className="w-full py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold disabled:opacity-50"
                  >
                    Verify Domain
                  </button>
                )}

                {customDomain.status === 'verified' && (
                  <div className={`p-4 rounded-lg ${isDark ? 'bg-green-900' : 'bg-green-50'}`}>
                    <p className="text-xs font-bold text-green-700 mb-2">✓ Domain Active</p>
                    <p className="text-xs text-green-700">
                      Your member portal is now accessible at https://{customDomain.domain}
                    </p>
                  </div>
                )}
              </div>

              {/* DNS Instructions */}
              <div>
                {customDomain.showDNSInstructions ? (
                  <div className={`p-6 rounded-lg ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <h3 className="font-bold mb-4">DNS Setup Instructions</h3>

                    <div className="space-y-4 text-xs">
                      <div>
                        <p className="font-semibold mb-2">1. Add CNAME Record</p>
                        <p className={`mb-2 ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                          Create a CNAME record in your domain registrar:
                        </p>
                        <div className={`p-3 rounded font-mono ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
                          <p className="mb-2">
                            <strong>Name:</strong> members
                          </p>
                          <p className="mb-2">
                            <strong>Type:</strong> CNAME
                          </p>
                          <p>
                            <strong>Value:</strong> api.crunchfit.com
                            <button
                              onClick={handleCopyCNAME}
                              className="ml-2 text-blue-600 hover:text-blue-700"
                              title="Copy to clipboard"
                            >
                              <Copy size={14} className="inline" />
                            </button>
                          </p>
                        </div>
                        {customDomain.copyFeedback && (
                          <p className="text-green-600 mt-2">✓ Copied!</p>
                        )}
                      </div>

                      <div>
                        <p className="font-semibold mb-2">2. Wait for DNS Propagation</p>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                          DNS changes can take up to 48 hours to propagate.
                        </p>
                      </div>

                      <div>
                        <p className="font-semibold mb-2">3. Click Verify Domain</p>
                        <p className={`${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                          Once DNS is updated, we'll verify and provision SSL.
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className={`p-6 rounded-lg text-center ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                    <Link2 size={32} className="mx-auto mb-3 text-gray-500" />
                    <p className={`text-sm ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      DNS setup instructions will appear after you enter your domain
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {/* Custom Email Sender Section */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-lg border p-8`}
        >
          <div className="flex items-center gap-3 mb-6">
            <Mail size={28} className="text-orange-600" />
            <h2 className="text-2xl font-bold">Custom Email Sender</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Email Setup */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2">Email Domain</label>
                <input
                  type="text"
                  value={emailSender.domain}
                  onChange={handleEmailDomainChange}
                  placeholder="noreply@mygym.com"
                  disabled={emailSender.spfVerified}
                  className={`w-full px-4 py-2 rounded-lg border ${
                    isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-300'
                  } disabled:opacity-50`}
                />
                <p className={`text-xs mt-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                  Transactional emails will be sent from this address
                </p>
              </div>

              {!emailSender.hasSetupStarted ? (
                <button
                  onClick={handleStartEmailSetup}
                  disabled={!emailSender.domain.trim()}
                  className="w-full py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-semibold disabled:opacity-50"
                >
                  Start Email Setup
                </button>
              ) : (
                <div className="space-y-3">
                  {/* SPF */}
                  <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">SPF Record</span>
                      {emailSender.spfVerified ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <AlertCircle size={18} className="text-yellow-600" />
                      )}
                    </div>
                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Add to your DNS: v=spf1 include:sendgrid.net ~all
                    </p>
                    {!emailSender.spfVerified && (
                      <button
                        onClick={() => handleVerifyDNS('spf')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Verify SPF
                      </button>
                    )}
                  </div>

                  {/* DKIM */}
                  <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">DKIM Record</span>
                      {emailSender.dkimVerified ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <AlertCircle size={18} className="text-yellow-600" />
                      )}
                    </div>
                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Add DKIM record from SendGrid dashboard
                    </p>
                    {!emailSender.dkimVerified && (
                      <button
                        onClick={() => handleVerifyDNS('dkim')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Verify DKIM
                      </button>
                    )}
                  </div>

                  {/* DMARC */}
                  <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-700 bg-gray-700' : 'border-gray-300 bg-gray-50'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">DMARC Record (Optional)</span>
                      {emailSender.dmarcVerified ? (
                        <CheckCircle size={18} className="text-green-600" />
                      ) : (
                        <AlertCircle size={18} className="text-gray-600" />
                      )}
                    </div>
                    <p className={`text-xs mb-2 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>
                      Recommended for email deliverability
                    </p>
                    {!emailSender.dmarcVerified && (
                      <button
                        onClick={() => handleVerifyDNS('dmarc')}
                        className="text-xs bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-700"
                      >
                        Verify DMARC
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Email Preview */}
            <div>
              <label className="block text-sm font-semibold mb-3">Email Preview</label>
              <div className={`rounded-lg overflow-hidden border ${isDark ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'}`}>
                <div className={`p-4 ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                  <p className="text-xs font-bold">FROM:</p>
                  <p className="text-sm font-mono">{emailSender.domain || 'noreply@mygym.com'}</p>
                </div>
                <div className="p-4 space-y-3">
                  <div>
                    <p className="text-xs font-bold mb-1">SUBJECT:</p>
                    <p className="text-sm">Welcome to Your Gym - Class Reminder</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold mb-1">PREVIEW:</p>
                    <p className={`text-xs leading-relaxed ${isDark ? 'text-gray-400' : 'text-gray-700'}`}>
                      Hi John, your class "Morning Yoga" starts in 1 hour. See you soon!
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default BrandingPage;
