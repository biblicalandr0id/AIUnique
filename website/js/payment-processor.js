export class PaymentProcessor {
    constructor(stripePublicKey) {
        this.stripe = Stripe(stripePublicKey);
        this.elements = this.stripe.elements();
    }

    createPaymentForm(containerId, amount) {
        const container = document.getElementById(containerId);
        
        // Create card element
        const card = this.elements.create('card', {
            style: {
                base: {
                    color: '#fff',
                    fontFamily: 'Arial, sans-serif',
                    fontSmoothing: 'antialiased',
                    fontSize: '16px',
                    '::placeholder': {
                        color: '#aab7c4'
                    }
                },
                invalid: {
                    color: '#fa755a',
                    iconColor: '#fa755a'
                }
            }
        });

        // Mount card element
        card.mount(`#${containerId}`);
        
        return card;
    }

    async processPayment(card, modelId, amount) {
        try {
            const { paymentIntent, error } = await this.stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: card,
                        billing_details: {
                            name: document.getElementById('cardholder-name').value
                        }
                    }
                }
            );

            if (error) {
                throw new Error(error.message);
            }
            
            return paymentIntent;
        } catch (error) {
            console.error('Payment failed:', error);
            throw error;
        }
    }
}