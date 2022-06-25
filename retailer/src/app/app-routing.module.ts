import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { UploadComponent } from './upload/upload.component';
import { AuthGuard } from './_auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { HomeComponent } from './home/home/home.component';
import { CategoryProductListComponent } from './category/category-product-list/category-product-list.component';
import { ProfileComponent } from './profile/profile/profile.component';
import { ProductComponent } from './product/product/product.component';
import { OrderListComponent } from './order/order-list/order-list.component';
import { PaymentComponent } from './cart/payment/payment.component';
import { CartComponent } from './cart/cart/cart.component';
import { ChatComponent } from './chat/chat/chat.component';
import { AgreementComponent } from './agreement/agreement/agreement.component';
import { MyaddressComponent } from './myaddress/myaddress/myaddress.component';
import { ContactComponent } from './contact/contact/contact.component';
import { AboutComponent } from './about/about/about.component';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { MediaComponent } from './media/media/media.component';
import { PrivacyComponent } from './privacy/privacy/privacy.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [


      { path: '', component: HomeComponent, pathMatch: 'full', canActivate: [AuthGuard] },
      { path: 'category/:category', component: CategoryProductListComponent },
      { path: 'product/:id', component: ProductComponent },
      // { path: 'auth', loadChildren: () => import('../_auth/auth.module').then(m => m.AuthModule) },
      { path: 'order/:id', component: OrderListComponent },
      { path: 'cart', component: CartComponent },
      { path: 'payment', component: PaymentComponent },
      { path: 'chat/:id', component: ChatComponent },
      { path: 'address/:id', component: MyaddressComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'contact', component: ContactComponent },
      { path: 'about', component: AboutComponent },
      { path: 'blog', component: BlogListComponent },
      { path: 'privacy', component: PrivacyComponent },
      { path: 'blog/:id', component: BlogDetailComponent },
  
      { path: 'media', component: MediaComponent },


    ]
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'upload/:id', component: UploadComponent },
  { path: 'agreement/:orderId', component: AgreementComponent },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { onSameUrlNavigation: 'reload' })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
