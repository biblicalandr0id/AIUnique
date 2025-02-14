export class PurchaseHandler {
    constructor(stripePublicKey) {
        this.stripe = Stripe(stripePublicKey);
    }

    async initiatePurchase(modelName) {
        try {
            const response = await fetch('/api/purchase', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${localStorage.getItem('token')}`
                },
                body: JSON.stringify({ model_name: modelName })
            });

            const data = await response.json();
            
            if (!response.ok) {
                throw new Error(data.error);
            }

            const { clientSecret } = data;
            const result = await this.stripe.confirmCardPayment(clientSecret);

            if (result.error) {
                throw new Error(result.error.message);
            }

            return true;
        } catch (error) {
            console.error('Purchase error:', error);
            return false;
        }
    }
}