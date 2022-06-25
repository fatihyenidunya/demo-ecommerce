import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../category.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';
import { AppConnections } from '../../app.connections';
import { Category, ICategory } from '../model/category';
import { SimpleTimer } from 'ng2-simple-timer';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { parse } from 'querystring';
import { NgForm } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { SubCategoryService } from '../../__subcategory/subcategory.service';


interface Alert {
  type: string;
  message: string;
}

const ALERTS: Alert[] = [];

@Component({
  selector: 'app-category-edit',
  templateUrl: './category-edit.component.html',
  styleUrls: ['./category-edit.component.scss']
})
export class CategoryEditComponent implements OnInit {

  constructor(private categoryService: CategoryService,
    private modalService: NgbModal,
    private route: ActivatedRoute,
    private router: Router,
    private apiConnections: AppConnections,
    private simpleTimer: SimpleTimer,
    private ngxIndexedDBService: NgxIndexedDBService,
    private confirmationService: ConfirmationDialogService,
    private subCategoryService:SubCategoryService

  ) {



    this.thisModule = this.categoryService.moduleName;



  }

  hide = true;

  public categories: ICategory[] = [];
  public subCategories: ICategory[] = [];
  public disable = true;
  public isEdit = false;
  public subEdit = false;
  public uploadPath = 'category';
  public thisModule;

  public picUrl;
  public info = '';
  public category = new Category();
  public subCategory = new Category();
  public selectedCategory;
  public selectedSubCategory;
  header;
  counter: number;
  topCategoryId: number;
  subDelete = true;
  categoryId;
  tabDisabled = false;


  alerts: Alert[] = [{
    type: '',
    message: '',
  }];
  categor: string;

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

      this.gets(this.header);

      this.prepared(this.header);
    });



  }



  edit(): void {
    this.disable = false;
    this.isEdit = true;

  }




  cleanData() {
    this.category.name = '';
    this.category.turkishName = '';

  }



  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
    console.log(error);
  }

  public confirmToDelete(isSubcategory: boolean) {

    let deleteId = this.categoryId;
    let deleteCategory = this.category.name;

    if (isSubcategory) {

      deleteId = this.subCategory._id;
      deleteCategory = this.subCategory.name;
    }


    this.confirmationService.confirm(deleteCategory, 'Silmek istediğinden eminmisin ?')
      .then((confirmed) => {
        if (confirmed === true) {
          this.delete(deleteId);
        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }


  delete(categoryId): void {

    this.categoryService.deleted(categoryId).subscribe((res: any) => {
      this.router.navigate(['../../category']);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  public showInfo() {
    if (this.isEdit === true) {
      this.alerts.push({
        type: 'info',
        message: 'The data has been updated',
      });
    } else {
      this.alerts.push({
        type: 'success',
        message: 'The data was saved succesfully',
      });
    }
    this.simpleTimer.newTimer('3sec', 1, false);
    this.simpleTimer.subscribe('3sec', () => this.callback());
  }


  private closeInfo() {
    if (this.isEdit === true) {
      this.alerts.splice(this.alerts.indexOf({
        type: 'info',
        message: 'The data has been updated',
      }), 1);
    } else {
      this.alerts.splice(this.alerts.indexOf({
        type: 'success',
        message: 'The data was saved succesfully',
      }), 1);
    }
  }

  alertClose(alert: Alert) {
    this.alerts.splice(this.alerts.indexOf(alert), 1);
  }

  alertReset() {
    this.alerts = Array.from(ALERTS);
    this.counter = 0;
  }

  callback() {
    this.counter--;
    if (this.counter === 0) {
      this.simpleTimer.delTimer('3sec');
      this.counter = 3;
      if (this.isEdit === true) {
        this.router.navigate(['../../category']);
      } else {
        this.alertReset();
        this.cleanData();
      }
    }
  }



  beforeChange($event: NgbTabChangeEvent) {


  }

  gets(header): void {

    this.categoryService.getsd(header).subscribe((res: any) => {


      this.categories = res.categories;


    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });

  }

  selectCategory(categoryId) {
    this.subCategory.topCategoryId = this.categoryId;
  }



  subCategoryEdit() {
    this.subEdit = true;
    this.hide = false;

    this.categoryService.getSubCategoriesd(this.categoryId).subscribe((res: any) => {
      this.subCategories = res.categories;
      console.log(this.subCategories);

    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });
  }

  selectSubCategory(subCategory: Category) {
    this.subCategory.name = subCategory.name;
    this.subCategory.turkishName = subCategory.turkishName;
    this.subCategory._id = subCategory._id;
    this.subDelete = false;
  }





  // nodejs start after that line


  prepared(header) {
    this.alertReset();
    this.counter = 3;
    this.categoryId = this.route.snapshot.params['id'];
    if (this.categoryId !== '0') {
      this.categoryService.getd(this.categoryId, header).subscribe((res: any) => {
        this.category = res.category;
        this.selectedCategory = res.category._id;


      }, err => {

        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          this.showError(JSON.stringify(err));
        }
      });

    } else {
      this.disable = false;
      this.tabDisabled = true;
      this.cleanData();
    }
  }


  OnSubmit(form: NgForm) {
    this.category.isTopCategory = true;

    const formData = new FormData();
    formData.append('name', this.category.name);
    formData.append('isTopCategory', String(this.category.isTopCategory));
    formData.append('publish', String(this.category.publish));
    formData.append('mainPage', String(this.category.mainPage));
    formData.append('topCategoryId', String(this.category.topCategoryId));
    formData.append('turkishName', this.category.turkishName);
    formData.append('topCategoryName', this.category.topCategoryName);
    formData.append('topCategoryNameLower', this.category.topCategoryNameLower);
    formData.append('title', this.category.title);
    formData.append('metaDescription', this.category.metaDescription);

    if (this.categoryId !== '0') {
      this.categoryService.updated(this.categoryId, formData)
        .subscribe((res: any) => {
          this.showInfo();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    } else {
      this.categoryService.saved(formData)
        .subscribe((res: any) => {
          this.showInfo();
          this.tabDisabled = false;
          this.gets(this.header);
          this.selectedCategory = res.categoryId;
          this.categoryId = res.categoryId;
          this.disable = true;
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    }
  }

  
  addSubCategory(id, category,categoryNameLower) {

    this.subCategoryService.confirm(id, category,categoryNameLower)
      .then((confirmed) => {
        if (confirmed === true) {

        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));


  }

  OnSubCategorySubmit(form: NgForm) {
    this.subCategory.isTopCategory = false;
    this.subCategory.isTopCategory = false;
    this.subCategory.topCategoryId = this.categoryId;

    const formData = new FormData();
    formData.append('name', this.subCategory.name);
    formData.append('publish', String(this.subCategory.publish));
    formData.append('isTopCategory', String(this.subCategory.isTopCategory));
    formData.append('topCategoryId', String(this.subCategory.topCategoryId));
    formData.append('turkishName', this.subCategory.turkishName);
    formData.append('topCategoryName', this.category.name);
    formData.append('topCategoryNameLower', this.category.nameLower);
    if (this.subEdit === true) {


      this.categoryService.updated(this.subCategory._id, formData)
        .subscribe((res: any) => {
          this.showInfo();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });



    } else {
      this.categoryService.saved(formData)
        .subscribe((res: any) => {
          this.showInfo();
        }, err => {
          console.log('the error ' + JSON.stringify(err));
          if (err.status === 401) {
            this.router.navigate(['/login']);
          } else {
            this.showError(JSON.stringify(err));
          }
        });
    }
  }

}
