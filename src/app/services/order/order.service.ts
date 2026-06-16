import { Injectable } from '@angular/core';
import * as Constants from '../../constant/app.constatnt';
import { RajeevhttpService } from '../http/rajeevhttp.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private rajeevHttp: RajeevhttpService) {}

  async placeOrder(orderdata: any) {
    const url = Constants.ORDER_API_PATH + 'place_order';
    const apiResp = await this.rajeevHttp.post(url, orderdata);
    console.log(apiResp);
    return apiResp;
  }
  async myOrders() {
    const url = Constants.ORDER_API_PATH + 'my_orders';

    const apiResp = await this.rajeevHttp.post(url, {});

    if (apiResp?.orders?.length) {
      return apiResp.orders.map((row: any) => ({
        ...row,
        image: row.image_webp
          ? this.rajeevHttp.BASE_URL + 'uploads/products/' + row.image_webp
          : 'assets/images/product-placeholder.svg',
      }));
    }

    return [];
  }
  async cancelOrder(orderId: number) {
    const data = {
      order_id: orderId,
    };
    const url = Constants.ORDER_API_PATH + 'cancel_order';
    return await this.rajeevHttp.post(url, data);
  }
}
