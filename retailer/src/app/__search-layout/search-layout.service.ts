import { Injectable } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchLayoutComponent } from './search-layout.component';

@Injectable()
export class SearchLayoutService {

  constructor(private modalService: NgbModal) { }

  modalRef;


  public confirm(
    title: string,
    message: string,
    btnOkText: string = 'OK',
    btnCancelText: string = 'Cancel',
    dialogSize: 'sm' | 'lg' = 'lg'): Promise<boolean> {
    this.modalRef = this.modalService.open(SearchLayoutComponent, { size: dialogSize });
    this.modalRef.componentInstance.title = title;
    this.modalRef.componentInstance.message = message;
    this.modalRef.componentInstance.btnOkText = btnOkText;
    this.modalRef.componentInstance.btnCancelText = btnCancelText;

    return this.modalRef.result;
  }

  public clos() {
    this.modalRef.dismiss();
  }



}
