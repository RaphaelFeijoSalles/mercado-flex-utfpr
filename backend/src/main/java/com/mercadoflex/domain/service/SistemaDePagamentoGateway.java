package com.mercadoflex.domain.service;

import com.mercadoflex.domain.model.Pedido;

/**
 * Porta de saída para o Sistema de Pagamento (Ator Externo).
 */
public interface SistemaDePagamentoGateway {

    /**
     * Processa o pagamento via PIX para o respectivo pedido.
     * @param pedido O pedido originado no Checkout.
     * @return true se autorizado imediatamente, false caso contrário.
     */
    boolean processarPagamentoPix(Pedido pedido);
}