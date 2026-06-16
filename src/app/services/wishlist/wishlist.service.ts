import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import * as Constants from '../../constant/app.constatnt';
import { RajeevhttpService } from '../http/rajeevhttp.service';

@Injectable({
  providedIn: 'root',
})
export class WishlistService {
  private wishlist: any[] = [];

  private wishlistSubject = new BehaviorSubject<any[]>([]);
  wishlist$ = this.wishlistSubject.asObservable();

  constructor(private rajeevHttp: RajeevhttpService) {
    this.loadWishlist();
  }

  private loadWishlist(): void {
    try {
      const data = localStorage.getItem('wishlist');

      if (data) {
        this.wishlist = JSON.parse(data);
      } else {
        this.wishlist = [];
      }

      this.wishlistSubject.next([...this.wishlist]);
    } catch (e) {
      console.error(e);
    }
  }

  private saveWishlist(): void {
    localStorage.setItem('wishlist', JSON.stringify(this.wishlist));
    this.wishlistSubject.next([...this.wishlist]);
  }

  getWishlist(): any[] {
    return [...this.wishlist];
  }

  async addToWishlist(product: any): Promise<boolean> {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
        product_id: product.id,
      };

      const url = Constants.WISHLIST_API_PATH + 'add_to_wishlist';

      const resp: any = await this.rajeevHttp.post(url, payload);

      if (resp?.status) {
        const exists = this.wishlist.find(
          (item) => Number(item.id) === Number(product.id),
        );

        if (!exists) {
          this.wishlist.push(product);
          this.saveWishlist();
        }

        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  async removeFromWishlist(productId: number): Promise<boolean> {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
        product_id: productId,
      };

      const url = Constants.WISHLIST_API_PATH + 'remove_wishlist';

      const resp: any = await this.rajeevHttp.post(url, payload);

      if (resp?.status) {
        this.wishlist = this.wishlist.filter(
          (item) => Number(item.id) !== Number(productId),
        );

        this.saveWishlist();

        return true;
      }
    } catch (error) {
      console.error(error);
    }

    return false;
  }

  async toggleWishlist(product: any): Promise<void> {
    if (this.isInWishlist(product.id)) {
      await this.removeFromWishlist(product.id);
    } else {
      await this.addToWishlist(product);
    }
  }

  isInWishlist(productId: number): boolean {
    return this.wishlist.some((item) => Number(item.id) === Number(productId));
  }

  getWishlistCount(): number {
    return this.wishlist.length;
  }

  async getWishlistList(): Promise<void> {
    try {
      const payload = {
        user_id: localStorage.getItem('user_id'),
      };

      const url = Constants.WISHLIST_API_PATH + 'get_wishlist';

      const resp: any = await this.rajeevHttp.post(url, payload);

      if (resp?.status) {
        this.wishlist = resp.wishlist || [];

        localStorage.setItem('wishlist', JSON.stringify(this.wishlist));

        this.wishlistSubject.next([...this.wishlist]);
      }
    } catch (error) {
      console.error(error);
    }
  }

  clearWishlist(): void {
    this.wishlist = [];
    localStorage.removeItem('wishlist');
    this.wishlistSubject.next([]);
  }
}
