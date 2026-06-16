import {
  Component,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
  Input,
} from '@angular/core';

import { Product } from 'src/app/models/product.model';

import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

import { NavController } from '@ionic/angular';
import { Router } from '@angular/router';
import { RajeevhttpService } from 'src/app/services/http/rajeevhttp.service';
@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class ProductCardComponent implements OnInit, OnChanges {
  @Input() product!: Product;

  isWishlisted = false;

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);
  constructor(
    private navCtrl: NavController,
    public httpservice: RajeevhttpService,
  ) {}

  ngOnInit(): void {
    console.log(this.httpservice.BASE_URL);
    this.checkWishlistStatus();

    this.wishlistService.wishlist$.subscribe(() => {
      this.checkWishlistStatus();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['product'] && this.product) {
      this.checkWishlistStatus();
    }
  }

  checkWishlistStatus(): void {
    if (!this.product) return;

    this.isWishlisted = this.wishlistService.isInWishlist(
      Number(this.product.id),
    );
  }

  addToCart(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    const userId = localStorage.getItem('user_id');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) return;

    this.cartService.addToCart(this.product);
  }

  goToDetail(): void {
    if (!this.product) return;

    this.navCtrl.navigateForward(`/product-details/${this.product.id}`, {
      state: {
        product: this.product,
      },
    });
  }

  async toggleWishlist(event?: Event): Promise<void> {
    event?.preventDefault();
    event?.stopPropagation();

    const userId = localStorage.getItem('user_id');

    if (!userId) {
      this.router.navigate(['/login']);
      return;
    }

    if (!this.product) return;

    await this.wishlistService.toggleWishlist(this.product);

    this.isWishlisted = this.wishlistService.isInWishlist(
      Number(this.product.id),
    );
  }
}
