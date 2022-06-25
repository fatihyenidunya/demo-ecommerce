import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { CargoCompanyService } from '../cargo-company.service';
import { ICargoCompany } from '../model/cargoCompany';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cargo-company-list',
  templateUrl: './cargo-company-list.component.html',
  styleUrls: ['./cargo-company-list.component.scss']
})
export class CargoCompanyListComponent implements OnInit {
  public cargoCompanies: ICargoCompany[] = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;

  header;

  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private cargoCompanyService: CargoCompanyService) {



  }

  ngOnInit() {

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.gets(this.header);

    });

  }

  gets(header): void {

    this.cargoCompanyService.getsd(header).subscribe((res: any) => {
      this.cargoCompanies = res.cargoCompanies;
      console.log(this.cargoCompanies);
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
