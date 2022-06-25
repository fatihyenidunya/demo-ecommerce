import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppConnections } from './app.connections';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {


    header;
    userName;

    constructor(private appConnections: AppConnections,
        private route: ActivatedRoute,
        private router: Router,
        private ngxIndexedDBService: NgxIndexedDBService, private httpClient: HttpClient) {

        this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

            this.header = user.oUserToken;
            this.userName = user.oUserName;

            // alert(this.header);
            // if (this.header === '') {

            //     this.router.navigate(['login']);

            // }


        });

    }

    ngOnInit() {
    }


}
