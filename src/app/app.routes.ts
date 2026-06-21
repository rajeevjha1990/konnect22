import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'home',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },

  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'cart',
    loadComponent: () =>
      import('./pages/cart/cart.page').then((m) => m.CartPage),
  },
  {
    path: 'checkout',
    loadComponent: () =>
      import('./pages/checkout/checkout.page').then((m) => m.CheckoutPage),
  },
  {
    path: 'order-success',
    loadComponent: () =>
      import('./pages/order-success/order-success.page').then(
        (m) => m.OrderSuccessPage,
      ),
  },
  {
    path: 'my-orders',
    loadComponent: () =>
      import('./pages/my-orders/my-orders.page').then((m) => m.MyOrdersPage),
  },
  {
    path: 'product-details/:id',
    loadComponent: () =>
      import('./pages/product-details/product-details.page').then(
        (m) => m.ProductDetailsPage,
      ),
  },
  {
    path: 'wishlist',
    loadComponent: () =>
      import('./pages/wishlist/wishlist.page').then((m) => m.WishlistPage),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/register/register.page').then((m) => m.RegisterPage),
  },
  {
    path: 'create-password',
    loadComponent: () =>
      import('./pages/create-password/create-password.page').then(
        (m) => m.CreatePasswordPage,
      ),
  },
  {
    path: 'profile',
    loadComponent: () =>
      import('./pages/profile/profile.page').then((m) => m.ProfilePage),
  },
  {
    path: 'my-addresses',
    loadComponent: () =>
      import('./pages/my-addresses/my-addresses.page').then(
        (m) => m.MyAddressesPage,
      ),
  },
  {
    path: 'new-address',
    loadComponent: () =>
      import('./pages/new-address/new-address.page').then(
        (m) => m.NewAddressPage,
      ),
  },
  {
    path: 'edit-address/:addressId',
    loadComponent: () =>
      import('./pages/new-address/new-address.page').then(
        (m) => m.NewAddressPage,
      ),
  },
];
