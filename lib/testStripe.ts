import { stripe } from './stripe';

(async () => {
  try {
    const testCustomer = await stripe.customers.create({
      email: 'test@example.com',
      name: 'Test User',
    });
    console.log('Client Stripe créé avec succès :', testCustomer);
  } catch (error) {
    console.error('Erreur lors du test de Stripe :', error);
  }
})();
