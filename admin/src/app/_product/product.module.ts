import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';
import { ProductEditComponent } from './product-edit/product-edit.component';
import { ProductListComponent } from './product-list/product-list.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';
import { AngularEditorModule } from '@kolkov/angular-editor';
import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { ProductService } from './product.service';
// import { ProductUploadComponent } from '../__upload/product/product-upload.component';


@NgModule({

  // declarations: [ProductEditComponent,ProductListComponent,ProductUploadComponent],
  declarations: [ProductEditComponent, ProductListComponent],
  imports: [
    CommonModule,
    FormsModule,
    NgbModule,


    ReactiveFormsModule,
    ProductRoutingModule,
    AngularEditorModule,

  ],
  providers: [ProductService, ConfirmationDialogService,
    ErrorHandlerService]
  // providers: [ProductService, ConfirmationDialogService,
  //   ErrorHandlerService, ProductUploadComponent]
})
export class ProductModule { }
