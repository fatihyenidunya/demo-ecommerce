import { Component, OnInit, Input, HostListener } from '@angular/core';

import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { MediaService } from '../media.service';

import { NgForm } from '@angular/forms';

@Component({
    selector: 'app-media',
    templateUrl: './media.component.html',
    styleUrls: ['./media.component.css']
})
export class MediaComponent implements OnInit {



    medias;
 
    constructor(

        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections,
        public sanitizer: DomSanitizer,
        private mediaService: MediaService

    ) {

     
        this.getMedias();

    

    }


    ngOnInit() {


        window.scrollTo(0, 0);

    }

    getMedias(): void {

        this.mediaService.getMedias().subscribe((res: any) => {
            this.medias = res.medias;

        

            this.medias.forEach(v => {

                v.videoUrl = this.getTrustedUrl(v.videoUrl);
            });
        }, err => {
            // this.showError(err.error);
        });

    }



    getTrustedUrl(url: any) {
        return this.sanitizer.bypassSecurityTrustResourceUrl(url);
    }









}
