import { Component, Input, OnInit, Output } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-agreement-error-dialog',
  templateUrl: './agreement-error-dialog.component.html',
})
export class AgreementErrorDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
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


    const result = {
      confirmed: true,
      reason: reasonElement.value
    };

    this.activeModal.close(result);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }

}