package com.mercadoflex.application.usecase;

import com.mercadoflex.domain.model.CarrinhoDeCompras;
import com.mercadoflex.domain.model.Cliente;
import com.mercadoflex.domain.model.Pedido;
import com.mercadoflex.domain.repository.CarrinhoRepository;
import com.mercadoflex.domain.repository.ClienteRepository;
import com.mercadoflex.domain.repository.PedidoRepository;
import com.mercadoflex.domain.service.SistemaDePagamentoGateway;

/**
 * Caso de Uso: Finalizar Compra.
 * Orquestra o processo de Checkout, transforma o Carrinho de Compras em um Pedido
 * e interage com o Sistema de Pagamento para concluir a transação de forma segura.
 */
public class FinalizarCompraUseCase {

    private final ClienteRepository clienteRepository;
    private final CarrinhoRepository carrinhoRepository;
    private final PedidoRepository pedidoRepository;
    private final SistemaDePagamentoGateway sistemaDePagamentoGateway;

    public FinalizarCompraUseCase(ClienteRepository clienteRepository,
                                  CarrinhoRepository carrinhoRepository,
                                  PedidoRepository pedidoRepository,
                                  SistemaDePagamentoGateway sistemaDePagamentoGateway) {
        this.clienteRepository = clienteRepository;
        this.carrinhoRepository = carrinhoRepository;
        this.pedidoRepository = pedidoRepository;
        this.sistemaDePagamentoGateway = sistemaDePagamentoGateway;
    }

    /**
     * Executa a finalização da compra (Checkout).
     * @param clienteId ID do Cliente autenticado.
     * @return O pedido finalizado e salvo.
     */
    public Pedido executar(Long clienteId) {
        // --- ARRANGE (Preparar) ---
        // Configura o cenário inicializando objetos e validando as pré-condições do Cliente e do Carrinho.
        Cliente cliente = clienteRepository.buscarPorId(clienteId)
                .orElseThrow(() -> new IllegalArgumentException("Cliente não encontrado."));

        CarrinhoDeCompras carrinho = carrinhoRepository.buscarPorClienteId(clienteId);

        if (carrinho == null || carrinho.isVazio()) {
            throw new IllegalStateException("O Carrinho de Compras está vazio.");
        }

        // --- ACT (Agir/Executar) ---
        // Executa as regras centrais de geração do Pedido e comunicação com o gateway.
        Pedido pedido = new Pedido(cliente);
        carrinho.getItens().forEach(item ->
                pedido.adicionarItem(item.getProduto(), item.getQuantidade())
        );

        boolean pagamentoAprovado = sistemaDePagamentoGateway.processarPagamentoPix(pedido);

        // --- ASSERT / BUSINESS RULES (Afirmar/Verificar lógicas internas) ---
        // Verifica se a ação anterior foi bem sucedida para alterar o estado do pedido ou lançar erro.
        if (pagamentoAprovado) {
            pedido.processarPagamentoSucesso(); // Status do Pedido muda para "Em preparo"
        } else {
            throw new IllegalStateException("Pagamento recusado pelo gateway.");
        }

        // Persistência e limpeza final (Faz parte do fluxo principal após validação)
        Pedido pedidoSalvo = pedidoRepository.salvar(pedido);
        carrinhoRepository.limparCarrinho(clienteId);

        return pedidoSalvo;
    }
}