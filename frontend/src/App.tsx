import { useState } from 'react';
import { CartView} from './features/checkout/components/CartView.tsx';
import type {Endereco, CartItem } from './features/checkout/components/CartView.tsx';
import { InfinitePayView } from './features/checkout/components/InfinitePayView.tsx';
import { SuccessView } from './features/checkout/components/SuccessView.tsx';

type AppState = 'cart' | 'infinitepay' | 'success';

function App() {
    const [currentState, setCurrentState] = useState<AppState>('cart');
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [orderAddress, setOrderAddress] = useState<Endereco | null>(null);
    const [orderItems, setOrderItems] = useState<CartItem[]>([]);

    const handleProceedToCheckout = (total: number, endereco: Endereco, items: CartItem[]) => {
        setOrderTotal(total);
        setOrderAddress(endereco);
        setOrderItems(items);
        setCurrentState('infinitepay'); 
    };

    const handlePaymentSuccess = () => {
        setCurrentState('success');
    };

    return (
        <div style={{ padding: '20px', minHeight: '100vh', backgroundColor: '#f0f2f5' }}>
            {currentState === 'cart' && (
                <CartView onProceedToCheckout={handleProceedToCheckout} />
            )}
            
            {currentState === 'infinitepay' && orderAddress && (
                <InfinitePayView 
                    total={orderTotal} 
                    endereco={orderAddress}
                    items={orderItems}
                    onPaymentSuccess={handlePaymentSuccess} 
                />
            )}

            {currentState === 'success' && (
                <SuccessView />
            )}
        </div>
    );
}

export default App;