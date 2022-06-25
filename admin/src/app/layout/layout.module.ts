import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { NgbDropdownModule, NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SimpleTimer } from 'ng2-simple-timer';
import { LayoutRoutingModule } from './layout-routing.module';
import { LayoutComponent } from './layout.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { HeaderComponent } from './components/header/header.component';


import { ConfirmationProductionOrderDialogComponent } from '../__confirm-production-order/confirmation-production-order-dialog.component';
import { AuthGuard } from '../__auth/auth.guard';
import { HttpModule } from '@angular/http';
import { ProductStockPopupService } from '../__product-stock-popup/product-stock-popup.service';
import { ProductStockPopupComponent } from '../__product-stock-popup/product-stock-popup-component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';



// tslint:disable-next-line:max-line-length
// tslint:disable-next-line:max-line-length


@NgModule({
    imports: [
        CommonModule,
        LayoutRoutingModule,
        TranslateModule,
        NgbDropdownModule,
        HttpModule,
        NgbModule,
        FormsModule,
        ReactiveFormsModule


    ],


    // tslint:disable-next-line:max-line-length
    declarations: [LayoutComponent, SidebarComponent, ProductStockPopupComponent, HeaderComponent,  ConfirmationProductionOrderDialogComponent],
    providers: [SimpleTimer, AuthGuard, ProductStockPopupService],
    entryComponents: [ ConfirmationProductionOrderDialogComponent, ProductStockPopupComponent]
})
export class LayoutModule { }
