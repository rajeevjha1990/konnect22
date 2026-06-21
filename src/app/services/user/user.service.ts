import { Injectable } from '@angular/core';
import { RajeevhttpService } from '../http/rajeevhttp.service';
import { BehaviorSubject } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import * as Constants from '../../constant/app.constatnt';
import { User } from 'src/app/data-types/user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  userdata: any = '';
  mobile: any = '';
  public userObj = new User();
  public user: BehaviorSubject<User> = new BehaviorSubject<User>(this.userObj);
  public initialized = false;
  private authkey = '';
  constructor(
    private authServ: AuthService,
    private svjHttp: RajeevhttpService,
  ) {
    this.init();
  }

  async init() {
    this.loadFromStorage();
    this.authkey = await this.getAuthKey();
    if (this.authkey) {
      const user = await this.getUserProfileFromServer();
      if (user && user.user_id) {
        user.loggedIn = true;
        this.userObj = user;
        this.user.next(this.userObj);
        localStorage.setItem('user', JSON.stringify(this.userObj));
      }
    }
    this.initialized = true;
  }

  async getAuthKey() {
    if (!this.authkey) {
      this.authkey = await this.authServ.getAuthkey();
    }
    return this.authkey;
  }

  async login(logindata: any, showAlertOnSuccess: boolean = true) {
    const url = Constants.USER_API_PATH + 'login';
    const apiResp = await this.svjHttp.post(
      url,
      logindata,
      {},
      true,
      showAlertOnSuccess,
    );

    if (apiResp && apiResp.authkey) {
      this.authkey = apiResp.authkey;
      this.svjHttp.authkey = this.authkey;
      this.authServ.setAuthkey(this.authkey);
      await this.getUserProfileFromServer(false);
      this.initialized = true;
    }
    return apiResp;
  }

  async logout() {
    const url = Constants.USER_API_PATH + 'logout';
    console.log('LOGIN URL=', url);

    try {
      const apiResp: any = await this.svjHttp.post(url, {});
      if (!apiResp) {
        console.warn('Logout failed on server, token not cleared');
      }
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      this.authServ.clear();
      this.userObj = new User();
      this.user.next(this.userObj);
      this.initialized = false;
      localStorage.clear();
    }
  }

  async getUserProfile() {
    if (!this.userObj.user_name || this.userObj.user_name.length === 0) {
      await this.getUserProfileFromServer();
    }
    return this.userObj;
  }

  async getUserProfileFromServer(showAlert = true) {
    try {
      const url = Constants.USER_API_PATH + 'get_profile';
      const respData = await this.svjHttp.post(url, {}, {}, true, showAlert);

      console.log('Profile API:', respData);

      if (respData?.user?.user_id) {
        this.userObj = {
          user_id: respData.user.user_id,
          user_name: respData.user.user_name,
          user_mobile: respData.user.user_mobile,
          user_pincode: respData.user.user_pincode,
          user_status: respData.user.user_status,
          loggedIn: true,
        } as any;

        this.user.next(this.userObj);
        localStorage.setItem('user', JSON.stringify(this.userObj));
      } else {
        console.warn('User data not found');
      }

      return this.userObj;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      return this.userObj;
    }
  }
  async userRegistration(userdata: any) {
    const url = Constants.USER_API_PATH + 'user_register';
    const apiResp = await this.svjHttp.post(url, userdata);
    console.log(apiResp);
    return apiResp;
  }
  otpVerification(data: any) {
    const url = Constants.USER_API_PATH + 'verify_otp';
    return this.svjHttp.post(url, data);
  }
  async getProfile() {
    const url = Constants.USER_API_PATH + 'get_profile';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.user;
    } else {
      return {};
    }
  }
  async profileUpdate(formData: any) {
    const url = Constants.USER_API_PATH + 'update_profile';
    const apiResp = await this.svjHttp.post(url, formData);

    if (apiResp && apiResp.user) {
      this.userObj = apiResp.user;
      this.user.next(this.userObj);
      localStorage.setItem('user', JSON.stringify(this.userObj));
    }

    return apiResp;
  }
  async resetpassword(data: any) {
    const url = Constants.USER_API_PATH + 'reset_password';
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
  async checkMobileRegisterorNot(data: any) {
    const url = Constants.USER_API_PATH + 'check_mobile_registered';
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
  async sendOtpForRegistration(data: { mobile: string }) {
    const url = Constants.USER_API_PATH + 'user_register'; // Assuming this API endpoint exists
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
  loadFromStorage() {
    const u = JSON.parse(localStorage.getItem('user') || '{}');
    if (u && u.user_id) {
      this.userObj = u;
      this.user.next(this.userObj);
    }
  }
  async createPassword(data: any) {
    const url = Constants.USER_API_PATH + 'create_password';
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
  async saveAddress(addressdata: any) {
    const url = Constants.USER_API_PATH + 'save_address';
    const apiResp = await this.svjHttp.post(url, addressdata);
    return apiResp;
  }
  async getUserAddresses() {
    const url = Constants.USER_API_PATH + 'getAddresses';
    const respData = await this.svjHttp.post(url, {});
    if (respData) {
      return respData.addresses;
    } else {
      return [];
    }
  }
  async getAddress(addressId: any) {
    const data = {
      addressId: addressId,
    };
    const url = Constants.USER_API_PATH + 'get_address';
    const respData = await this.svjHttp.post(url, data);
    if (respData) {
      return respData.address;
    } else {
      return [];
    }
  }
  async deleteAddress(addressId: any) {
    const data = {
      addressId: addressId,
    };
    const url = Constants.USER_API_PATH + 'delete_address';
    const apiResp = await this.svjHttp.post(url, data);
    return apiResp;
  }
}
