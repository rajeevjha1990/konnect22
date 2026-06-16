import { Component, OnInit, inject } from '@angular/core';
import { CartService } from 'src/app/services/cart/cart.service';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { AlertController } from '@ionic/angular';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.page.html',
  styleUrls: ['./cart.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class CartPage implements OnInit {
  cart: any[] = [];
  allProducts: any[] = [];
  relatedProducts: any[] = [];

  couponCode = '';
  couponDiscount = 0;
  deliveryCharge = 99;

  private cartService = inject(CartService);
  private router = inject(Router);

  constructor(
    private alertCtrl: AlertController,
    private productService: ProductService,
  ) {}

  async ngOnInit(): Promise<void> {
    this.cartService.cart$.subscribe((cart) => {
      this.cart = cart;
      this.loadRelatedProducts();

      this.deliveryCharge = this.getDeliveryCharge();
    });

    await this.cartService.getCartList();

    this.allProducts = await this.productService.getProducts();
  }

  async loadCart(): Promise<void> {
    await this.cartService.getCartList();
  }

  loadRelatedProducts(): void {
    if (!this.cart.length || !this.allProducts.length) {
      this.relatedProducts = [];
      return;
    }

    const cartCategories = this.cart.map((item) => item.category);

    const cartIds = this.cart.map((item) => item.id);

    this.relatedProducts = this.allProducts.filter(
      (product) =>
        cartCategories.includes(product.category) &&
        !cartIds.includes(product.id),
    );

    this.relatedProducts = this.relatedProducts.slice(0, 6);
  }

  async increase(item: any): Promise<void> {
    await this.cartService.increaseQty(item);
    await this.cartService.getCartList();
  }

  async decrease(item: any): Promise<void> {
    await this.cartService.decreaseQty(item);
    await this.cartService.getCartList();
  }

  async remove(item: any): Promise<void> {
    await this.cartService.removeItem(item);
    await this.cartService.getCartList();
  }

  async addRelatedToCart(item: any): Promise<void> {
    await this.cartService.addToCart(item);
    await this.cartService.getCartList();
  }

  openRelatedProduct(item: any): void {
    this.router.navigate(['/product-details', item.id]);
  }

  applyCoupon(): void {
    const code = this.couponCode.trim().toUpperCase();

    if (code === 'SAVE10') {
      this.couponDiscount = 10;
    } else if (code === 'WELCOME50') {
      this.couponDiscount = 50;
    } else {
      this.couponDiscount = 0;
    }
  }

  getSubtotal(): number {
    return this.cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
      0,
    );
  }

  getDeliveryCharge(): number {
    return this.getSubtotal() > 5000 ? 0 : 99;
  }

  getFinalTotal(): number {
    this.deliveryCharge = this.getDeliveryCharge();

    return this.getSubtotal() + this.deliveryCharge - this.couponDiscount;
  }

  getTotal(): number {
    return this.getFinalTotal();
  }

  getStars(rating: number): string {
    const fullStars = Math.floor(rating);

    const halfStar = rating - fullStars >= 0.5;

    let stars = '★'.repeat(fullStars);

    if (halfStar) {
      stars += '☆';
    }

    return stars.padEnd(5, '☆');
  }

  async showCouponAlert(): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Available Coupons',
      message: 'SAVE10 → ₹10 OFF<br>WELCOME50 → ₹50 OFF',
      buttons: ['OK'],
    });

    await alert.present();
  }

  goToCheckout(): void {
    this.router.navigate(['/checkout']);
  }
}
