import { Component, OnInit, Input, HostListener } from '@angular/core';
import { AuthService } from '../_auth/auth.service';
import { AppConnections } from '../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { NgForm } from '@angular/forms';
import { User } from '../_auth/model/user';
import { CartService } from '../_cart/cart.service';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrls: ['./upload.component.css']
})
export class UploadComponent implements OnInit {


  nodejsApi;
  hidden = true;

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


  constructor(private authService: AuthService,
    private route: ActivatedRoute,
    private router: Router,
    private appConnections: AppConnections,
    private cartService: CartService,
    private ngxSpinnerService: NgxSpinnerService


  ) {

    this.nodejsApi = appConnections.nodejsApi;







  }


  ngOnInit() {
    this.general = this.appConnections.general;
    // this.imageUrl = this.nodejsApi + '/' + this.general.imageUrlTwo;

    this.registerId = this.route.snapshot.params.id;

  }


  getClientIP() {
    this.cartService.getIPAddress().subscribe((res: any) => {
      this.clientIp = res.ip;


    });
  }


  onGo() {
    this.router.navigate(['/register']);
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




}
