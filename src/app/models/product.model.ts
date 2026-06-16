export interface Product {
  id: string;

  vendor_id?: string;

  category_id: number;

  name: string;

  description: string;

  price: number;

  mrp: number;

  stock_quantity?: number;

  alert_quantity?: number;

  image?: string;

  image_webp?: string;

  status?: string;

  rating?: number;

  category_name?: string;
}
