import { Injectable } from '@angular/core';
import * as Constants from '../../constant/app.constatnt';
import { RajeevhttpService } from '../http/rajeevhttp.service';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private rajeevHttp: RajeevhttpService) {}
  async ngOnInit() {
    // Any initialization logic can go here
  }
  async getCategories() {
    const url = Constants.PRODUCT_API_PATH + 'get_categories';
    const respData = await this.rajeevHttp.post(url, {});
    if (respData) {
      return respData.categoies;
    } else {
      return [];
    }
  }
  async getProducts(): Promise<any[]> {
    console.log('GET PRODUCTS START');
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_products';
      console.log('URL=', url);

      const apiResp = await this.rajeevHttp.post(url, {});
      if (apiResp && apiResp.products && Array.isArray(apiResp.products)) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,

          category_id: Number(item.category_id),
          rating: item.rating || 4.5,

          stock_quantity: item.stock_quantity,

          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('getProducts Error =>', error);
      return [];
    }
  }
  async getProductById(productId: number): Promise<any> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_product_by_id';

      const apiResp = await this.rajeevHttp.post(url, {
        product_id: productId,
      });

      console.log('getProductById API Response =>', apiResp);

      if (apiResp && apiResp.product) {
        const item = apiResp.product;

        return {
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,

          category_id: Number(item.category_id),

          rating: item.rating || 4.5,

          stock_quantity: item.stock_quantity,

          vendor_id: item.vendor_id,
        };
      }

      return null;
    } catch (error) {
      console.error('getProductById Error =>', error);
      return null;
    }
  }
  async getProductsByCategory(category: string): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_products_by_category';

      const apiResp = await this.rajeevHttp.post(url, { category });

      console.log('getProductsByCategory API Response =>', apiResp);

      if (apiResp && apiResp.products && Array.isArray(apiResp.products)) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,

          category_id: Number(item.category_id),

          rating: item.rating || 4.5,

          stock_quantity: item.stock_quantity,

          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('getProductsByCategory Error =>', error);
      return [];
    }
  }
  async searchProducts(keyword: string): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'search_products';

      const apiResp = await this.rajeevHttp.post(url, {
        keyword: keyword,
      });

      console.log('searchProducts API Response =>', apiResp);

      if (apiResp?.products && Array.isArray(apiResp.products)) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,
          category_id: Number(item.category_id) || 0,
          rating: item.rating || 4.5,
          stock_quantity: item.stock_quantity,
          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('searchProducts Error =>', error);
      return [];
    }
  }

  async getTrendingProducts(): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_trending_products';

      const apiResp = await this.rajeevHttp.post(url, {});

      console.log('getTrendingProducts API Response =>', apiResp);

      if (apiResp && apiResp.products && Array.isArray(apiResp.products)) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,

          category_id: Number(item.category_id),

          rating: item.rating || 4.5,

          stock_quantity: item.stock_quantity,

          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('getTrendingProducts Error =>', error);
      return [];
    }
  }
  async getProductsByVendor(vendorId: number): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_products_by_vendor';

      const apiResp = await this.rajeevHttp.post(url, { vendor_id: vendorId });

      console.log('getProductsByVendor API Response =>', apiResp);

      if (apiResp && apiResp.products && Array.isArray(apiResp.products)) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,

          category_id: Number(item.category_id) || 0,

          rating: item.rating || 4.5,

          stock_quantity: item.stock_quantity,

          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('getProductsByVendor Error =>', error);
      return [];
    }
  }
  async getProductsByPriceRange(
    minPrice: number,
    maxPrice: number,
  ): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_products_by_price_range';

      const apiResp = await this.rajeevHttp.post(url, {
        min_price: minPrice,
        max_price: maxPrice,
      });

      console.log('getProductsByPriceRange API Response =>', apiResp);

      if (apiResp && apiResp.products && Array.isArray(apiResp.products)) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,

          category_id: Number(item.category_id) || 0,

          rating: item.rating || 4.5,

          stock_quantity: item.stock_quantity,

          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('getProductsByPriceRange Error =>', error);
      return [];
    }
  }
  async getProductsByRating(minRating: number): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_products_by_rating';

      const apiResp = await this.rajeevHttp.post(url, {
        min_rating: minRating,
      });

      console.log('getProductsByRating API Response =>', apiResp);

      if (apiResp && apiResp.products && Array.isArray(apiResp.products)) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,

          category_id: Number(item.category_id) || 0,

          rating: item.rating || 4.5,

          stock_quantity: item.stock_quantity,

          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error('getProductsByRating Error =>', error);
      return [];
    }
  }
  async getFeaturedProducts(): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_featured_products';

      const apiResp = await this.rajeevHttp.post(url, {});

      if (apiResp?.products) {
        return apiResp.products.map((item: any) => ({
          id: item.id,
          name: item.name,
          description: item.description,
          price: Number(item.price),
          mrp: Number(item.mrp),

          image: item.image_webp
            ? this.rajeevHttp.UPLOADS + 'uploads/products/' + item.image_webp
            : 'assets/images/placeholder.png',

          image_webp: item.image_webp,
          category_id: Number(item.category_id) || 0,
          rating: item.rating || 4.5,
          stock_quantity: item.stock_quantity,
          vendor_id: item.vendor_id,
        }));
      }

      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
  async getBanners(): Promise<any[]> {
    try {
      const url = Constants.PRODUCT_API_PATH + 'get_banners';

      const apiResp = await this.rajeevHttp.post(url, {});

      if (apiResp?.banners) {
        return apiResp.banners.map((item: any) => ({
          id: item.id,
          title: item.title,
          image: item.image
            ? this.rajeevHttp.UPLOADS + 'uploads/banners/' + item.image
            : 'assets/images/placeholder.png',
          image_webp: item.image,
          link: item.link || '',
        }));
      }

      return [];
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
