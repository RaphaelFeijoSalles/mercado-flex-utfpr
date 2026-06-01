package com.mercadoflex.domain.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Collections;
import java.util.List;

/**
 * Entidade que representa o Pedido no sistema Mercado Flex.
 * Protege seu estado e concentra as regras de negócio de transição do Status do Pedido.
 */
public class Pedido {
    private Long id;
    private Cliente cliente;
    private final List<ItemPedido> itens = new ArrayList<>();
    private String status;
    private BigDecimal valorTotal;
    private LocalDateTime dataPedido;

    // Construtor protegido para forçar a criação via Carrinho de Compras
    public Pedido(Cliente cliente) {
        if (cliente == null) throw new IllegalArgumentException("Cliente é obrigatório");
        this.cliente = cliente;
        this.status = "Pendente";
        this.valorTotal = BigDecimal.ZERO;
        this.dataPedido = LocalDateTime.now();
    }

    /**
     * Adiciona um item ao pedido e recalcula o valor total.
     * Regra de negócio nativa da entidade, sem setters expostos.
     */
    public void adicionarItem(Produto produto, Integer quantidade) {
        if (quantidade == null || quantidade <= 0) {
            throw new IllegalArgumentException("Quantidade deve ser maior que zero.");
        }
        ItemPedido item = new ItemPedido(produto, quantidade, produto.getPreco());
        this.itens.add(item);
        calcularValorTotal();
    }

    private void calcularValorTotal() {
        this.valorTotal = this.itens.stream()
                .map(ItemPedido::calcularSubtotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    /**
     * Processa a confirmação vinda do Sistema de Pagamento.
     * Altera o Status do Pedido para "Em preparo" e o pagamento para "Pago".
     */
    public void processarPagamentoSucesso() {
        if (!"Pendente".equals(this.status)) {
            throw new IllegalStateException("Apenas pedidos pendentes podem ser pagos.");
        }
        // Conforme a regra de negócio do cenário B2C Mercado Flex
        this.status = "Em preparo";
    }

    // Getters
    public Long getId() { return id; }
    public Cliente getCliente() { return cliente; }
    public String getStatus() { return status; }
    public BigDecimal getValorTotal() { return valorTotal; }
    public List<ItemPedido> getItens() { return Collections.unmodifiableList(itens); }
}