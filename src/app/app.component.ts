import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { IonApp, IonRouterOutlet } from '@ionic/angular/standalone';
import { SHARED_IONIC_MODULES } from './shared/shared.ionic';
import { HeaderComponent } from './components/header/header.component';
import { CartService } from './services/cart/cart.service';
import { WishlistService } from './services/wishlist/wishlist.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, IonApp, IonRouterOutlet, HeaderComponent],
})
export class AppComponent implements OnInit, OnDestroy {
  cartCount = 0;
  wishlistCount = 0;

  private cartService = inject(CartService);
  private wishlistService = inject(WishlistService);
  private router = inject(Router);

  private subscriptions: Subscription[] = [];

  constructor() {}

  ngOnInit(): void {
    const cartSub = this.cartService.cart$.subscribe((cart: any[]) => {
      this.cartCount = cart.reduce(
        (total, item) => total + Number(item.quantity || 0),
        0,
      );
    });

    const wishlistSub = this.wishlistService.wishlist$.subscribe(
      (wishlist: any[]) => {
        this.wishlistCount = wishlist.length;
      },
    );

    this.subscriptions.push(cartSub, wishlistSub);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((sub) => sub.unsubscribe());
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  goToWishlist(): void {
    this.router.navigate(['/wishlist']);
  }

  logout(): void {
    localStorage.clear();

    this.router.navigate(['/login'], { replaceUrl: true });
  }
}
