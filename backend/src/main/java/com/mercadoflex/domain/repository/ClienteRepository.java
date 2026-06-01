package com.mercadoflex.domain.repository;

import com.mercadoflex.domain.model.Cliente;
import java.util.Optional;

/**
 * Porta (Port) de saída para operações de persistência e consulta do ciclo de vida de um Cliente.
 * Segue o princípio de inversão de dependência (DIP).
 */
public interface ClienteRepository {

    /**
     * Recupera a instância vacinada de um Cliente a partir do seu ID único de cadastro.
     *
     * @param id Identificador do cliente.
     * @return Um Optional contendo o Cliente se localizado, ou vazio caso contrário.
     */
    Optional<Cliente> buscarPorId(Long id);
}