import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonContent,
  IonInput,
  IonItem,
  IonButton,
  AlertController,
  NavController,
} from '@ionic/angular/standalone';
import { ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user/user.service';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';

@Component({
  selector: 'app-create-password',
  templateUrl: './create-password.page.html',
  styleUrls: ['./create-password.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule], // Ensure CommonModule and FormsModule are here
})
export class CreatePasswordPage implements OnInit {
  password = '';
  confirmPassword = '';
  mobile = '';
  showPassword: boolean = false;
  showConfirmPassword = false;
  isSubmitting = false; // Submit state manage karne ke liye

  private route = inject(ActivatedRoute);
  private userService = inject(UserService);
  private alertCtrl = inject(AlertController);
  private navCtrl = inject(NavController);

  ngOnInit() {
    this.mobile = this.route.snapshot.queryParamMap.get('mobile') || '';
  }

  async createPassword() {
    if (this.isSubmitting) return; // Double click prevent karne ke liye

    if (!this.password || !this.confirmPassword) {
      this.showAlert('Error', 'Please fill all fields');
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.showAlert('Error', 'Password and Confirm Password must match');
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

      if (resp.status) {
        this.navCtrl.navigateRoot('/login');
      } else {
        console.error(resp.msg);
        this.showAlert('Error', resp.msg || 'Failed to create password');
      }
    } catch (error) {
      console.error('Exception in createPassword:', error);
      this.showAlert('Error', 'Something went wrong');
    } finally {
      this.isSubmitting = false; // Loader off karne ke liye
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
