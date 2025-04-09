import React, { useState, useRef, useEffect } from 'react';
import './OTPInput.css';

const OTPInput = () => {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [timer, setTimer] = useState(30);
  const inputRefs = useRef([]);

  useEffect(() => {
    const countdown = timer > 0 && setInterval(() => setTimer(t => t - 1), 1000);
    return () => clearInterval(countdown);
  }, [timer]);

  const handleChange = (e, i) => {
    const val = e.target.value;
    
    // Only allow single digit numbers
    if (!/^[0-9]?$/.test(val)) return;
    
    const newOtp = [...otp];
    
    // If value is empty, just update the current box
    if (!val) {
      newOtp[i] = '';
      setOtp(newOtp);
      return;
    }
    
    // If value is a number, update current box and move to next
    newOtp[i] = val;
    setOtp(newOtp);
    
    // Move to next input if not the last one
    if (i < 5) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handleKeyDown = (e, i) => {
    if (e.key === 'Backspace') {
      if (otp[i]) {
        // If current box has a value, clear it
        const newOtp = [...otp];
        newOtp[i] = '';
        setOtp(newOtp);
      } else if (i > 0) {
        // If current box is empty, move to previous box
        inputRefs.current[i - 1].focus();
      }
    }
    
    // Handle arrow keys for navigation
    if (e.key === 'ArrowLeft' && i > 0) {
      inputRefs.current[i - 1].focus();
    }
    if (e.key === 'ArrowRight' && i < 5) {
      inputRefs.current[i + 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData('text').slice(0, 6).split('');
    if (pasteData.every(d => /^\d$/.test(d))) {
      setOtp(pasteData);
      inputRefs.current[5].focus();
    }
    e.preventDefault();
  };

  const handleSubmit = () => {
    const enteredOtp = otp.join('');
    if (enteredOtp.length !== 6 || !/^\d{6}$/.test(enteredOtp)) {
      setError('Please enter a valid 6-digit OTP');
      setSuccess('');
    } else {
      setSuccess('OTP Verified Successfully!');
      setError('');
    }
  };

  const handleResend = () => {
    setOtp(Array(6).fill(''));
    setTimer(30);
    setError('');
    setSuccess('');
    inputRefs.current[0].focus();
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(otp.join(''));
  };

  return (
    <div className="otp-container">
      <h2 className="otp-title">Enter OTP</h2>
      <div className="otp-inputs">
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => inputRefs.current[i] = el}
            type="text"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(e, i)}
            onKeyDown={(e) => handleKeyDown(e, i)}
            onPaste={handlePaste}
            className="otp-input"
            inputMode="numeric"
            pattern="[0-9]*"
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {error && <p className="otp-message error">{error}</p>}
      {success && <p className="otp-message success">{success}</p>}

      <button onClick={handleSubmit} className="otp-button">Submit OTP</button>

      <div className="otp-actions">
        <button onClick={handleResend} disabled={timer > 0} className="resend-btn">
          {timer > 0 ? `Resend in ${timer}s` : 'Resend OTP'}
        </button>
        <button onClick={handleCopy} className="copy-btn">Copy OTP</button>
      </div>
    </div>
  );
};

export default OTPInput;
