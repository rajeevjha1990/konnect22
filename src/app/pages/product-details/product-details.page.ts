import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';

import { CartService } from 'src/app/services/cart/cart.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { ProductService } from 'src/app/services/product/product.service';

@Component({
  selector: 'app-product-details',
  templateUrl: './product-details.page.html',
  styleUrls: ['./product-details.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class ProductDetailsPage implements OnInit {
  product: any;

  quantity = 1;

  relatedProducts: any[] = [];

  allProducts: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private cartService: CartService,
    private router: Router,
    private productService: ProductService,
  ) {}

  async ngOnInit() {
    const nav = this.router.getCurrentNavigation();

    if (nav?.extras?.state?.['product']) {
      this.product = nav.extras.state['product'];

      // All Products

      this.allProducts = await this.productService.getProducts();

      // Related Products

      this.relatedProducts = this.allProducts.filter(
        (item: any) =>
          Number(item.category_id) === Number(this.product.category_id) &&
          Number(item.id) !== Number(this.product.id),
      );
    }
  }

  increaseQty() {
    this.quantity++;
  }

  decreaseQty() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  addToCart() {
    const item = {
      ...this.product,
      quantity: this.quantity,
    };

    this.cartService.addToCart(item);

    alert('Product added to cart');
  }

  buyNow() {
    const item = {
      ...this.product,
      quantity: this.quantity,
    };

    this.cartService.addToCart(item);

    this.router.navigate(['/cart']);
  }

  addRelatedToCart(item: any) {
    const product = {
      ...item,
      quantity: 1,
    };

    this.cartService.addToCart(product);

    alert('Related product added');
  }

  openRelatedProduct(item: any) {
    this.router.navigate(['/product-details'], {
      state: {
        product: item,
      },
    });
  }
}
