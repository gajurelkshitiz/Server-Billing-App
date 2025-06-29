// Checkbox.tsx
import React from 'react';

interface CheckboxProps {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const Checkbox: React.FC<CheckboxProps> = ({ label, checked, onChange }) => {
  const styles: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    cursor: 'pointer', // Indicate it's clickable
  };

  const inputStyles: React.CSSProperties = {
    marginTop: '5px',
    width: '18px',
    height: '18px',
    cursor: 'pointer',
  };

  return (
    <div style={styles} onClick={() => onChange(!checked)}> {/* Allows clicking the whole div */}
      <span>{label}</span>
      <input
        type="checkbox"
        style={inputStyles}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)} // Explicitly handle input change
        // We also have the onClick on the parent div, so this onChange will still fire.
        // It's good practice to have both for accessibility and flexibility.
      />
    </div>
  );
};

export default Checkbox;