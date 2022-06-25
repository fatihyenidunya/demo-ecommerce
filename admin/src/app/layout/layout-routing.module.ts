import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { AuthGuard } from '../__auth/auth.guard';
import { NotifyListComponent } from '../_notify/notify-list/notify-list.component';


const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        children: [
            { path: '', redirectTo: 'dashboard-retail', pathMatch: 'prefix' },
            // tslint:disable-next-line:max-line-length

            { path: 'dashboard-retail', loadChildren: '../_dashboard-retail/dashboard.module#DashboardModule' },
            // tslint:disable-next-line:max-line-length
            { path: 'category', loadChildren: '../_category/category.module#CategoryModule', canActivate: [AuthGuard], data: { roles: ['Admin', 'Customer'] } },
            { path: 'orderRetails', loadChildren: '../_order-retailer/order-retail.module#OrderRetailModule' },

            { path: 'bankaccount', loadChildren: '../_bank-account/bank-account.module#BankAccountModule' },
            { path: 'product', loadChildren: '../_product/product.module#ProductModule' },
            { path: 'comment', loadChildren: '../_comment/comment.module#CommentModule' },
            { path: 'cargo-company', loadChildren: '../_cargo-company/cargo-company.module#CargoCompanyModule' },
            { path: 'cargo-price', loadChildren: '../_cargo-price/cargo-price.module#CargoPriceModule' },
            { path: 'barber', loadChildren: '../_barber/barber.module#BarberModule' },
            // tslint:disable-next-line:max-line-length
            { path: 'warehouseRetail', loadChildren: '../_warehouse-retailer/warehouse-retail.module#WarehouseRetailModule' },
            { path: 'notifies', loadChildren: '../_notify/notify.module#NotifyModule' },
            { path: 'notificationemail', loadChildren: '../_notificationEmail/notificationemail.module#NotificationEmailModule' },
            { path: 'cargo', loadChildren: '../_cargo/cargo.module#CargoModule' },
            { path: 'slider', loadChildren: '../_slider/slider.module#SliderModule' },
            { path: 'payment', loadChildren: '../_payment/payment.module#PaymentModule' },
            { path: 'blog', loadChildren: '../_blog/blog.module#BlogModule' },
            { path: 'message', loadChildren: '../_message/message.module#MessageModule' },
            { path: 'chat', loadChildren: '../_chat/chat.module#ChatModule' },
            { path: 'video', loadChildren: '../_video/video.module#VideoModule' },
            { path: 'newsletter', loadChildren: '../_newsletter/newsletter.module#NewsletterModule' },
            { path: 'general', loadChildren: '../_general/general.module#GeneralModule' },
            { path: 'email', loadChildren: '../_email/email.module#EmailModule' },
            { path: 'setting', loadChildren: '../_setting/setting.module#SettingModule' },
            { path: 'sms', loadChildren: '../_sms/sms.module#SmsModule' },
            { path: 'error', loadChildren: '../_error/error.module#ErrorModule' },
            { path: 'charts', loadChildren: './charts/charts.module#ChartsModule' },
            
            { path: 'tables', loadChildren: './tables/tables.module#TablesModule' },
            { path: 'forms', loadChildren: './form/form.module#FormModule' },
            { path: 'bs-element', loadChildren: './bs-element/bs-element.module#BsElementModule' },
            { path: 'grid', loadChildren: './grid/grid.module#GridModule' },
            { path: 'components', loadChildren: './bs-component/bs-component.module#BsComponentModule' },
            { path: 'blank-page', loadChildren: './blank-page/blank-page.module#BlankPageModule' },
            // { path: 'user-signup', loadChildren: '../signup/signup.module#SignupModule' },
            { path: 'user-signup', loadChildren: '../user-signup/signup.module#SignupModule' },
            { path: 'user-role', loadChildren: '../user-role/role.module#RoleModule' },
            { path: 'notAuth', loadChildren: '../__notAuth/not.module#NotModule' },
            { path: 'menu', loadChildren: '../_menu/menu.module#MenuModule' },
            { path: 'error', loadChildren: '../server-error/server-error.module#ServerErrorModule' },
            { path: 'access-denied', loadChildren: '../access-denied/access-denied.module#AccessDeniedModule' },
            { path: 'not-found', loadChildren: '../not-found/not-found.module#NotFoundModule' },
            { path: '**', redirectTo: 'not-found' },




        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class LayoutRoutingModule { }
