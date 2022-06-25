import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { CargoPriceService } from '../cargo-price.service';

import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cargo-price-list',
  templateUrl: './cargo-price-list.component.html',
  styleUrls: ['./cargo-price-list.component.scss']
})
export class CargoPriceListComponent implements OnInit {
  public cargoPrices = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;

  header;

  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private cargoPriceService: CargoPriceService) {



  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.header);

    });

  }

  gets(header): void {

    this.cargoPriceService.getsd(header).subscribe((res: any) => {
      this.cargoPrices = res.cargoPrices;
      console.log(this.cargoPrices);
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

}
