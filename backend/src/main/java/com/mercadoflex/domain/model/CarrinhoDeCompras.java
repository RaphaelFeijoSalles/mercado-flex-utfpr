package com.mercadoflex.domain.model;

import java.util.List;

/**
 * Entidade que representa o Carrinho de Compras, o repositório temporário
 * onde o Cliente armazena os produtos antes do Checkout.
 */
public class CarrinhoDeCompras {
    private Long clienteId;
    private List<ItemPedido> itens;

    public CarrinhoDeCompras(Long clienteId, List<ItemPedido> itens) {
        this.clienteId = clienteId;
        this.itens = itens;
    }

    public List<ItemPedido> getItens() { return itens; }
    public boolean isVazio() { return itens == null || itens.isEmpty(); }
}