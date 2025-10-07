export interface PaymentFormData {
  nameOnCard: string;
  firstName: string;
  lastName: string;
  address1: string;
  address2: string;
  city: string;
  postcode: string;
  country: string;
  state: string;
  phonecode: string;
  phone: string;
  phonecode2: string;
  phone2: string;
}
export interface PaymentIntentResponse {
  clientSecret: string;
}

export interface BraintreeClientTokenResponse {
  clientToken: string;
}

export interface BraintreeTransactionResponse {
  success: boolean;
  transaction?: {
    id: string;
    status: string;
    amount: string;
    order? : {
      id: string;
    }
  };
  error?: string;
}
export interface PaypalOrderResponse {
  success: boolean;
  order: {
    id: string;
    status: string;
    links: Array<{ href: string; rel: string; method: string }>;
  };
}

export interface PaypalCaptureResponse {
  success: boolean;
  capture: {
    id: string;
    status: string;
    amount: { currency_code: string; value: string };
  };
  order: Order;
}

export interface CardInfor {
  cardType: string;
  cardNumber: string;
  cardName: string;
  cardExp: string;
}

export interface Invoice {
  id?: string;
  customerName: string;
  customerEmail: string;
  items: {
    name: string;
    price: number;
    quantity: number;
    size?: string;
    color?: string;
  }[];
  subtotal: number;
  taxRate: number;
  shippingfee: number;
  total: number;
  createdAt?: string;
}

export interface InvoiceResponse {
  success: boolean;
  message: string;
}
