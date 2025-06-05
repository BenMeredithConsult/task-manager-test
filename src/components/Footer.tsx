import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="text-center text-gray-700">
      <p>Copyright ⓒ {year} Bintou Ongoiba</p>
    </footer>
  );
}

export default Footer;
