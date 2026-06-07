import React, { useState } from 'react';
import styles from './CheckoutView.module.css';
import type { Endereco, CartItem } from './CartView';

interface InfinitePayViewProps {
    total: number;
    endereco: Endereco;
    items: CartItem[];
    onPaymentSuccess: () => void;
}

export const InfinitePayView: React.FC<InfinitePayViewProps> = ({ total, endereco, items, onPaymentSuccess }) => {
    const [selectedMethod, setSelectedMethod] = useState<'pix' | 'debito' | 'credito' | null>(null);
    const [installments, setInstallments] = useState<number>(1);
    const [isProcessing, setIsProcessing] = useState(false);
    const [showPixModal, setShowPixModal] = useState(false);

    // Mock das taxas (exemplo simplificado de repasse)
    const fees = {
        pix: 0,
        debito: 0.0199, // 1.99%
        credito: 0.0499 // 4.99% base para crédito
    };

    const calculateTotalWithFee = (method: 'pix' | 'debito' | 'credito', inst = 1) => {
        let fee = fees[method];
        if (method === 'credito' && inst > 1) {
             // Simulação de acréscimo de juros por parcela no crédito
             fee += (inst * 0.015); 
        }
        return total * (1 + fee);
    };

    const handlePayment = () => {
        setIsProcessing(true);

        if (selectedMethod === 'pix') {
            // Mostra o Modal de PIX
            setIsProcessing(false);
            setShowPixModal(true);
            
            // Simula o pagamento sendo reconhecido pelo Webhook/Consulta de Status em 5 segundos
            setTimeout(() => {
                setShowPixModal(false);
                onPaymentSuccess();
            }, 5000);
            
        } else {
            // Cartão de Crédito / Débito processa e finaliza rápido
            setTimeout(() => {
                setIsProcessing(false);
                onPaymentSuccess();
            }, 2000);
        }
    };

    return (
        <>
            <main className={styles.container} style={{ maxWidth: '900px', display: 'flex', gap: '32px', padding: '24px', position: 'relative' }}>
                
                {/* Lado Esquerdo: Opções de Pagamento */}
                <div style={{ flex: 1 }}>
                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <h1 className={styles.title} style={{ margin: 0 }}>Pagamento Seguro</h1>
                        <p style={{ color: '#666', marginTop: '8px' }}>Ambiente InfinitePay Mock</p>
                    </div>

                    <div style={{ marginBottom: '24px' }}>
                        <h3 style={{ fontSize: '16px', marginBottom: '16px' }}>Escolha a forma de pagamento:</h3>
                        
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {(['pix', 'debito', 'credito'] as const).map(method => {
                                const isSelected = selectedMethod === method;
                                return (
                                    <div key={method} style={{ 
                                        border: `2px solid ${isSelected ? '#70CAFF' : '#e0e0e0'}`,
                                        borderRadius: '8px',
                                        backgroundColor: isSelected ? '#f0fdf4' : 'white',
                                        overflow: 'hidden'
                                    }}>
                                        <label style={{ 
                                            display: 'flex', 
                                            alignItems: 'center', 
                                            padding: '16px', 
                                            cursor: 'pointer'
                                        }}>
                                            <input 
                                                type="radio" 
                                                name="paymentMethod" 
                                                value={method} 
                                                checked={isSelected} 
                                                onChange={() => {
                                                    setSelectedMethod(method);
                                                    setInstallments(1);
                                                }} 
                                                style={{ marginRight: '16px' }}
                                            />
                                            <div style={{ flex: 1 }}>
                                                <div style={{ fontWeight: 'bold', textTransform: 'capitalize' }}>
                                                    {method === 'pix' ? 'PIX' : `Cartão de ${method}`}
                                                </div>
                                                <div style={{ fontSize: '14px', color: '#666' }}>
                                                    {method === 'pix' ? 'Sem juros' : `Taxas a partir de ${(fees[method] * 100).toFixed(2)}%`}
                                                </div>
                                            </div>
                                            <div style={{ fontWeight: 'bold' }}>
                                                R$ {calculateTotalWithFee(method, 1).toFixed(2)}
                                            </div>
                                        </label>

                                        {/* Campos de simulação de cartão se selecionado débito ou crédito */}
                                        {isSelected && method !== 'pix' && (
                                            <div style={{ padding: '0 16px 16px 16px', borderTop: '1px solid #e0e0e0', marginTop: '8px', paddingTop: '16px' }}>
                                                <input type="text" placeholder="Número do Cartão" style={{ width: '100%', padding: '8px', marginBottom: '8px', borderRadius: '4px', border: '1px solid #ccc', boxSizing: 'border-box' }} readOnly />
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <input type="text" placeholder="Validade" style={{ flex: 1, padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} readOnly />
                                                    <input type="text" placeholder="CVV" style={{ width: '80px', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }} readOnly />
                                                </div>
                                                
                                                {/* Select de Parcelas para Crédito */}
                                                {method === 'credito' && (
                                                    <div style={{ marginTop: '16px' }}>
                                                        <label htmlFor="installmentsSelect" style={{ display: 'block', fontSize: '14px', marginBottom: '4px', color: '#555' }}>Parcelamento:</label>
                                                        <select 
                                                            id="installmentsSelect"
                                                            value={installments} 
                                                            onChange={(e) => setInstallments(Number(e.target.value))}
                                                            style={{ width: '100%', padding: '8px', borderRadius: '4px', border: '1px solid #ccc' }}
                                                        >
                                                            {new Array(12).fill(null).map((_, i) => {
                                                                const inst = i + 1;
                                                                const instTotal = calculateTotalWithFee('credito', inst);
                                                                const instValue = instTotal / inst;
                                                                return (
                                                                    <option key={inst} value={inst}>
                                                                        {inst}x de R$ {instValue.toFixed(2)} (Total: R$ {instTotal.toFixed(2)})
                                                                    </option>
                                                                );
                                                            })}
                                                        </select>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    <button 
                        className={styles.button} 
                        onClick={handlePayment} 
                        disabled={!selectedMethod || isProcessing}
                        style={{ backgroundColor: selectedMethod ? '#70CAFF' : '#e0e0e0', color: selectedMethod ? 'white' : '#9e9e9e' }}
                    >
                        {isProcessing 
                            ? 'Processando transação...' 
                            : `Gerar ${selectedMethod === 'pix' ? 'QR Code PIX' : 'Pagamento'} R$ ${selectedMethod ? calculateTotalWithFee(selectedMethod, installments).toFixed(2) : '0.00'}`}
                    </button>
                </div>

                {/* Lado Direito: Dados da Compra (Painel Limpo) */}
                <div style={{ flex: 1, backgroundColor: '#f9fafb', borderRadius: '12px', padding: '24px', border: '1px solid #e5e7eb' }}>
                    <h3 style={{ fontSize: '18px', borderBottom: '2px solid #e5e7eb', paddingBottom: '12px', marginBottom: '20px', color: '#111827' }}>
                        Resumo do Pedido (Dados Enviados)
                    </h3>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conta Destino</h4>
                        <p style={{ margin: 0, fontWeight: '500', color: '#111827' }}>@mercadoflex-demo</p>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Itens</h4>
                        <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {items.map(item => (
                                <li key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#374151' }}>
                                    <span>{item.quantidade}x {item.nome}</span>
                                    <span style={{ fontWeight: '500' }}>{(item.preco * 100)}¢ (R$ {item.preco.toFixed(2)})</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Cliente (Mock)</h4>
                        <div style={{ fontSize: '14px', color: '#374151' }}>
                            <p style={{ margin: '0 0 4px 0' }}><strong>Nome:</strong> João Silva</p>
                            <p style={{ margin: '0 0 4px 0' }}><strong>E-mail:</strong> joao@email.com</p>
                            <p style={{ margin: '0 0 4px 0' }}><strong>Telefone:</strong> +5511999887766</p>
                        </div>
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '14px', color: '#6b7280', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Endereço de Entrega</h4>
                        <div style={{ fontSize: '14px', color: '#374151', backgroundColor: '#ffffff', padding: '12px', borderRadius: '6px', border: '1px solid #e5e7eb' }}>
                            <p style={{ margin: '0 0 4px 0' }}>{endereco.rua}</p>
                            <p style={{ margin: '0 0 4px 0' }}>{endereco.cidade} - {endereco.estado}</p>
                            <p style={{ margin: 0 }}>CEP: {endereco.cep}</p>
                        </div>
                    </div>

                    <div style={{ backgroundColor: '#eff6ff', padding: '12px', borderRadius: '6px', border: '1px solid #bfdbfe' }}>
                         <h4 style={{ fontSize: '12px', color: '#1e40af', margin: '0 0 8px 0', textTransform: 'uppercase' }}>Configurações de API</h4>
                         <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#1e3a8a' }}><strong>Order NSU:</strong> Gerado aleatoriamente</p>
                         <p style={{ margin: '0 0 4px 0', fontSize: '12px', color: '#1e3a8a' }}><strong>Redirect URL:</strong> /pagamento-concluido</p>
                         <p style={{ margin: 0, fontSize: '12px', color: '#1e3a8a' }}><strong>Webhook:</strong> /webhook/infinitepay</p>
                    </div>
                </div>
            </main>

            {/* Modal do PIX */}
            {showPixModal && (
                <div style={{
                    position: 'fixed',
                    top: 0, left: 0, right: 0, bottom: 0,
                    backgroundColor: 'rgba(0, 0, 0, 0.75)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: '32px',
                        borderRadius: '12px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
                    }}>
                        <h2 style={{ margin: '0 0 8px 0', color: '#111827' }}>Pague com PIX</h2>
                        <p style={{ margin: '0 0 24px 0', color: '#6b7280', fontSize: '14px' }}>
                            Aguardando confirmação do pagamento...
                        </p>

                        {/* QR Code Simulado (SVG) */}
                        <div style={{ 
                            border: '1px solid #e5e7eb', 
                            padding: '16px', 
                            borderRadius: '8px',
                            display: 'inline-block',
                            marginBottom: '24px',
                            backgroundColor: '#f9fafb'
                        }}>
                            <svg width="200" height="200" viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
                                <rect width="200" height="200" fill="white"/>
                                <path d="M20,20 h40 v40 h-40 z M140,20 h40 v40 h-40 z M20,140 h40 v40 h-40 z" fill="black"/>
                                <path d="M30,30 h20 v20 h-20 z M150,30 h20 v20 h-20 z M30,150 h20 v20 h-20 z" fill="white"/>
                                <path d="M80,20 h40 v20 h-40 z M20,80 h20 v40 h-20 z M160,80 h20 v40 h-20 z M80,160 h40 v20 h-40 z" fill="black"/>
                                <path d="M100,60 h40 v40 h-40 z M60,100 h40 v40 h-40 z" fill="black"/>
                                <rect x="20" y="20" width="160" height="160" fill="none" stroke="black" strokeWidth="4"/>
                            </svg>
                        </div>

                        <h4 style={{ fontSize: '14px', margin: '0 0 8px 0', color: '#374151' }}>Código PIX Copia e Cola:</h4>
                        <div style={{
                            backgroundColor: '#f3f4f6',
                            padding: '12px',
                            borderRadius: '6px',
                            wordBreak: 'break-all',
                            fontSize: '12px',
                            color: '#4b5563',
                            fontFamily: 'monospace',
                            border: '1px solid #d1d5db',
                            userSelect: 'all'
                        }}>
                            00020101021126580014br.gov.bcb.pix0136{Math.random().toString(36).substring(2)}5204000053039995405{Math.round(total * 100)}5802BR5913MERCADOFLEX6009SAO PAULO62070503***6304E8A3
                        </div>

                        <div style={{ 
                            marginTop: '24px', 
                            display: 'flex', 
                            alignItems: 'center', 
                            justifyContent: 'center', 
                            gap: '8px',
                            color: '#70CAFF',
                            fontWeight: '500'
                        }}>
                            <div className={styles.spinner} style={{
                                width: '16px', height: '16px', border: '2px solid #70CAFF',
                                borderTopColor: 'transparent', borderRadius: '50%',
                                animation: 'spin 1s linear infinite'
                            }} />
                            <style>
                                {`@keyframes spin { 100% { transform: rotate(360deg); } }`}
                            </style>
                            Simulando recebimento do Webhook...
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};