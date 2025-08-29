import React from 'react';

const DashboardNotAvailable = () => {
  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#FEFAF0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '48px',
        borderRadius: '16px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        textAlign: 'center',
        maxWidth: '500px',
        width: '100%'
      }}>
        <div style={{
          width: '64px',
          height: '64px',
          backgroundColor: '#FEF3C7',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '32px'
        }}>
          ⚠️
        </div>
        
        <h1 style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '24px',
          fontWeight: '600',
          color: '#1F2937',
          marginBottom: '16px',
          lineHeight: '1.2'
        }}>
          Dashboard Not Available
        </h1>
        
        <p style={{
          fontFamily: 'Outfit, sans-serif',
          fontSize: '16px',
          color: '#6B7280',
          lineHeight: '1.5',
          marginBottom: '32px'
        }}>
          This version does not have Dashboard functionality. 
          Please visit the Dashboard version to access workspace management features.
        </p>
        
        <a 
          href="https://reearth-marketplace-v2.netlify.app"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            display: 'inline-block',
            backgroundColor: '#00A2EA',
            color: 'white',
            textDecoration: 'none',
            padding: '12px 24px',
            borderRadius: '8px',
            fontFamily: 'Outfit, sans-serif',
            fontSize: '16px',
            fontWeight: '500',
            transition: 'background-color 0.2s ease',
            cursor: 'pointer'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#0082BB'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#00A2EA'}
        >
          Go to Dashboard Version →
        </a>
        
        <div style={{
          marginTop: '24px',
          paddingTop: '24px',
          borderTop: '1px solid #E5E7EB'
        }}>
          <p style={{
            fontFamily: 'Outfit, sans-serif',
            fontSize: '14px',
            color: '#9CA3AF',
            lineHeight: '1.4'
          }}>
            Current version includes: <strong>Marketplace + Developer Console</strong><br/>
            For Dashboard features, use: <strong>Marketplace + Dashboard version</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default DashboardNotAvailable;