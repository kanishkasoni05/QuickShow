import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Payment = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [method, setMethod] = useState('');
  const [formData, setFormData] = useState({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [otpStep, setOtpStep] = useState(false);

  const handleInput = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validateAndPay = () => {
    if (!method) return toast.error("Please select a payment method");

    // Validation
    if (method === 'UPI' && !formData.upiId) {
      return toast.error("Enter your UPI ID");
    }
    if (method === 'CreditCard') {
      const cardRegex = /^\d{16}$/;
      if (!cardRegex.test(formData.cardNumber || '')) {
        return toast.error("Enter a valid 16-digit card number");
      }
      if (!formData.expiry || !/^(0[1-9]|1[0-2])\/\d{2}$/.test(formData.expiry)) {
        return toast.error("Enter a valid expiry date (MM/YY)");
      }
      if (!/^\d{3}$/.test(formData.cvv || '')) {
        return toast.error("Enter a valid 3-digit CVV");
      }
    }
    if (method === 'Paytm') {
      if (!/^\d{10}$/.test(formData.mobile || '')) {
        return toast.error("Enter a valid 10-digit mobile number");
      }
      // Simulate OTP send
      setOtpStep(true);
      return;
    }

    processPayment();
  };

  const processPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      toast.success("Payment Successful!");
      navigate("/confirmation", { state });
    }, 2000);
  };

  const verifyOtp = () => {
    if (formData.otp === '1234') {
      processPayment();
    } else {
      toast.error("Invalid OTP. Try 1234 for demo.");
    }
  };

  return (
    <div className="p-8 max-w-xl mx-auto mt-20 bg-gray-800 rounded-xl shadow-lg text-white">
      <h2 className="text-2xl font-bold mb-6">Confirm Your Payment</h2>

      {/* Payment method selection */}
      {!otpStep && (
        <div className="space-y-4 mb-6">
          {['UPI', 'CreditCard', 'Paytm'].map((m) => (
            <label key={m} className="flex items-center gap-3 cursor-pointer">
              <input
                type="radio"
                value={m}
                checked={method === m}
                onChange={() => { setMethod(m); setFormData({}); setOtpStep(false); }}
              />
              <span>{m === 'CreditCard' ? 'Credit / Debit Card' : m}</span>
            </label>
          ))}
        </div>
      )}

      {/* Conditional forms */}
      {!otpStep && method === 'UPI' && (
        <div className="space-y-2">
          <p className="text-sm text-gray-400">Scan & Pay</p>
          <img src="https://i.ibb.co/Qv4BtPCV/scanner.png" alt="UPI QR" className="w-40 mb-3" />
          <label className="block">Enter your UPI ID</label>
          <input
            type="text"
            name="upiId"
            placeholder="yourname@upi"
            className="w-full p-2 rounded bg-gray-700"
            value={formData.upiId || ''}
            onChange={handleInput}
          />
        </div>
      )}

      {!otpStep && method === 'CreditCard' && (
        <div className="space-y-2">
          <label className="block">Card Number</label>
          <input
            type="text"
            name="cardNumber"
            maxLength={16}
            placeholder="1234 5678 9012 3456"
            className="w-full p-2 rounded bg-gray-700"
            value={formData.cardNumber || ''}
            onChange={handleInput}
          />
          <div className="flex gap-4">
            <div className="flex-1">
              <label>Expiry</label>
              <input
                type="text"
                name="expiry"
                placeholder="MM/YY"
                maxLength={5}
                className="w-full p-2 rounded bg-gray-700"
                value={formData.expiry || ''}
                onChange={handleInput}
              />
            </div>
            <div className="flex-1">
              <label>CVV</label>
              <input
                type="password"
                name="cvv"
                maxLength={3}
                placeholder="123"
                className="w-full p-2 rounded bg-gray-700"
                value={formData.cvv || ''}
                onChange={handleInput}
              />
            </div>
          </div>
        </div>
      )}

      {!otpStep && method === 'Paytm' && (
        <div className="space-y-2">
          <label className="block">Mobile Number</label>
          <input
            type="text"
            name="mobile"
            maxLength={10}
            placeholder="9876543210"
            className="w-full p-2 rounded bg-gray-700"
            value={formData.mobile || ''}
            onChange={handleInput}
          />
          <p className="text-xs text-gray-400">You will receive an OTP on this number</p>
        </div>
      )}

      {/* OTP Step for Paytm */}
      {otpStep && (
        <div className="space-y-2">
          <label className="block">Enter OTP</label>
          <input
            type="text"
            name="otp"
            maxLength={4}
            placeholder="1234"
            className="w-full p-2 rounded bg-gray-700"
            value={formData.otp || ''}
            onChange={handleInput}
          />
          <p className="text-xs text-gray-400">Demo OTP: 1234</p>
        </div>
      )}

      {/* Buttons */}
      {isProcessing ? (
        <div className="mt-6 flex items-center justify-center">
          <div className="w-8 h-8 border-4 border-t-transparent border-primary rounded-full animate-spin"></div>
          <span className="ml-3">Processing Payment...</span>
        </div>
      ) : (
        <button
          onClick={otpStep ? verifyOtp : validateAndPay}
          className="mt-6 w-full bg-primary hover:bg-primary-dull text-white py-3 rounded-md transition-all"
        >
          {otpStep ? 'Verify OTP & Pay' : 'Pay Now'}
        </button>
      )}
    </div>
  );
};

export default Payment;
