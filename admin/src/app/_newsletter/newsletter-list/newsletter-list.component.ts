import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { NewsletterService } from '../newsletter.service';
import { INewsletter } from '../model/newsletter';
import { AppConnections } from '../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';
import { ConfirmationDialogService } from '../../__confirm/confirmation-dialog.service';

@Component({
  selector: 'app-newsletter-list',
  templateUrl: './newsletter-list.component.html',
  styleUrls: ['./newsletter-list.component.scss']
})
export class NewsletterListComponent implements OnInit {
  public newsletters: INewsletter[] = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  nodejsApi;
  header;

  constructor(private modalService: NgbModal, private confirmationDialogService: ConfirmationDialogService, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private newsletterService: NewsletterService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;


  }

  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.header);

    });
  }




  gets(header): void {

    this.newsletterService.getsd(header).subscribe((res: any) => {
      this.newsletters = res.newsletters;
      console.log(this.newsletters);
    }, err => {


      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }


    });


  }


  onSendNewsletter(newsletterId, title) {

    this.newsletterService.sendNewsletterViaEmail(newsletterId, this.header).subscribe((res: any) => {
      // this.newsletters = res.newsletters;
      // console.log(this.newsletters);
      this.mailSendedConfirm(title, ' Kampanya maili müşterilere gönderişmiştir.')

    }, err => {


      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(JSON.stringify(err));
      }


    });


  }


  public mailSendedConfirm(message1, message2) {

    this.confirmationDialogService.confirm(message1, message2)
      .then((confirmed) => {

      })
      .catch(() => console.log('User dismissed the dialog (e.g., by using ESC, clicking the cross icon, or clicking outside the dialog)'));
  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
