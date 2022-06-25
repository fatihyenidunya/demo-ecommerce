import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-confirmation-payment',
  templateUrl: './confirmation-payment.component.html',
})
export class ConfirmationPaymentComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() cardNumber: string;
  @Input() grandTotal: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;







  constructor(private activeModal: NgbActiveModal) { }

  ngOnInit() {
  }

  public decline() {
    this.activeModal.close(false);
  }

  public accept() {
    const reasonElement = (document.getElementById('reason') as HTMLInputElement);



    this.activeModal.close(true);
  }

  public dismiss() {
    this.activeModal.dismiss(false);
  }

}