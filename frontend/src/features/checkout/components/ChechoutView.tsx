// src/features/checkout/components/CheckoutView.tsx
import React from 'react';
import { useCheckout } from '../hooks/useCheckout.ts';
import styles from './CheckoutView.module.css';

interface CheckoutViewProps {
    clienteId: number;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({ clienteId }) => {
    const { isLoading, error, successData, executeCheckout, copyPixToClipboard } = useCheckout(clienteId);

    // Renderização do Estado de Sucesso (Exibição do PIX)
    if (successData) {
        return (
            <main className={styles.container}>
                <h1 className={styles.title}>Pedido Gerado!</h1>
                <p style={{ textAlign: 'center', color: '#666' }}>
                    Escaneie o QR Code abaixo com o aplicativo do seu banco para pagar R$ {successData.valorTotal.toFixed(2)}.
                </p>

                <div className={styles.pixContainer}>
                    {/* Renderiza a string Base64 retornada pela InfinitePay */}
                    <img
                        src={`data:image/png;base64,${successData.pagamento.qrCodeBase64}`}
                        alt="QR Code PIX"
                        className={styles.qrCode}
                    />
                    <button onClick={copyPixToClipboard} className={styles.copyButton}>
                        Copiar código PIX (Copia e Cola)
                    </button>
                </div>
            </main>
        );
    }

    // Renderização do Estado de Checkout (Pré-compra)
    return (
        <main className={styles.container}>
            <h1 className={styles.title}>Finalizar Compra</h1>

            {error && (
                <div className={styles.errorBox} role="alert">
                    <strong>Atenção:</strong> {error}
                </div>
            )}

            <button
                className={styles.button}
                onClick={executeCheckout}
                disabled={isLoading}
            >
                {isLoading ? 'Processando transação segura...' : 'Gerar Pagamento PIX'}
            </button>
        </main>
    );
};