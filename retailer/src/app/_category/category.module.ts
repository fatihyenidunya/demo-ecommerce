import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryProductListComponent } from './category-product-list/category-product-list.component';
import { CategoryRoutingModule } from './category-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from './category.service';

@NgModule({
  declarations: [CategoryProductListComponent],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    CategoryRoutingModule
  ],
  providers: [CategoryService]
})
export class CategoryModule { }
