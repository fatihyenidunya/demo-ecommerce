import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { SliderService } from '../slider.service';
import { ISlider } from '../model/slider';
import { AppConnections } from '../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import {  Router } from '@angular/router';


@Component({
  selector: 'app-slider-list',
  templateUrl: './slider-list.component.html',
  styleUrls: ['./slider-list.component.scss']
})
export class SliderListComponent implements OnInit {
  public sliders: ISlider[] = [];
  public total = 0;
  public currentPage = 1;
  public pageSize = 50;
  nodejsApi;
  imageApi;
  header;
  constructor(private modalService: NgbModal, private router: Router, private ngxIndexedDBService: NgxIndexedDBService, private sliderService: SliderService, private appConnections: AppConnections) {

    this.nodejsApi = appConnections.nodejsApi;
    this.imageApi = appConnections.imageApi;

  }

  ngOnInit() {



    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;

      this.gets(this.header);
    });


  }

  gets(header): void {

    this.sliderService.getsd(header).subscribe((res: any) => {
      this.sliders = res.sliders;
      console.log(this.sliders);
    }, err => {


      if (err.status === 401) {
        this.router.navigate(['/login']);
      } else {
        this.showError(err);
      }
    });


  }
  public showError(error) {
    const modalRef = this.modalService.open(NgbdModalContent);
    modalRef.componentInstance.name = error;
  }

}
