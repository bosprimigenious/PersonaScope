import { useState } from 'react';
import './ToggleSwitch.css';

export default function ToggleSwitch({ checked, onChange, disabled = false }) {
  const [isAnimating, setIsAnimating] = useState(false);

  const handleChange = (e) => {
    if (disabled) return;
    setIsAnimating(true);
    onChange(e);
    setTimeout(() => setIsAnimating(false), 300);
  };

  return (
    <label className={`toggle-switch ${checked ? 'checked' : ''} ${disabled ? 'disabled' : ''}`}>
      <input
        type="checkbox"
        checked={checked}
        onChange={handleChange}
        disabled={disabled}
      />
      <span className={`toggle-slider ${isAnimating ? 'animating' : ''}`}>
        <span className="toggle-thumb" />
      </span>
    </label>
  );
}

