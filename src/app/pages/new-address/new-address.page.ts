import { Component, OnInit } from '@angular/core';

import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UserService } from 'src/app/services/user/user.service';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-new-address',
  templateUrl: './new-address.page.html',
  styleUrls: ['./new-address.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class NewAddressPage implements OnInit {
  address = {
    type: 'home',
    mobile: '',
    pincode: '',
    landmark: '',
    address: '',
    is_default: true,
  };
  userdata: any;
  addressId: any = '';
  constructor(
    private toastController: ToastController,
    private userServ: UserService,
    private route: ActivatedRoute,
    private navCtrl: NavController,
  ) {}

  async ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      this.addressId = Number(params.get('addressId'));
    });
    if (this.addressId) {
      this.address = await this.userServ.getAddress(this.addressId);
      console.log(this.address);
    }
    this.userdata = await this.userServ.getProfile();
    this.address.mobile = this.userdata.user_mobile;
  }

  async saveAddress() {
    if (!this.address.mobile) {
      return this.showToast('Please enter mobile number');
    }

    if (!/^[0-9]{10}$/.test(this.address.mobile)) {
      return this.showToast('Mobile number must be 10 digits');
    }

    if (!this.address.pincode) {
      return this.showToast('Please enter pincode');
    }

    if (!/^[0-9]{6}$/.test(this.address.pincode)) {
      return this.showToast('Pincode must be 6 digits');
    }

    if (!this.address.address) {
      return this.showToast('Please enter address');
    }
    if (!this.address.landmark) {
      return this.showToast('Please enter landmark');
    }

    const resp = await this.userServ.saveAddress(this.address);
    if (resp.status == true) {
      this.navCtrl.navigateForward('/my-addresses');
      this.showToast('Address saved successfully');
    }
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }
}
