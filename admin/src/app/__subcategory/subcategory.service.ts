import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { SubCategoryComponent } from './subcategory.component';

@Injectable()
export class SubCategoryService {

  constructor(private modalService: NgbModal) { }

  public confirm(
    categoryId: string,
    category: string,
    categoryNameLower:string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm'|'lg' = 'lg'): Promise<boolean> {
    const modalRef = this.modalService.open(SubCategoryComponent, { size: dialogSize });
    modalRef.componentInstance.categoryId = categoryId;
    modalRef.componentInstance.category = category;
    modalRef.componentInstance.categoryNameLower = categoryNameLower;
    modalRef.componentInstance.btnOkText = btnOkText;
    modalRef.componentInstance.btnCancelText = btnCancelText;

    return modalRef.result;
  }

}
