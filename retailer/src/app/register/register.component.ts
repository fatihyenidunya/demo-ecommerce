import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { AppConnections } from '../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { User } from '../_auth/model/user';
import { CartService } from '../_cart/cart.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AppComponent } from '../app.component';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {


  nodejsApi;
  hidden = true;
  disable = true;
  login: any;
  user = new User();
  general;
  clientIp;
  imageUrl;
  registerId;
  imageFile;
  documentUrl;

  registerBtn = false;
  documentBtn = true;

  registerPage = false;
  documentPage = true;
  hideMessage = true;
  hideEmpty = true;

  showForMobile = false;

  cities;
  states = [];
  selectedCity;
  selectedState;
  registerBtnDisabled = false;


  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private cartService: CartService,
    private ngxSpinnerService: NgxSpinnerService,
    private appComponent: AppComponent,



  ) {

    this.nodejsApi = appConnections.nodejsApi;

    this.appComponent.showForMobile = true;
    this.cities = this.appConnections.cities.sort((a, b) => a.name.localeCompare(b.name, undefined, { caseFirst: "upper" }));
    this.selectedCity = this.cities[0];
    this.selectCity(this.selectedCity);
    this.selectState(this.states[0]);


  }


  selectCity(selected) {

    this.states = [];

    for (let state of this.appConnections.states) {

      if (state.il_id === selected.id) {
        this.states.push(state);
      }
    }

    this.states = this.states.sort((a, b) => a.name.localeCompare(b.name, undefined, { caseFirst: "upper" }));
    this.selectedCity = selected;


  }

  selectState(selected) {

    this.selectedState = selected;


  }

  @HostListener('window:resize', ['$event'])
  // tslint:disable-next-line:typedef
  onListenWindowSize(event) {


    if (event.target.innerWidth < 768) {

      this.appComponent.showForMobile = true;
      this.showForMobile = true;

    }

    if (event.target.innerWidth >= 768) {

      this.appComponent.showForMobile = true;
      this.showForMobile = false;

    }

    if (event.target.innerWidth >= 992) {

      this.appComponent.showForMobile = true;
      this.showForMobile = false;

    }
    if (event.target.innerWidth >= 1200) {

      this.appComponent.showForMobile = true;
      this.showForMobile = false;

    }

  }

  ngOnInit() {
    this.general = this.appConnections.general;
    this.getScreenWidthForInit();
  }



  getScreenWidthForInit() {



    if (window.innerWidth < 768) {

      this.showForMobile = true;
    }

    if (window.innerWidth >= 768) {

      this.showForMobile = true;
    }

    if (window.innerWidth >= 992) {

      this.showForMobile = false;
    }
    if (window.innerWidth >= 1200) {

      this.showForMobile = false;
    }
  }

  // tslint:disable-next-line:typedef
  setEmptyHeight() {
    let height = '0vh';
    alert(window.screen.width)

    if (window.screen.width < 768) {
      height = '100vh';

      alert(window.screen.width)

    }

    if (window.screen.width >= 768) {
      height = '100vh';
      alert(window.screen.width)
    }

    if (window.screen.width >= 992) {
      height = '100vh';
      alert(window.screen.width)
    }
    if (window.screen.width >= 1200) {
      height = '0vh';

    }
    return height;
  }


  getClientIP() {
    this.cartService.getIPAddress().subscribe((res: any) => {
      this.clientIp = res.ip;


    });
  }


  handleImageFile(files) {
    console.log(files.target.files[0]);
    this.imageFile = files.target.files[0];
    const formData = new FormData();

    formData.append('image', this.imageFile);

    this.authService.uploadDocumentImage(this.registerId, formData)
      .subscribe((res: any) => {
        console.log(res);
        this.documentUrl = res.document;
        this.hidden = false;


      }, err => {
        console.log('the error ' + JSON.stringify(err));
        if (err.status === 401) {
          this.router.navigate(['/login']);
        } else {
          // this.showError(JSON.stringify(err));
        }
      });

  }


  OnSubmit(form: NgForm) {



    this.ngxSpinnerService.show();

    this.cartService.getIPAddress().subscribe((res: any) => {
      this.clientIp = res.ip;

      const formData = new FormData();
      formData.append('name', this.user.name);
      formData.append('surname', this.user.surname);
      formData.append('company', this.user.company);
      formData.append('tcId', this.user.tcId);
      formData.append('taxPlace', this.user.taxPlace);
      formData.append('taxNo', this.user.taxNo);
      formData.append('phone', this.user.phone);
      formData.append('countryCode', 'Tr');
      formData.append('country', 'Turkiye');
      formData.append('city', this.selectedCity.name);
      formData.append('state', this.selectedState.name);
      formData.append('openAddress', this.user.openAddress);
      formData.append('password', this.user.password);
      formData.append('email', this.user.email);
      formData.append('ip', this.clientIp);

      this.authService.signup(formData)
        .subscribe((result: any) => {
          this.ngxSpinnerService.hide();

          this.registerId = result.userId;
          this.disable = false;

          this.hideMessage = false;
          this.registerBtn = true;
          this.documentBtn = false;
          this.registerPage = true;
          this.documentPage = false;
          this.registerBtnDisabled = true;

          // this.resetForm();
        }, err => {

          this.ngxSpinnerService.hide();

          console.log(err);

          // this.showError(err.message);
        });
    });
  }


}
