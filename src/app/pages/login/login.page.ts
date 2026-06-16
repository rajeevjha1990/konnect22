import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, CommonModule, FormsModule],
})
export class LoginPage implements OnInit {
  loginData = {
    mobile: '',
    password: '',
  };

  isSubmitting = false;
  showPassword = false;
  loginError = '';

  private navCtrl = inject(NavController);
  private userService = inject(UserService);

  constructor() {}

  ngOnInit() {}

  async login() {
    if (this.isSubmitting) {
      return;
    }

    this.loginError = '';

    if (
      this.loginData.mobile.trim().length !== 10 ||
      !this.loginData.password.trim()
    ) {
      this.loginError = 'Enter valid mobile number and password';
      return;
    }

    this.isSubmitting = true;

    try {
      const resp: any = await this.userService.login(this.loginData, false);

      if (
        resp &&
        (resp.status === true || resp.status === 1 || resp.status === '1')
      ) {
        if (resp.user_id) {
          localStorage.setItem('user_id', resp.user_id);
        }

        this.loginError = '';
        this.navCtrl.navigateRoot('/home');
        return;
      }

      if (resp?.verify_required === true) {
        this.navCtrl.navigateForward('/register', {
          queryParams: {
            mobile: this.loginData.mobile,
          },
        });
        return;
      }

      this.loginError = resp?.msg || 'Invalid mobile number or password';
    } catch (error) {
      this.loginError = 'Unable to connect to server. Please try again.';
    } finally {
      this.isSubmitting = false;
    }
  }
}
