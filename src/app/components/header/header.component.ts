import { Component, Input, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from 'src/app/services/cart/cart.service';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES],
})
export class HeaderComponent implements OnInit {
  @Input() title: string = 'KONNECT 22';
  @Input() showLogo: boolean = true;

  // NEW
  @Input() showActions: boolean = true;

  cartCount = 0;
  wishlistCount = 0;

  private cartService = inject(CartService);
  private router = inject(Router);
  private wishlistService = inject(WishlistService);

  ngOnInit(): void {
    this.cartService.cart$.subscribe((cart: any[]) => {
      this.cartCount = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );
    });
    console.log('CART COUNT =>', this.cartCount);
    this.wishlistService.wishlist$.subscribe((wishlist) => {
      this.wishlistCount = wishlist.length;
    });
  }
  async goToCart() {
    this.router.navigate(['/cart']);
  }

  async goToWishlist() {
    await this.router.navigate(['/wishlist']);
  }
}
