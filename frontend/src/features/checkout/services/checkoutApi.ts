import type { CheckoutResponseDTO, CheckoutError } from '../types/checkout.types.ts';

export const finalizarCompra = async (clienteId: number): Promise<CheckoutResponseDTO> => {
    const response = await fetch(`/api/checkout/finalizar/${clienteId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const error: CheckoutError = {
            message: errorData.message || 'Erro inesperado ao processar o pagamento.',
            statusCode: response.status,
        };
        throw error; // Lançamos o erro formatado para o Hook capturar
    }

    return response.json();
};