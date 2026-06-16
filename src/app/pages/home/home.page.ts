import { Component, inject, OnInit, OnDestroy } from '@angular/core';

import { ProductService } from '../../services/product/product.service';
import { Product } from '../../models/product.model';
import { CartService } from '../../services/cart/cart.service';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { ProductCardComponent } from 'src/app/components/product-card/product-card.component';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, ProductCardComponent, HeaderComponent],
})
export class HomePage implements OnInit, OnDestroy {
  products: Product[] = [];

  searchTerm = '';

  selectedCategoryId = 0;

  selectedFilter = 'Trending';

  currentBanner = 0;

  bannerInterval: any;

  filters = [
    'Trending',
    'Popular',
    'Latest',
    'Price Low → High',
    'Price High → Low',
    'Under ₹1000',
    '₹1000 - ₹5000',
    'Above ₹5000',
  ];
  banners: any[] = [];

  categories: any[] = [];
  filteredApiProducts: Product[] = [];
  isSearching = false;
  featuredProducts: Product[] = [];
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  async ngOnInit() {
    this.products = await this.productService.getProducts();
    this.featuredProducts = await this.productService.getFeaturedProducts();
    this.banners = await this.productService.getBanners();
    this.filteredApiProducts = [...this.products];

    const apiCategories = await this.productService.getCategories();

    this.categories = [
      {
        id: 0,
        name: 'All',
        icon: 'apps',
      },
      ...apiCategories.map((item: any) => ({
        id: Number(item.id),
        name: item.name,
        image_url: item.image_url,
      })),
    ];

    this.startBannerAutoSlide();
  }
  startBannerAutoSlide(): void {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }

    this.bannerInterval = setInterval(() => {
      this.currentBanner = (this.currentBanner + 1) % this.banners.length;
    }, 3000);
  }

  setBanner(index: number): void {
    this.currentBanner = index;
  }

  selectCategory(category: any): void {
    this.selectedCategoryId = Number(category.id);
  }

  selectFilter(filter: string): void {
    this.selectedFilter = filter;
  }

  get filteredProducts(): Product[] {
    let filtered = [...this.filteredApiProducts];

    if (this.selectedCategoryId > 0) {
      filtered = filtered.filter(
        (product: any) =>
          Number(product.category_id) === this.selectedCategoryId,
      );
    }

    switch (this.selectedFilter) {
      case 'Latest':
        filtered.sort((a: any, b: any) => Number(b.id) - Number(a.id));
        break;

      case 'Popular':
        filtered.sort(
          (a: any, b: any) => Number(b.rating || 0) - Number(a.rating || 0),
        );
        break;

      case 'Price Low → High':
        filtered.sort((a: any, b: any) => Number(a.price) - Number(b.price));
        break;

      case 'Price High → Low':
        filtered.sort((a: any, b: any) => Number(b.price) - Number(a.price));
        break;

      case 'Under ₹1000':
        filtered = filtered.filter((p) => Number(p.price) < 1000);
        break;

      case '₹1000 - ₹5000':
        filtered = filtered.filter(
          (p) => Number(p.price) >= 1000 && Number(p.price) <= 5000,
        );
        break;

      case 'Above ₹5000':
        filtered = filtered.filter((p) => Number(p.price) > 5000);
        break;
    }

    return filtered;
  }

  get cartCount(): number {
    return this.cartService.getCount();
  }

  ngOnDestroy(): void {
    if (this.bannerInterval) {
      clearInterval(this.bannerInterval);
    }
  }
  async onSearchChange() {
    console.log('SEARCH=', this.searchTerm);

    const keyword = this.searchTerm.trim();

    if (!keyword) {
      this.filteredApiProducts = [...this.products];
      return;
    }

    this.isSearching = true;

    try {
      this.filteredApiProducts =
        await this.productService.searchProducts(keyword);
    } finally {
      this.isSearching = false;
    }
  }
  clearSearch(): void {
    this.searchTerm = '';
    this.filteredApiProducts = [...this.products];
  }
}
