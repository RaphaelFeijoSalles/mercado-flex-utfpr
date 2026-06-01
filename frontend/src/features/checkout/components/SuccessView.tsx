import React from 'react';

export const SuccessView: React.FC = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            backgroundColor: '#f5f5f5',
            fontFamily: 'system-ui, -apple-system, sans-serif'
        }}>
            <h1 style={{ fontSize: '48px', color: '#00c853', margin: '0 0 16px 0' }}>Obrigado!</h1>
            <p style={{ fontSize: '18px', color: '#666' }}>Seu pagamento foi aprovado com sucesso.</p>
        </div>
    );
};