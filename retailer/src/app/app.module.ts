import { Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxSpinnerModule } from 'ngx-spinner';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppConnections } from './app.connections';
import { AppService } from './app.service';
import { ToastrModule } from 'ngx-toastr';
import { NgxSocialShareModule } from 'ngx-social-share';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { LayoutComponent } from './layout/layout.component';
import { AutocompleteLibModule } from 'angular-ng-autocomplete';
import { AuthGuard } from './_auth/auth.guard';
import { CategoryService } from './category/category.service';
import { CategoryProductListComponent } from './category/category-product-list/category-product-list.component';
import { HomeComponent } from './home/home/home.component';
import { HomeService } from './home/home.service';
import { ProfileComponent } from './profile/profile/profile.component';
import { ProfileService } from './profile/profile.service';
import { ProductComponent } from './product/product/product.component';
import { ProductService } from './product/product.service';
import { OrderListComponent } from './order/order-list/order-list.component';
import { OrderService } from './order/order.service';
import { ConfirmationDialogService } from './__confirm/confirmation-dialog.service';
import { ConfirmationPaymentService } from './__confirm-payment/confirmation-payment.service';
import { AgreementDialogService } from './__agreement/agreement-dialog.service';
import { AgreementErrorDialogService } from './__agreement-error/agreement-error-dialog.service';
import { PaymentComponent } from './cart/payment/payment.component';
import { CartComponent } from './cart/cart/cart.component';
import { CartService } from './cart/cart.service';
import { ErrorDialogService } from './__error/error-dialog.service';
import { ChatComponent } from './chat/chat/chat.component';
import { ChatService } from './chat/chat.service';
import { MyaddressComponent } from './myaddress/myaddress/myaddress.component';
import { MyaddressService } from './myaddress/myaddress.service';
import { ContactComponent } from './contact/contact/contact.component';
import { ContactService } from './contact/contact.service';
import { AboutComponent } from './about/about/about.component';
import { AboutService } from './about/about.service';
import { BlogDetailComponent } from './blog/blog-detail/blog-detail.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogService } from './blog/blog.service';
import { MediaComponent } from './media/media/media.component';
import { MediaService } from './media/media.service';
import { SearchLayoutService } from './__search-layout/search-layout.service';
import { SearchLayoutComponent } from './__search-layout/search-layout.component';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { GoogleMapsAngularModule } from 'google-maps-angular';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    LayoutComponent,
    SearchLayoutComponent,
    HomeComponent,
    ProfileComponent,
    ProductComponent,
    OrderListComponent,
    CategoryProductListComponent,
    PaymentComponent,
    CartComponent,
    ChatComponent,
    MyaddressComponent,
    ContactComponent,
    AboutComponent,
    BlogDetailComponent,
    BlogListComponent,
    MediaComponent,
    
  ],
  imports: [

    CommonModule,

    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    NgbModule,
    FormsModule,
    NgxSpinnerModule,
    NgxSocialShareModule,
    AutocompleteLibModule,
    GoogleMapsAngularModule.forRoot({googleMapsKey: 'AIzaSyDQW5XIsNywuzuYe85RqMrT6_5S2lLzWmg'})


  ],
  // tslint:disable-next-line:max-line-length
  providers: [AppConnections,NgbActiveModal, AppService, MediaService,AgreementErrorDialogService, BlogService, AboutService, ContactService, MyaddressService, ChatService, ErrorDialogService, CartService, ConfirmationDialogService,ConfirmationPaymentService,SearchLayoutService,AgreementDialogService, OrderService, ProductService, ProfileService, CategoryService, HomeService, AuthGuard, Title],
  bootstrap: [AppComponent]
})
export class AppModule { }
