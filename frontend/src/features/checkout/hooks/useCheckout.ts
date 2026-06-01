import { useState, useCallback } from 'react';
import { finalizarCompra } from '../services/checkoutApi.ts';
import type { CheckoutResponseDTO } from '../types/checkout.types.ts';

export const useCheckout = (clienteId: number) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [successData, setSuccessData] = useState<CheckoutResponseDTO | null>(null);

    const executeCheckout = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        setSuccessData(null);

        try {
            const result = await finalizarCompra(clienteId);
            setSuccessData(result);
        } catch (err: unknown) {
            // Type guard para garantir segurança na extração do erro
            if (err && typeof err === 'object' && 'message' in err) {
                setError((err as { message: string }).message);
            } else {
                setError('Ocorreu um erro de conexão. Tente novamente.');
            }
        } finally {
            setIsLoading(false);
        }
    }, [clienteId]);

    const copyPixToClipboard = useCallback(async () => {
        if (successData?.pagamento.copiaECola) {
            await navigator.clipboard.writeText(successData.pagamento.copiaECola);
            alert('Código PIX copiado com sucesso!');
        }
    }, [successData]);

    return {
        isLoading,
        error,
        successData,
        executeCheckout,
        copyPixToClipboard
    };
};