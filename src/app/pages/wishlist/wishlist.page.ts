import { Component, inject } from '@angular/core';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

import { ProductCardComponent } from 'src/app/components/product-card/product-card.component';

import { HeaderComponent } from 'src/app/components/header/header.component';
import { WishlistService } from 'src/app/services/wishlist/wishlist.service';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.page.html',
  styleUrls: ['./wishlist.page.scss'],
  imports: [...SHARED_IONIC_MODULES, ProductCardComponent, HeaderComponent],
})
export class WishlistPage {
  private wishlistService = inject(WishlistService);

  get wishlistItems() {
    return this.wishlistService.getWishlist();
  }
}
