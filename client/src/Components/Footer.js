const Footer = () => {
  return (
    <footer className="footer" style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#f8f9fa',
      padding: '1rem',
      textAlign: 'center',
      zIndex: 1000
    }}>
      <div className="text-2xl font-bold text-center">
        A Web Application to Help Uneducated People to Review Lessons|©2025|carrent|All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;