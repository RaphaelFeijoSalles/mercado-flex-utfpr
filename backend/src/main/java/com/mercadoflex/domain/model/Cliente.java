package com.mercadoflex.domain.model;

/**
 * Entidade rica que representa o Cliente no ecossistema do Mercado Flex.
 * Este ator mapeia as pessoas físicas que mantêm contas ativas com direito a utilizar
 * serviços como a compra e a finalização de pedidos.
 */
public class Cliente {
    private final Long id;
    private final String nome;
    private final String email;
    private final String cpf;

    /**
     * Construtor de inicialização com validação de invariantes de estado.
     * Garante conformidade com o cadastro obrigatório de dados pessoais.
     *
     * @param id     Identificador único do cliente.
     * @param nome   Nome completo do usuário.
     * @param email  Endereço de e-mail único.
     * @param cpf    Cadastro de Pessoas Físicas válido.
     */
    public Cliente(Long id, String nome, String email, String cpf) {
        if (id == null) throw new IllegalArgumentException("Identificador do cliente é obrigatório.");
        if (nome == null || nome.isBlank()) throw new IllegalArgumentException("Nome é obrigatório.");
        if (email == null || email.isBlank()) throw new IllegalArgumentException("E-mail é obrigatório.");
        if (cpf == null || cpf.isBlank()) throw new IllegalArgumentException("CPF é obrigatório.");

        this.id = id;
        this.nome = nome;
        this.email = email;
        this.cpf = cpf;
    }

    public Long getId() { return id; }
    public String getNome() { return nome; }
    public String getEmail() { return email; }
    public String getCpf() { return cpf; }
}