import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryEditComponent } from './category-edit/category-edit.component';
import { CategoryRoutingModule } from './category-routing.module';
import { CategoryListComponent } from './category-list/category-list.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';

import { ConfirmationDialogComponent } from '../__confirm/confirmation-dialog.component';
import { ConfirmationDialogService } from '../__confirm/confirmation-dialog.service';
import { ErrorHandlerService } from '../__error/error-handler.service';
import { CategoryService } from './category.service';

import { SubCategoryComponent } from '../__subcategory/subcategory.component';
import { SubCategoryService } from '../__subcategory/subcategory.service';


@NgModule({
  declarations: [CategoryEditComponent, CategoryListComponent,SubCategoryComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryRoutingModule
  ],
  providers:[CategoryService, ConfirmationDialogService,SubCategoryService,
    ErrorHandlerService],
    entryComponents:[SubCategoryComponent]
})
export class CategoryModule { }
