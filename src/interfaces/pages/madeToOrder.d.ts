export interface MadeToOrderForm {
    firstName: string;
    lastName: string;
    email: string;
    phoneCode: string;
    phone: string;
    socialMedia?: string;
    contactTime?: string;
    message?: string;
    customSizeOrder?: CustomSizeOrderMeasurements;
}

export interface CustomSizeOrderMeasurements {
  nameProduct: string;
  height: number;
  weight: number;
  bust: number;
  waist: number;
  hips: number;
  shoulderWidth: number;
  armLength: number;
  neckCircumference: number;
}
