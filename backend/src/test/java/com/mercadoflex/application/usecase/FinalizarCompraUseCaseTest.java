package com.mercadoflex.application.usecase;

import com.mercadoflex.domain.model.CarrinhoDeCompras;
import com.mercadoflex.domain.model.Cliente;
import com.mercadoflex.domain.model.ItemPedido;
import com.mercadoflex.domain.model.Pedido;
import com.mercadoflex.domain.model.Produto;
import com.mercadoflex.domain.repository.CarrinhoRepository;
import com.mercadoflex.domain.repository.ClienteRepository;
import com.mercadoflex.domain.repository.PedidoRepository;
import com.mercadoflex.domain.service.SistemaDePagamentoGateway;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertThrows;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

class FinalizarCompraUseCaseTest {

    private ClienteRepository clienteRepository;
    private CarrinhoRepository carrinhoRepository;
    private PedidoRepository pedidoRepository;
    private SistemaDePagamentoGateway sistemaDePagamentoGateway;
    private FinalizarCompraUseCase finalizarCompraUseCase;

    @BeforeEach
    void setup() {
        clienteRepository = Mockito.mock(ClienteRepository.class);
        carrinhoRepository = Mockito.mock(CarrinhoRepository.class);
        pedidoRepository = Mockito.mock(PedidoRepository.class);
        sistemaDePagamentoGateway = Mockito.mock(SistemaDePagamentoGateway.class);

        finalizarCompraUseCase = new FinalizarCompraUseCase(
                clienteRepository,
                carrinhoRepository,
                pedidoRepository,
                sistemaDePagamentoGateway
        );
    }

    @Test
    @DisplayName("Deve finalizar a compra com sucesso seguindo o fluxo padrão (Caminho Feliz)")
    void deveFinalizarCompraComSucesso() {
        // --- ARRANGE (Preparar) ---
        Long clienteId = 1L;
        Cliente cliente = new Cliente(clienteId, "João Silva", "joao@email.com", "12345678900");
        Produto produto = new Produto(1L, "Smartphone", "Smartphone moderno", BigDecimal.valueOf(3500.00));
        ItemPedido item = new ItemPedido(produto, 1, produto.getPreco());
        CarrinhoDeCompras carrinho = new CarrinhoDeCompras(clienteId, List.of(item));

        // Simulando que o Pedido Salvo no final é o mesmo gerado na memória
        Pedido pedidoEsperado = new Pedido(cliente);
        pedidoEsperado.adicionarItem(produto, 1);
        pedidoEsperado.processarPagamentoSucesso();

        // Configurando os Mocks
        when(clienteRepository.buscarPorId(clienteId)).thenReturn(Optional.of(cliente));
        when(carrinhoRepository.buscarPorClienteId(clienteId)).thenReturn(carrinho);
        when(sistemaDePagamentoGateway.processarPagamentoPix(any(Pedido.class))).thenReturn(true);
        when(pedidoRepository.salvar(any(Pedido.class))).thenReturn(pedidoEsperado);

        // --- ACT (Agir/Executar) ---
        Pedido resultado = finalizarCompraUseCase.executar(clienteId);

        // --- ASSERT (Afirmar/Verificar) ---
        assertNotNull(resultado, "O pedido não deveria ser nulo.");
        assertEquals("Em preparo", resultado.getStatus(), "O status do pedido após o pagamento aprovado deve ser 'Em preparo'.");
        assertEquals(BigDecimal.valueOf(3500.0), resultado.getValorTotal(), "O valor total do pedido deve ser igual a 3500.00.");

        // Verifica se os métodos secundários previstos no fluxo foram efetivamente chamados
        verify(pedidoRepository).salvar(any(Pedido.class));
        verify(carrinhoRepository).limparCarrinho(clienteId);
    }

    @Test
    @DisplayName("Deve lançar exceção quando o pagamento for recusado pelo Gateway")
    void deveLancarExcecaoQuandoPagamentoForRecusado() {
        // --- ARRANGE (Preparar) ---
        Long clienteId = 1L;
        Cliente cliente = new Cliente(clienteId, "Maria Silva", "maria@email.com", "09876543211");
        Produto produto = new Produto(1L, "Smart TV", "Smart TV 4K", BigDecimal.valueOf(2800.00));
        ItemPedido item = new ItemPedido(produto, 1, produto.getPreco());
        CarrinhoDeCompras carrinho = new CarrinhoDeCompras(clienteId, List.of(item));

        when(clienteRepository.buscarPorId(clienteId)).thenReturn(Optional.of(cliente));
        when(carrinhoRepository.buscarPorClienteId(clienteId)).thenReturn(carrinho);
        when(sistemaDePagamentoGateway.processarPagamentoPix(any(Pedido.class))).thenReturn(false); // Pagamento recusado

        // --- ACT (Agir/Executar) e ASSERT (Afirmar/Verificar) ---
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            finalizarCompraUseCase.executar(clienteId);
        });

        assertEquals("Pagamento recusado pelo gateway.", exception.getMessage());
    }

    @Test
    @DisplayName("Deve lançar exceção quando tentar finalizar pedido com carrinho vazio")
    void deveLancarExcecaoQuandoCarrinhoVazio() {
        // --- ARRANGE (Preparar) ---
        Long clienteId = 1L;
        Cliente cliente = new Cliente(clienteId, "Pedro Silva", "pedro@email.com", "11122233344");
        CarrinhoDeCompras carrinhoVazio = new CarrinhoDeCompras(clienteId, List.of()); // Carrinho vazio

        when(clienteRepository.buscarPorId(clienteId)).thenReturn(Optional.of(cliente));
        when(carrinhoRepository.buscarPorClienteId(clienteId)).thenReturn(carrinhoVazio);

        // --- ACT (Agir/Executar) e ASSERT (Afirmar/Verificar) ---
        IllegalStateException exception = assertThrows(IllegalStateException.class, () -> {
            finalizarCompraUseCase.executar(clienteId);
        });

        assertEquals("O Carrinho de Compras está vazio.", exception.getMessage());
    }
}