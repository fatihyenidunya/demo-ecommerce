import { Component, Output, EventEmitter, OnInit, NgZone, ViewChild } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { MenuService } from '../../../_menu/menu.service';
import { AppConnections } from '../../../app.connections';
import { NgxIndexedDBService } from 'ngx-indexed-db';


@Component({
    selector: 'app-sidebar',
    templateUrl: './sidebar.component.html',
    styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
    isActive: boolean;
    collapsed: boolean;
    showMenu: string;
    pushRightClass: string;

    public _loggedIn = false;
    menus;


    @Output() collapsedEvent = new EventEmitter<boolean>();

    constructor(private translate: TranslateService, private ngxIndexedDBService: NgxIndexedDBService, private appConnections: AppConnections, public router: Router, zone: NgZone, private menuService: MenuService) {
        this.router.events.subscribe(val => {
            if (
                val instanceof NavigationEnd &&
                window.innerWidth <= 992 &&
                this.isToggled()
            ) {
                this.toggleSidebar();
            }
        });





    }

    public login() {

    }

    public logout() {

    }



    ngOnInit() {
        this.isActive = false;
        this.collapsed = false;
        this.showMenu = '';
        this.pushRightClass = 'push-right';

        this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {


            this.getRoleMenus(user.oUserRole);
        });

        // this.getRoleMenus(this.appConnections.userRole);
    }

    getRoleMenus(role): void {

        this.menuService.getRoleMenus(role).subscribe((res: any) => {
            this.menus = res.menus;


        }, err => {

        });


    }

    eventCalled() {
        this.isActive = !this.isActive;
    }

    addExpandClass(element: any) {
        if (element === this.showMenu) {
            this.showMenu = '0';
        } else {
            this.showMenu = element;
        }
    }

    toggleCollapsed() {
        this.collapsed = !this.collapsed;
        this.collapsedEvent.emit(this.collapsed);
    }

    isToggled(): boolean {
        const dom: Element = document.querySelector('body');
        return dom.classList.contains(this.pushRightClass);
    }

    toggleSidebar() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle(this.pushRightClass);
    }

    rltAndLtr() {
        const dom: any = document.querySelector('body');
        dom.classList.toggle('rtl');
    }

    changeLang(language: string) {
        this.translate.use(language);
    }

    onLoggedout() {
        localStorage.removeItem('isLoggedin');
    }
}
