export interface CheckoutRequestDTO {
    clienteId: number;
    // O carrinho será resolvido no backend, mas o ID do cliente é necessário
}

export interface PixDataDTO {
    qrCodeBase64: string; // Imagem gerada pela InfinitePay
    copiaECola: string;   // O payload 'brcode'
    expiresAt: string;
}

export interface CheckoutResponseDTO {
    pedidoId: number;
    status: string; // Ex: "Em preparo", "Aguardando Pagamento"
    valorTotal: number;
    pagamento: PixDataDTO;
}

export interface CheckoutError {
    message: string;
    statusCode: number;
}