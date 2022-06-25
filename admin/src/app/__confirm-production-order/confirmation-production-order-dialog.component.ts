import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-production-order-dialog',
  templateUrl: './confirmation-production-order-dialog.component.html',
})
export class ConfirmationProductionOrderDialogComponent implements OnInit {

  @Input() company: string;
  @Input() title: string;
  @Input() messageHead1: string;
  @Input() message1: string;
  @Input() messageHead2: string;
  @Input() message2: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;


  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
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

}
