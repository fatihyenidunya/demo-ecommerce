import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { CategoryService } from '../category.service';
import { ICategory } from '../model/category';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';
import { SubCategoryService } from '../../__subcategory/subcategory.service';

@Component({
  selector: 'app-category-list',
  templateUrl: './category-list.component.html',
  styleUrls: ['./category-list.component.scss']
})
export class CategoryListComponent implements OnInit {

  public categories: ICategory[] = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  header;


  constructor(private modalService: NgbModal, private router: Router, private subCategoryService: SubCategoryService, private ngxIndexedDBService: NgxIndexedDBService, private categoryService: CategoryService) {



  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;


      this.getsd(this.header);

    });
  }




  gets(): void {

    this.categoryService.gets().subscribe((res: any) => {
      this.categories = res;
      console.log(this.categories);
    }, err => {
      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }


  // nodejs start after that line

  getsd(header): void {

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


  subCategory(id, category,categoryNameLower) {

    this.subCategoryService.confirm(id, category,categoryNameLower)
      .then((confirmed) => {
        if (confirmed === true) {

        }
      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));


  }

}
