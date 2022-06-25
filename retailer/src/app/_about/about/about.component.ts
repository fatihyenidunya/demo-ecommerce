import { Component, OnInit } from '@angular/core';
import { AboutService } from '../about.service';

import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';



@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {


    about;
    imageTwo;
    nodejsApi;

    constructor(private aboutService: AboutService,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections


    ) {

        this.about = appConnections.general.aboutUs;
        this.imageTwo = appConnections.general.imageUrlTwo;
        this.nodejsApi = appConnections.nodejsApi;



    }


    ngOnInit() {
        window.scrollTo(0, 0);

    }





}
