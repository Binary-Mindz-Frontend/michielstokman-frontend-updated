export interface IPaymentCheckoutRequest {
  user_id: string;
  journey_code: string;
  provider: 'stripe';
}
