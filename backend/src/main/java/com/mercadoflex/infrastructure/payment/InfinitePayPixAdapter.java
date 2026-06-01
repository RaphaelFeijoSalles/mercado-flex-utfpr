package com.mercadoflex.infrastructure.payment;

import com.mercadoflex.domain.model.Pedido;
import com.mercadoflex.domain.model.Cliente;
import com.mercadoflex.domain.service.SistemaDePagamentoGateway;
import org.jspecify.annotations.NonNull;

import java.math.BigDecimal;
import java.util.List;
import java.util.logging.Logger;

/**
 * Adaptador de Infraestrutura que implementa a comunicação com o Sistema de Pagamento InfinitePay.
 *
 * Assim que o cliente faz um pedido, é enviada uma requisição POST para:
 * POST https://api.checkout.infinitepay.io/links
 *
 * Conceitos utilizados na integração:
 *
 * 1. Handle (InfiniteTag): Nome de usuário no app InfinitePay (sem o símbolo $).
 *    Identifica a conta que está recebendo o pagamento.
 *
 * 2. Itens do Pedido: Produtos ou serviços comprados (mínimo 1 item).
 *    Atenção: O valor do produto deve ser em centavos (ex: R$ 10,00 = 1000).
 *
 * 3. Order NSU: Identificador rastreável do pedido no nosso sistema. 
 *    Permite identificar pagamentos originados deste link de checkout.
 *
 * 4. URL de Redirecionamento (redirect_url): Para onde o cliente vai após pagar.
 *    A URL receberá os parâmetros: receipt_url, order_nsu, slug, capture_method, transaction_nsu.
 *
 * 5. Webhook URL (webhook_url): URL para receber notificações em tempo real.
 *    Deve responder rapidamente com 200 OK (✓) ou 400 Bad Request (✗).
 *
 * 6. Dados do Cliente (customer): Nome, e-mail e telefone para agilizar o checkout.
 *
 * 7. Endereço de Entrega (address): Endereço físico para entrega de produtos físicos.
 */
public class InfinitePayPixAdapter implements SistemaDePagamentoGateway {

    private static final Logger logger = Logger.getLogger(InfinitePayPixAdapter.class.getName());
    
    // A tag da conta InfinitePay (handle) sem o símbolo $
    private static final String HANDLE = "mercadoflex-demo"; 
    
    // URL de redirecionamento após pagamento (página de sucesso)
    private static final String REDIRECT_URL = "https://mercadoflex.com/pagamento-concluido";
    
    // Webhook URL para notificação em tempo real do status do pagamento
    private static final String WEBHOOK_URL = "https://api.mercadoflex.com/webhook/infinitepay";

    /**
     * Item do Pedido.
     * @param quantity Quantidade do item.
     * @param price Valor do produto em centavos (ex: R$ 10,00 = 1000).
     * @param description Descrição do produto.
     */
    private record CheckoutItem(int quantity, long price, String description) {}
    
    /**
     * Dados do Cliente para agilizar o processo de checkout.
     * @param name Nome do cliente.
     * @param email E-mail do cliente.
     * @param phone_number Telefone do cliente (formato +55...).
     */
    private record CheckoutCustomer(String name, String email, String phone_number) {}

    /**
     * Endereço de entrega, caso o produto precise ser entregue em mãos.
     */
    private record CheckoutAddress(String cep, String street, String neighborhood, String number, String complement) {}

    /**
     * Payload completo para a requisição de geração do link de checkout.
     * POST https://api.checkout.infinitepay.io/links
     * 
     * @param handle InfiniteTag obrigatória.
     * @param items Lista de produtos.
     * @param order_nsu Identificador único do pedido no nosso sistema.
     * @param redirect_url URL para redirecionar o cliente após conclusão.
     * @param webhook_url URL para recebimento do status do pagamento (server-to-server).
     * @param customer Dados do cliente.
     * @param address Endereço de entrega.
     */
    private record CheckoutRequest(
            String handle,
            List<CheckoutItem> items,
            String order_nsu,
            String redirect_url,
            String webhook_url,
            CheckoutCustomer customer,
            CheckoutAddress address
    ) {}

    @Override
    public boolean processarPagamentoPix(Pedido pedido) {
        // 1. Mapeia os itens do pedido para o formato exigido (preço em centavos)
        List<CheckoutItem> checkoutItems = pedido.getItens().stream()
                .map(item -> new CheckoutItem(
                        item.getQuantidade(),
                        converterParaCentavos(item.getPrecoUnitario()),
                        item.getProduto().getNome()
                ))
                .toList();

        // 2. Extrai e mapeia os dados do cliente
        CheckoutRequest requestPayload = getCheckoutRequest(pedido, checkoutItems);

        logger.info(String.format("Enviando requisição POST para https://api.checkout.infinitepay.io/links com o payload: %s", requestPayload));

        // Aqui você utilizaria um HttpClient nativo ou o Spring WebClient / Feign
        // para executar a chamada POST e ler a resposta.
        
        // Exemplo da verificação de status após isso seria um POST em:
        // https://api.checkout.infinitepay.io/payment_check

        // Simulando resposta do Link de Pagamento Gerado com sucesso
        boolean linkGeradoComSucesso = System.currentTimeMillis() > 0;

        if (linkGeradoComSucesso) {
            logger.info("Link de pagamento gerado. (Simulação Mock)");
            return true;
        }
        return false;
    }

    private static @NonNull CheckoutRequest getCheckoutRequest(Pedido pedido, List<CheckoutItem> checkoutItems) {
        Cliente cliente = pedido.getCliente();
        CheckoutCustomer customer = new CheckoutCustomer(
                cliente.getNome(),
                cliente.getEmail(),
                "+5511999999999" // Mock do telefone, deve ser extraído do cliente no cenário real
        );

        // 3. Mock de Endereço (em um cenário real, o endereço de entrega do pedido)
        return getCheckoutRequest(pedido, checkoutItems, customer);
    }

    private static @NonNull CheckoutRequest getCheckoutRequest(Pedido pedido, List<CheckoutItem> checkoutItems, CheckoutCustomer customer) {
        CheckoutAddress address = new CheckoutAddress(
                "01000000",
                "Rua Fictícia",
                "Centro",
                "123",
                "Apto 1"
        );

        // 4. Monta o payload completo
        CheckoutRequest requestPayload = new CheckoutRequest(
                HANDLE,
                checkoutItems,
                "ORDER-" + pedido.getId(), // order_nsu para rastrear o link de checkout
                REDIRECT_URL,
                WEBHOOK_URL,
                customer,
                address
        );
        return requestPayload;
    }

    /**
     * Converte o valor em BigDecimal (reais) para um valor inteiro (long) em centavos.
     * Ex: R$ 10,00 -> 1000
     */
    private long converterParaCentavos(BigDecimal valor) {
        return valor.multiply(BigDecimal.valueOf(100)).longValue();
    }
}