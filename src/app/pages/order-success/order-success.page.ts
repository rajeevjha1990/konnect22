import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-order-success',
  templateUrl: './order-success.page.html',
  styleUrls: ['./order-success.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class OrderSuccessPage implements OnInit {
  order: any = null;

  constructor(
    private router: Router,
    private orderService: OrderService,
  ) {}

  async ngOnInit() {
    try {
      const data: any = await this.orderService.myOrders();

      console.log('ORDER SUCCESS DATA =>', data);

      if (Array.isArray(data) && data.length > 0) {
        this.order = data[0];
      } else if (data) {
        this.order = data;
      }
    } catch (error) {
      console.error('ORDER SUCCESS ERROR =>', error);
    }
  }

  continueShopping() {
    this.router.navigateByUrl('/home', {
      replaceUrl: true,
    });
  }

  viewOrders() {
    this.router.navigateByUrl('/my-orders');
  }
}
