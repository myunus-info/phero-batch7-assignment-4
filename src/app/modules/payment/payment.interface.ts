export type TPaymentConfirmData = {
  payload: Record<string, unknown>;
  orderId?: string;
  tranId?: string;
  status?: string;
};
