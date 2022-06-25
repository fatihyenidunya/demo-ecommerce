import { Component, OnInit, Input, HostListener } from '@angular/core';

import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { Chat } from '../model/chat';
import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-privacy',
    templateUrl: './privacy.component.html',
    styleUrls: ['./privacy.component.css']
})
export class PrivacyComponent implements OnInit {


    constructor(
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections


    ) {




    }


    ngOnInit() {


    }


}
