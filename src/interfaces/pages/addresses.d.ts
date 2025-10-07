export interface AddressFormData {
  id?: string
  title: string;
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  zipCode: string;
  state?: string;
  country: string;
  phoneCode?: string;
  phone: string
  isDefault: boolean
}

export interface Notify {
  add: NotifyItem;
  edit: NotifyItem;
}

export interface NotifyItem {
  status: "success" | "fail" | "";
  message: string;
}