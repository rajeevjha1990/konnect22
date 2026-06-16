import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Constants from '../../constant/app.constatnt';
import { RajeevhttpService } from '../http/rajeevhttp.service';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: any[] = [];

  private cartSubject = new BehaviorSubject<any[]>([]);
  cart$ = this.cartSubject.asObservable();

  constructor(private rajeevHttp: RajeevhttpService) {
    this.loadCart();
  }

  private loadCart(): void {
    try {
      const data = localStorage.getItem('cart');

      if (data) {
        this.cart = JSON.parse(data);
      } else {
        this.cart = [];
      }
    } catch (error) {
      console.error('Cart loading error:', error);
      this.cart = [];
    }

    this.cartSubject.next([...this.cart]);
  }

  private saveCart(): void {
    try {
      localStorage.setItem('cart', JSON.stringify(this.cart));
      this.cartSubject.next([...this.cart]);
    } catch (error) {
      console.error('Cart save error:', error);
    }
  }

  getCart(): any[] {
    return [...this.cart];
  }

  async addToCart(product: any): Promise<void> {
    if (!product || !product.id) {
      console.warn('Invalid product');
      return;
    }

    const userId = localStorage.getItem('user_id');

    const payload = {
      user_id: userId,
      product_id: product.id,
      qty: 1,
      vendor_id: product.vendor_id,
    };

    try {
      const url = Constants.CART_API_PATH + 'add_to_cart';

      const apiResp: any = await this.rajeevHttp.post(url, payload);

      console.log('ADD CART =>', apiResp);

      if (apiResp?.status === true || apiResp?.status === 200) {
        const index = this.cart.findIndex(
          (item) => Number(item.id) === Number(product.id),
        );

        if (index > -1) {
          this.cart[index].quantity =
            Number(this.cart[index].quantity || 0) + 1;
        } else {
          this.cart.push({
            ...product,
            quantity: 1,
          });
        }

        localStorage.setItem('cart', JSON.stringify(this.cart));

        // IMPORTANT
        this.cartSubject.next([...this.cart]);
      }
    } catch (error) {
      console.error('ADD CART ERROR =>', error);
    }
  }
  async increaseQty(product: any): Promise<void> {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
        product_id: product.id,
        action: 'increase',
      };

      const url = Constants.CART_API_PATH + 'update_cart_qty';

      const resp: any = await this.rajeevHttp.post(url, payload);

      if (resp?.status) {
        const index = this.cart.findIndex(
          (item) => Number(item.id) === Number(product.id),
        );

        if (index > -1) {
          this.cart[index].quantity += 1;
          this.saveCart();
        }
      }
    } catch (error) {
      console.error('INCREASE CART ERROR =>', error);
    }
  }
  async decreaseQty(product: any): Promise<void> {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
        product_id: product.id,
        action: 'decrease',
      };

      const url = Constants.CART_API_PATH + 'update_cart_qty';

      const resp: any = await this.rajeevHttp.post(url, payload);

      if (resp?.status) {
        const index = this.cart.findIndex(
          (item) => Number(item.id) === Number(product.id),
        );

        if (index > -1) {
          this.cart[index].quantity -= 1;

          if (this.cart[index].quantity <= 0) {
            this.cart.splice(index, 1);
          }

          this.saveCart();
        }
      }
    } catch (error) {
      console.error('DECREASE CART ERROR =>', error);
    }
  }
  async removeItem(product: any): Promise<void> {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
        product_id: product.id,
      };

      const url = Constants.CART_API_PATH + 'remove_cart_item';

      const resp: any = await this.rajeevHttp.post(url, payload);

      if (resp?.status) {
        this.cart = this.cart.filter(
          (item) => Number(item.id) !== Number(product.id),
        );

        this.saveCart();
      }
    } catch (error) {
      console.error('REMOVE CART ERROR =>', error);
    }
  }
  getCount(): number {
    return this.cart.reduce((total, item) => total + (item.quantity || 0), 0);
  }

  getTotalPrice(): number {
    return this.cart.reduce(
      (total, item) => total + (item.price || 0) * (item.quantity || 0),
      0,
    );
  }
  async getCartList(): Promise<void> {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
      };

      const url = Constants.CART_API_PATH + 'get_cart';

      const resp: any = await this.rajeevHttp.post(url, payload);

      if (resp?.status) {
        this.cart = (resp.cart || []).map((item: any) => ({
          ...item,

          image: item.image_webp
            ? this.rajeevHttp.BASE_URL + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',
        }));

        localStorage.setItem('cart', JSON.stringify(this.cart));

        this.cartSubject.next([...this.cart]);
      }
    } catch (error) {
      console.error('GET CART ERROR =>', error);
    }
  }
  clearCart(): void {
    this.cart = [];
    localStorage.removeItem('cart');
    this.cartSubject.next([]);
  }
}
