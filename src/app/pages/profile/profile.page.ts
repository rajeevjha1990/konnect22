import { Component, OnInit } from '@angular/core';
import { SHARED_IONIC_MODULES } from 'src/app/shared/shared.ionic';
import { UserService } from 'src/app/services/user/user.service';
import { ToastController } from '@ionic/angular';
import { HeaderComponent } from 'src/app/components/header/header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
  standalone: true,
  imports: [...SHARED_IONIC_MODULES, HeaderComponent],
})
export class ProfilePage implements OnInit {
  isEditing = true;
  isLoading = false;
  isProfileCompleted = false;
  userData: any = {
    user_id: '',
    name: '',
    email: '',
    mobile: '',
    state: '',
    district: '',
    block: '',
    village: '',
    pincode: '',
  };
  originalData: any = {};

  constructor(
    private userService: UserService,
    private toastCtrl: ToastController,
  ) {}

  async ngOnInit() {
    await this.loadProfile();
  }

  async ionViewWillEnter() {
    await this.loadProfile();
  }

  async loadProfile(event?: any) {
    try {
      this.isLoading = true;

      const profile = await this.userService.getProfile();

      console.log('PROFILE DATA => ', profile);

      if (profile) {
        this.userData = {
          user_id: profile.user_id || '',
          name: profile.user_name || '',
          email: profile.user_email || '',
          mobile: profile.user_mobile || '',
          state: profile.user_state || '',
          district: profile.user_district || '',
          block: profile.user_block || '',
          village: profile.user_village || '',
          pincode: profile.user_pincode || '',
        };

        this.isProfileCompleted =
          !!profile.user_name && profile.user_name.trim() !== '';

        if (!this.isProfileCompleted) {
          this.isEditing = true;
        }

        this.originalData = JSON.parse(JSON.stringify(this.userData));
      }
    } catch (error) {
      console.error('Profile Load Error', error);

      this.showToast('Unable to load profile');
    } finally {
      this.isLoading = false;

      if (event) {
        event.target.complete();
      }
    }
  }

  enableEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.userData = JSON.parse(JSON.stringify(this.originalData));

    this.isEditing = false;
  }

  async saveProfile() {
    try {
      this.isLoading = true;

      const formData = {
        user_name: this.userData.name,
        user_email: this.userData.email,
        mobile: this.userData.mobile,
        state_id: this.userData.state,
        district_id: this.userData.district,
        block_id: this.userData.block,
        village: this.userData.village,
        pincode: this.userData.pincode,
      };

      await this.userService.profileUpdate(formData);

      const resp = await this.userService.profileUpdate(formData);

      console.log('UPDATE RESPONSE => ', resp);

      if (resp) {
        this.isEditing = false;

        await this.loadProfile();

        this.showToast('Profile updated successfully');
      }
    } catch (error) {
      console.error(error);

      this.showToast('Profile update failed');
    } finally {
      this.isLoading = false;
    }
  }

  async refreshProfile(event: any) {
    await this.loadProfile(event);
  }

  async logout() {
    await this.userService.logout();
  }

  async showToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 2000,
      position: 'bottom',
    });

    await toast.present();
  }
  toggleEdit() {
    this.isEditing = !this.isEditing;
  }
}
