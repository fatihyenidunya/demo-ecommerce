import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirmation-cargo',
  templateUrl: './confirmation-cargo.component.html',
})
export class ConfirmationCargoComponent implements OnInit {

  @Input() customer: string;
  @Input() cargoCompany: string;
  @Input() trackingCode: string;
  @Input() deliveryAddress;
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
