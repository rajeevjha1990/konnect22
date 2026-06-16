import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';

import { CartService } from 'src/app/services/cart/cart.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { OrderService } from 'src/app/services/order/order.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, FormsModule, HeaderComponent],
})
export class CheckoutPage implements OnInit {
  cart: any[] = [];

  customer = {
    name: '',
    mobile: '',
    address: '',
    city: '',
    pincode: '',
    landmark: '',
  };

  selectedPayment = 'cod';
  deliveryCharge = 0;
  discount = 100;
  estimatedDelivery = 'Tomorrow';
  isSubmitting = false; // Form submit state track karne ke liye

  private cartService = inject(CartService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private navCtrl = inject(NavController);

  constructor(private alertCtrl: AlertController) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
    this.calculateDelivery();
  }

  calculateDelivery(): void {
    const subtotal = this.getTotal();
    this.deliveryCharge = subtotal > 5000 ? 0 : 99;
  }

  selectPayment(method: string): void {
    this.selectedPayment = method;
  }

  getTotal(): number {
    return this.cart.reduce(
      (sum, item) => sum + Number(item.price) * Number(item.quantity),
      0,
    );
  }

  getFinalTotal(): number {
    const total = this.getTotal() + this.deliveryCharge - this.discount;
    return total > 0 ? total : 0;
  }

  async placeOrder(): Promise<void> {
    if (this.isSubmitting) return; // Double click validation

    if (
      !this.customer.name.trim() ||
      !this.customer.mobile.trim() ||
      !this.customer.address.trim() ||
      !this.customer.city.trim() ||
      !this.customer.pincode.trim()
    ) {
      await this.showAlert('Please fill all fields');
      return;
    }

    if (!/^[0-9]{10}$/.test(this.customer.mobile)) {
      await this.showAlert('Please enter valid mobile number');
      return;
    }

    if (!/^[0-9]{6}$/.test(this.customer.pincode)) {
      await this.showAlert('Please enter valid pincode');
      return;
    }

    if (this.cart.length === 0) {
      await this.showAlert('Your cart is empty');
      return;
    }

    const order = {
      order_id: 'ORD' + Date.now(),
      customer_name: this.customer.name,
      mobile: this.customer.mobile,
      address: this.customer.address,
      city: this.customer.city,
      pincode: this.customer.pincode,
      landmark: this.customer.landmark,
      items: JSON.stringify(this.cart),
      subtotal: this.getTotal(),
      delivery_charge: this.deliveryCharge,
      discount: this.discount,
      total_amount: this.getFinalTotal(),
      payment_method: this.selectedPayment,
      estimated_delivery: this.estimatedDelivery,
      status: 'Pending',
      created_at: new Date().toISOString(),
    };

    this.isSubmitting = true; // Spinner on ho jayega aur button disable ho jayega

    try {
      const response: any = await this.orderService.placeOrder(order);
      console.log('ORDER RESPONSE => ', response);

      if (response && (response.status === true || response.status === 200)) {
        localStorage.setItem('lastOrder', JSON.stringify(response));
        this.cartService.clearCart();
        console.log('CART CLEARED');

        // Navigating with root replace to clear history stack smoothly
        await this.router.navigateByUrl('/my-orders', {
          replaceUrl: true,
        });
      } else {
        await this.showAlert(response?.msg || 'Failed to place order');
      }
    } catch (error) {
      console.error('ORDER ERROR => ', error);
      await this.showAlert('Unable to place order. Please try again.');
    } finally {
      this.isSubmitting = false; // Operation khatam hone par loader off
    }
  }

  async showAlert(msg: string): Promise<void> {
    const alert = await this.alertCtrl.create({
      header: 'Notice',
      message: msg,
      buttons: ['OK'],
    });
    await alert.present();
  }
}
