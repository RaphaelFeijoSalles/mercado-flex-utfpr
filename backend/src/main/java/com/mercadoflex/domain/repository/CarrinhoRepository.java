package com.mercadoflex.domain.repository;

import com.mercadoflex.domain.model.CarrinhoDeCompras;

public interface CarrinhoRepository {
    CarrinhoDeCompras buscarPorClienteId(Long clienteId);
    void limparCarrinho(Long clienteId);
}