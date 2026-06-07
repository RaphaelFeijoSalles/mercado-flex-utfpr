import React, { useState, useEffect } from 'react';
import styles from './CheckoutView.module.css';

export interface CartItem {
    id: number;
    nome: string;
    preco: number;
    quantidade: number;
    imagem: string;
}

export interface Endereco {
    id: number;
    rua: string;
    cidade: string;
    estado: string;
    cep: string;
}

const enderecosFixos: Endereco[] = [
    { id: 1, rua: 'Rua das Flores, 123', cidade: 'São Paulo', estado: 'SP', cep: '01000-000' },
    { id: 2, rua: 'Avenida Paulista, 456', cidade: 'São Paulo', estado: 'SP', cep: '01310-100' },
    { id: 3, rua: 'Rua do Ouvidor, 789', cidade: 'Rio de Janeiro', estado: 'RJ', cep: '20040-030' },
];

export const CartView: React.FC<{ onProceedToCheckout: (total: number, endereco: Endereco, items: CartItem[]) => void }> = ({ onProceedToCheckout }) => {
    const [cartItems, setCartItems] = useState<CartItem[]>([
        {
            id: 1,
            nome: 'Smartphone de Última Geração',
            preco: 3500.00,
            quantidade: 2, // 2 por padrão para mostrar relação qtd * preco
            imagem: '📱'
        },
        {
            id: 2,
            nome: 'Smart TV 4K 55"',
            preco: 2800.00,
            quantidade: 1,
            imagem: '📺'
        }
    ]);
    const [selectedEndereco, setSelectedEndereco] = useState<Endereco>(enderecosFixos[0]);
    const [frete, setFrete] = useState<number>(0);
    const [isChangingEndereco, setIsChangingEndereco] = useState(false);

    useEffect(() => {
        // Mock da chamada da API de frete
        const calcularFreteMock = () => {
            // Lógica mockada: R$ 50 para SP, R$ 80 para RJ
            if (selectedEndereco.estado === 'SP') {
                setFrete(50.00);
            } else {
                setFrete(80.00);
            }
        };
        calcularFreteMock();
    }, [selectedEndereco]);

    const updateQuantity = (id: number, delta: number) => {
        setCartItems(prev => prev.map(item => {
            if (item.id === id) {
                const newQuantity = item.quantidade + delta;
                return { ...item, quantidade: newQuantity > 0 ? newQuantity : 1 }; // Evita quantidade 0
            }
            return item;
        }));
    };

    const removeItem = (id: number) => {
        setCartItems(prev => prev.filter(item => item.id !== id));
    };

    const subtotal = cartItems.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    const total = subtotal + frete;

    if (isChangingEndereco) {
        return (
            <main className={styles.container}>
                <h1 className={styles.title}>Selecione o Endereço</h1>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {enderecosFixos.map(endereco => (
                        <div key={endereco.id} style={{ border: `2px solid ${selectedEndereco.id === endereco.id ? '#70CAFF' : '#e0e0e0'}`, padding: '16px', borderRadius: '8px', cursor: 'pointer', backgroundColor: selectedEndereco.id === endereco.id ? '#f0fdf4' : 'white' }} onClick={() => { setSelectedEndereco(endereco); setIsChangingEndereco(false); }}>
                            <p style={{ margin: '0 0 8px 0' }}><strong>{endereco.rua}</strong></p>
                            <p style={{ margin: 0, color: '#666' }}>{endereco.cidade} - {endereco.estado}, CEP: {endereco.cep}</p>
                        </div>
                    ))}
                </div>
                <button className={styles.button} style={{ marginTop: '24px', backgroundColor: '#666' }} onClick={() => setIsChangingEndereco(false)}>
                    Voltar
                </button>
            </main>
        );
    }

    return (
        <main className={styles.container} style={{ maxWidth: '600px' }}>
            <h1 className={styles.title}>Meu Carrinho</h1>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '24px' }}>
                {cartItems.length === 0 ? (
                    <p style={{ textAlign: 'center', color: '#666' }}>Seu carrinho está vazio.</p>
                ) : cartItems.map(item => (
                    <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #eee', paddingBottom: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <span style={{ fontSize: '40px' }}>{item.imagem}</span>
                            <div>
                                <h3 style={{ margin: '0 0 4px 0', fontSize: '16px' }}>{item.nome}</h3>
                                <p style={{ margin: 0, fontSize: '14px', color: '#666' }}>R$ {item.preco.toFixed(2)} unitário</p>
                                <p style={{ margin: '4px 0 0 0', fontWeight: 'bold' }}>Total: R$ {(item.preco * item.quantidade).toFixed(2)}</p>
                            </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', border: '1px solid #ddd', borderRadius: '4px' }}>
                                <button style={{padding: '8px 12px', border: 'none', background: '#70CAFF', cursor: 'pointer', fontSize: '16px' }} onClick={() => updateQuantity(item.id, -1)}>-</button>
                                <span style={{ padding: '0 8px', fontWeight: 'bold' }}>{item.quantidade}</span>
                                <button style={{ padding: '8px 12px', border: 'none', background: '#70CAFF', cursor: 'pointer', fontSize: '16px' }} onClick={() => updateQuantity(item.id, 1)}>+</button>
                            </div>
                            <button style={{ padding: '8px 12px', background: '#ffebee', color: '#c62828', border: 'none', borderRadius: '4px', cursor: 'pointer' }} onClick={() => removeItem(item.id)}>
                                🗑️
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            <div style={{ backgroundColor: '#f9f9f9', padding: '16px', borderRadius: '8px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <p style={{ margin: 0 }}><strong>Endereço de Entrega:</strong></p>
                    <button style={{ background: 'none', border: 'none', color: '#70CAFF', cursor: 'pointer', textDecoration: 'underline', fontWeight: 'bold' }} onClick={() => setIsChangingEndereco(true)}>
                        Mudar
                    </button>
                </div>
                <p style={{ margin: 0, fontSize: '14px', color: '#555' }}>
                    {selectedEndereco.rua}, {selectedEndereco.cidade} - {selectedEndereco.estado}
                </p>
            </div>

            <div style={{ borderTop: '2px solid #eee', paddingTop: '16px', marginBottom: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span>Subtotal:</span>
                    <span>R$ {subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                    <span>Frete:</span>
                    <span>R$ {frete.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', fontSize: '20px', color: '#00A1FF' }}>
                    <span>Total:</span>
                    <span>R$ {total.toFixed(2)}</span>
                </div>
            </div>

            <button className={styles.button} onClick={() => onProceedToCheckout(total, selectedEndereco, cartItems)} disabled={cartItems.length === 0}>
                Continuar para Pagamento Seguro
            </button>
        </main>
    );
};