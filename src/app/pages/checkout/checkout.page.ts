import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { CartService } from 'src/app/services/cart/cart.service';
import { OrderService } from 'src/app/services/order/order.service';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.page.html',
  styleUrls: ['./checkout.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, FormsModule, HeaderComponent],
})
export class CheckoutPage implements OnInit {
  cart: any[] = [];
  addresses: any[] = [];
  selectedAddress: any = null;
  selectedPayment = 'cod';
  deliveryCharge = 0;
  discount = 100;
  estimatedDelivery = 'Tomorrow';
  isSubmitting = false;
  private cartService = inject(CartService);
  private router = inject(Router);
  private orderService = inject(OrderService);
  private userServ = inject(UserService);
  constructor(private alertCtrl: AlertController) {}

  ngOnInit(): void {
    this.loadCart();
    this.loadAddresses();
  }

  loadCart(): void {
    this.cart = this.cartService.getCart();
    this.calculateDelivery();
  }

  async loadAddresses() {
    try {
      this.addresses = await this.userServ.getUserAddresses();

      console.log('ADDRESSES =>', this.addresses);

      if (this.addresses && this.addresses.length > 0) {
        this.selectedAddress = this.addresses[0];

        console.log('DEFAULT SELECTED =>', this.selectedAddress);
      }
    } catch (error) {
      console.error('ADDRESS LOAD ERROR =>', error);
    }
  }

  calculateDelivery(): void {
    const subtotal = this.getTotal();
    this.deliveryCharge = subtotal > 5000 ? 0 : 99;
  }

  selectPayment(method: string): void {
    this.selectedPayment = method;
  }

  selectAddress(address: any): void {
    this.selectedAddress = address;
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
    if (this.isSubmitting) return;

    if (!this.selectedAddress) {
      await this.showAlert('Please select delivery address');
      return;
    }

    if (this.cart.length === 0) {
      await this.showAlert('Your cart is empty');
      return;
    }

    const order = {
      order_id: 'ORD' + Date.now(),

      address_id: this.selectedAddress.id,
      mobile: this.selectedAddress.mobile,
      address_type: this.selectedAddress.type,
      address: this.selectedAddress.address,
      pincode: this.selectedAddress.pincode,
      landmark: this.selectedAddress.landmark,

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

    this.isSubmitting = true;

    try {
      const response: any = await this.orderService.placeOrder(order);

      if (response && (response.status === true || response.status === 200)) {
        localStorage.setItem('lastOrder', JSON.stringify(response));

        this.cartService.clearCart();

        await this.router.navigateByUrl('/my-orders', {
          replaceUrl: true,
        });
      } else {
        await this.showAlert(response?.msg || 'Failed to place order');
      }
    } catch (error) {
      console.error(error);
      await this.showAlert('Unable to place order');
    } finally {
      this.isSubmitting = false;
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
  isSelected(address: any): boolean {
    return Number(this.selectedAddress?.id) === Number(address.id);
  }
}
