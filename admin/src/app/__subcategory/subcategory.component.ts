import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { CategoryService } from '../_category/category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../__server-error/server-error.component';

@Component({
  selector: 'app-subcategory',
  templateUrl: './subcategory.component.html',
})
export class SubCategoryComponent implements OnInit {

  @Input() categoryId: string;
  @Input() category: string;
  @Input() categoryNameLower:string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;

  subCategories;
  subCategory = {
    isTopCategory: false,
    name: '',
    mainPage: false,
    topCategoryId: '',
    topCategoryName: '',
    publish: true,
    _id: '',

  }

  disable = true;
  subEdit = false;

  constructor(private modalService: NgbModal, private activeModal: NgbActiveModal, private categoryService: CategoryService) { }

  ngOnInit() {

    this.getSubcategories(this.categoryId);
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

  getSubcategories(categoryId) {

    this.categoryService.getSubCategoriesd(categoryId).subscribe((res: any) => {
      this.subCategories = res.categories;
      console.log(this.subCategories);
      this.disable = true;
    }, err => {
      if (err.status === 401) {

      } else {
        alert(JSON.stringify(err));
      }
    });


  }




  delete(categoryId): void {

    this.categoryService.deleted(categoryId).subscribe((res: any) => {
      this.getSubcategories(this.categoryId);
    }, err => {
      if (err.status === 401) {

      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }



  getSubCategory(category) {
    this.subCategory = category;
  }


  newSubCategory() {

    this.subCategory.isTopCategory = false;
    this.subCategory.name = '';
    this.subCategory.mainPage = false;
    this.subCategory.topCategoryId = '';
    this.subCategory.topCategoryName = '';
    this.subCategory.publish = true;

    this.disable = false;


  }

  updateSubcategory() {
    this.disable = false;
    this.subEdit = true;

  }

  saveSubcategory() {
    this.disable = false;

    this.subCategory.topCategoryId = this.categoryId;

    const formData = new FormData();
    formData.append('name', this.subCategory.name);
    formData.append('publish', String(this.subCategory.publish));
    formData.append('isTopCategory', String(this.subCategory.isTopCategory));
    formData.append('topCategoryId', String(this.subCategory.topCategoryId));
    // formData.append('turkishName', this.subCategory.turkishName);
    formData.append('topCategoryName', this.category);
    formData.append('topCategoryNameLower', this.categoryNameLower);

 
    if (this.subEdit === true) {



      this.categoryService.updated(this.subCategory._id, formData)
        .subscribe((res: any) => {
          this.getSubcategories(this.categoryId);
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {

          } else {
            alert(JSON.stringify(err));
          }
        });



    } else {
      this.categoryService.saved(formData)
        .subscribe((res: any) => {
          this.getSubcategories(this.categoryId);
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {


          } else {
            alert(JSON.stringify(err));
          }
        });
    }
  }




  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}