import { Component, Input, OnInit, Output, ViewChild } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AppService } from '../app.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConnections } from '../app.connections';
import { Subscription } from 'rxjs';
import { MessageService } from '../message.service';

@Component({
  selector: 'app-search-layout',
  templateUrl: './search-layout.component.html',
})
export class SearchLayoutComponent implements OnInit {
  @ViewChild('auto') auto;

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  subscription: Subscription;


  searchProducts;
  keyword = 'title';
  nodejsApi;


  constructor(private activeModal: NgbActiveModal, private messageService: MessageService, private appConnections: AppConnections, private appService: AppService, private router: Router) { }

  ngOnInit() {
    this.nodejsApi = this.appConnections.nodejsApi;
    this.subscription = this.messageService.getDissmissSignal().subscribe(signal => {
   
      if (signal.close === true) {

        
        this.activeModal.dismiss();



      }
    });
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

  selectEvent(item) {
    // do something with selected item

    this.router.navigate(['/product', item.titleLower + '&' + item._id]);

  }

  onChangeSearch(val: string) {
    // fetch remote data from here
    // And reassign the 'data' which is binded to 'data' property.


    this.appService.getSearchResult(val).subscribe((res: any) => {
      this.searchProducts = res.products;
    });
  }

  onFocused(e) {
    // do something when input is focused

    e.stopPropagation();
    this.auto.clear();
  }



}