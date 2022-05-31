import React from 'react';
import "../Styles/App.css";

export default function Footer() {
  return (
    <footer className="text-center text-white footer">
      <div className="text-center p-3" style={{ backgroundColor: "darkBlue", fontSize: "20px" }}>
        <p>Timezone Tracking App</p>
      </div>
    </footer>
  );
}