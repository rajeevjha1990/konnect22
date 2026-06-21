import { Component, OnInit, inject } from '@angular/core';
import { HeaderComponent } from 'src/app/components/header/header.component';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { AlertController, ToastController } from '@ionic/angular';
@Component({
  selector: 'app-my-addresses',
  templateUrl: './my-addresses.page.html',
  styleUrls: ['./my-addresses.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class MyAddressesPage implements OnInit {
  addresses: any[] = [];
  selectedAddress: any = null;

  private userServ = inject(UserService);
  constructor(
    private alertCtrl: AlertController,
    private toastCtrl: ToastController,
  ) {}

  async ngOnInit() {
    await this.loadAddresses();
  }
  async ionViewDidEnter() {
    await this.loadAddresses();
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
  isSelected(address: any): boolean {
    return Number(this.selectedAddress?.id) === Number(address.id);
  }
  selectAddress(address: any): void {
    this.selectedAddress = address;
  }
  async removeAddress(id: number) {
    const alert = await this.alertCtrl.create({
      header: 'Delete Address',
      message: 'Are you sure you want to delete this address?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            try {
              const resp = await this.userServ.deleteAddress(id);

              await this.showMessage(
                resp.msg || 'Server response not received',
              );

              if (resp.status) {
                await this.loadAddresses();
              }
            } catch (error: any) {
              await this.showMessage(
                error?.error?.msg || error?.message || 'Server error',
              );
            }
          },
        },
      ],
    });

    await alert.present();
  }
  async showMessage(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2500,
      position: 'bottom',
    });

    await toast.present();
  }
}
