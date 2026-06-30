import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.page.html',
  styleUrls: ['./create-password.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule],
})
export class CreatePasswordPage implements OnInit {
  password = '';
  confirmPassword = '';
  mobile = '';

  showPassword = false;
  showConfirmPassword = false;
  isSubmitting = false;

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private alertCtrl = inject(AlertController);
  private navCtrl = inject(NavController);

  ngOnInit() {
    this.mobile = this.route.snapshot.queryParamMap.get('mobile') || '';
  }

  async createPassword() {
    if (this.isSubmitting) {
      return;
    }

    if (!this.password || !this.confirmPassword) {
      await this.showAlert('Error', 'Please fill all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      await this.showAlert('Error', 'Password and Confirm Password must match');
      return;
    }

    this.isSubmitting = true;

    try {
      const payload = {
        mobile: this.mobile,
        password: this.password,
        confirm_password: this.confirmPassword,
      };

      const resp: any = await this.userService.createPassword(payload);

      const success = resp?.status === true;

      if (success) {
        await this.showAlert('Success', resp?.msg);

        this.navCtrl.navigateRoot('/login');
      } else {
        await this.showAlert('Error', resp?.msg || 'Failed to create password');
      }
    } catch (error: any) {
      console.error(error);

      await this.showAlert(
        'Error',
        error?.error?.msg || error?.message || 'Something went wrong',
      );
    } finally {
      this.isSubmitting = false;
    }
  }

  async showAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
