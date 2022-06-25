import { Component, OnInit, Input, HostListener, ViewChild } from '@angular/core';
import { AppService } from './app.service';
import { AppConnections } from './app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { constants } from 'buffer';
import { Form } from '@angular/forms';
import { AppModel } from './appModel';
import { SocialAuthService } from 'angularx-social-login';
import { SocialUser } from 'angularx-social-login';
import { MessageService } from './message.service';
import { CartService } from './_cart/cart.service';
import { Subscription } from 'rxjs';
import { DomSanitizer, Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public isChange = false;
  public isSubMenuChange = false;

  categories;
  keyword = 'title';
  public showForMobile = false;

  nodejsApi;
  general;
  generalId = '5f3cb9f31466dc04807ea01a';

  topCategory;
  subCategories;


  constructor(private appService: AppService,
    private appConnections: AppConnections,
    private titleService: Title,
    private metaService: Meta,



  ) {

    this.nodejsApi = this.appConnections.nodejsApi;
    this.getGeneral();
    this.getScreenWidthForInit();
 


  }


  public clickMenu() {
    this.isChange = !this.isChange;
    this.isSubMenuChange = false;


  }

  public clickSubMenu(topCategory, subCategories) {
    this.isSubMenuChange = !this.isSubMenuChange;
    this.topCategory = topCategory;
    this.subCategories = subCategories;


  }

  public closeMenu() {
    this.isSubMenuChange = false;
    this.isChange = !this.isChange;
  }


  getGeneral(): void {

    this.appService.getGeneral(this.generalId).subscribe((res: any) => {
      this.general = res.general;
      this.appConnections.general = res.general;

      this.titleService.setTitle(this.general.title);
      this.metaService.updateTag({ name: 'description', content: this.general.metaDescription });

     

    }, err => {


    });
  }
  getScreenWidthForInit() {




    if (window.innerWidth < 768) {

      this.showForMobile = false;
    }

    if (window.innerWidth >= 768) {

      this.showForMobile = false;
    }

    if (window.innerWidth >= 992) {

      this.showForMobile = true;
    }
    if (window.innerWidth >= 1200) {

      this.showForMobile = true;
    }
  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line:typedef
  onListenWindowSize(event) {



    if (event.target.innerWidth < 768) {

      this.showForMobile = false;
  
    }

    if (event.target.innerWidth >= 768) {

      this.showForMobile = false;
     
    }

    if (event.target.innerWidth >= 992) {

      this.showForMobile = true;
    }
    if (event.target.innerWidth >= 1200) {

      this.showForMobile = true;
    }

  }

  getCategoriesForMenu(): void {

    this.appService.getCategoriesForMenu().subscribe((res: any) => {
      this.categories = res.categories;

     


    }, err => {
      // this.showError(err.error);
    });
  }


  // tslint:disable-next-line:use-lifecycle-interface
  ngOnInit() {
    this.getCategoriesForMenu();
  }

  onChange(text) {




  }



  signOut() {


    // this.router.navigate(['/dealer/login']);

  }






}
