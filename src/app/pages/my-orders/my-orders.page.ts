import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.page.html',
  styleUrls: ['./my-orders.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class MyOrdersPage implements OnInit {
  orders: any[] = [];
  isLoading = false;

  constructor(
    private router: Router,
    private orderService: OrderService,
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  ionViewWillEnter() {
    this.loadOrders();
  }

  async loadOrders() {
    try {
      this.isLoading = true;

      const orders: any[] = await this.orderService.myOrders();

      console.log('MY ORDERS =>', orders);

      if (orders && orders.length > 0) {
        const groupedOrders: any = {};

        orders.forEach((row: any) => {
          const orderId = row.id;

          if (!groupedOrders[orderId]) {
            groupedOrders[orderId] = {
              id: row.id,
              order_no: row.order_no,
              total: row.total,
              status: row.status,
              payment_mode: row.payment_mode,
              created_at: row.created_at,
              items: [],
            };
          }

          groupedOrders[orderId].items.push({
            product_id: row.product_id,
            name: row.name,
            image: row.image,
            quantity: Number(row.qty || 1),
            price: Number(row.price || 0),
          });
        });

        this.orders = Object.values(groupedOrders);

        console.log('GROUPED ORDERS =>', this.orders);
      } else {
        this.orders = [];
      }
    } catch (error) {
      console.error('ORDER ERROR =>', error);
      this.orders = [];
    } finally {
      this.isLoading = false;
    }
  }
  continueShopping() {
    this.router.navigate(['/home']);
  }

  viewOrder(order: any) {
    console.log('ORDER DETAILS =>', order);
  }
  async cancelOrder(order: any) {
    const resp = await this.orderService.cancelOrder(order.id);

    if (resp?.status) {
      order.status = 'Cancelled';
    }
  }
}
