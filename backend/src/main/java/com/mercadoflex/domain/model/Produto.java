package com.mercadoflex.domain.model;

import java.math.BigDecimal;

/**
 * Entidade que representa um Produto disponível no catálogo do marketplace.
 * Concentra as regras de validação estrutural do item à venda.
 */
public class Produto {
    private final Long id;
    private final String nome;
    private final String descricao;
    private final BigDecimal preco;

    public Produto(Long id, String nome, String descricao, BigDecimal preco) {
        if (id == null) throw new IllegalArgumentException("ID do produto é obrigatório.");
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Título do produto é obrigatório.");
        if (preco == null || preco.compareTo(BigDecimal.ZERO) < 0) {
            throw new IllegalArgumentException("Preços não podem ser nulos ou negativos.");
        }
        this.id = id;
        this.nome = nome;
        this.descricao = descricao != null ? descricao : "";
        this.preco = preco;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getDescricao() { return descricao; }
    public BigDecimal getPreco() { return preco; }
}