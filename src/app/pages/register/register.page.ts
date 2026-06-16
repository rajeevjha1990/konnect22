import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AlertController, NavController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule],
})
export class RegisterPage implements OnInit {
  registerData = {
    mobile: '',
    otp: '',
  };

  isOtpSent = false;
  isSubmitting = false; // API call state track karne ke liye

  constructor(
    private alertCtrl: AlertController,
    private navCtrl: NavController,
    private userService: UserService,
  ) {}

  ngOnInit() {}

  private validateMobile(): string | null {
    const mobile = String(this.registerData.mobile || '').trim();

    if (!mobile) {
      return 'Mobile number is required.';
    }
    if (!/^[0-9]{10}$/.test(mobile)) {
      return 'Enter a valid 10-digit mobile number.';
    }
    return null;
  }

  private validateOtp(): string | null {
    const otp = String(this.registerData.otp || '').trim();

    if (!otp) {
      return 'OTP is required.';
    }
    if (!/^[0-9]{4,6}$/.test(otp)) {
      return 'Enter a valid OTP (4 to 6 digits).';
    }
    return null;
  }

  async sendOtp() {
    console.log('SEND OTP CLICKED', this.registerData);

    if (this.isSubmitting) return; // Double click prevent karne ke liye

    const mobileError = this.validateMobile();
    if (mobileError) {
      await this.presentAlert('Error', mobileError);
      return;
    }

    this.isSubmitting = true;

    try {
      const resp: any = await this.userService.userRegistration({
        user_mobile: this.registerData.mobile,
      });

      if (resp?.status) {
        if (resp.exists && resp.verified == 1) {
          await this.presentAlert('Info', resp.msg);
          this.navCtrl.navigateRoot('/login');
          return;
        }

        // OTP screen show karo
        this.isOtpSent = true;
      } else {
        await this.presentAlert('Error', resp?.msg || 'Request failed');
      }
    } catch (error: any) {
      console.log('Exception in sendOtp:', error);
      await this.presentAlert('Error', error?.error?.msg || 'Server error');
    } finally {
      this.isSubmitting = false; // Loader band karne ke liye
    }
  }

  async verifyAndRegister() {
    console.log('VERIFY OTP CLICKED', this.registerData);

    if (this.isSubmitting) return; // Double click prevent karne ke liye

    const mobileError = this.validateMobile();
    if (mobileError) {
      await this.presentAlert('Error', mobileError);
      return;
    }

    const otpError = this.validateOtp();
    if (otpError) {
      await this.presentAlert('Error', otpError);
      return;
    }

    this.isSubmitting = true;

    try {
      const resp: any = await this.userService.otpVerification({
        mobile: this.registerData.mobile,
        otp: this.registerData.otp,
      });

      if (resp?.status) {
        this.navCtrl.navigateForward('/create-password', {
          queryParams: {
            mobile: this.registerData.mobile,
          },
        });
      } else {
        await this.presentAlert('Error', resp?.msg || 'Invalid OTP');
      }
    } catch (error: any) {
      console.log('Exception in verifyAndRegister:', error);
      await this.presentAlert(
        'Error',
        error?.error?.msg || 'Verification failed',
      );
    } finally {
      this.isSubmitting = false; // Loader band karne ke liye
    }
  }

  async presentAlert(header: string, message: string) {
    const alert = await this.alertCtrl.create({
      header,
      message,
      buttons: ['OK'],
    });

    await alert.present();
  }
}
