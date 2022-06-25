import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';
import { MenuService } from '../menu.service';
import { AppConnections } from '../../app.connections';
import { RoleService } from '../../user-role/role.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';

@Component({
  selector: 'app-not',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {


  menus;
  roles;
  selectedRole;
  roleMenus;
  header;

  disable = false;
  hide: boolean[] = [];
  constructor(private appConnections: AppConnections, private ngxIndexedDBService: NgxIndexedDBService, private roleService: RoleService, private menuService: MenuService) {

    this.selectedRole = 'Admin';

    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.getRoles();

    });


  }

  ngOnInit() {

    this.roles = this.appConnections.userRoles;
    if (this.selectedRole === 'Admin') {
      this.disable = false;
    }
    this.gets();
    this.getRoleMenus(this.selectedRole);
  }

  gets(): void {

    this.menuService.getsd().subscribe((res: any) => {
      this.menus = res.menus;

    }, err => {

    });
  }


  getRoleMenus(role): void {

    this.menuService.getRoleMenus(role).subscribe((res: any) => {
      this.roleMenus = res.menus;

      this.roleMenus.forEach(element => {
        this.menus.find(e => e.name === element.name).order = element.order;
        this.menus.find(e => e.name === element.name).hide = true;
      });



    }, err => {

    });


  }

  selectRole(status) {

    this.selectedRole = status;
    if (this.selectedRole === 'Admin') {
      this.disable = true;
    } else {
      this.disable = false;
    }
    this.gets();
    this.getRoleMenus(this.selectedRole);

  }

  getRoles() {
    this.roleService.getRoles(this.header).subscribe((res: any) => {
      this.roles = res.roles;

    });
  }


  saveMenu(order, menuName, menuId, menuLink, menuIcon) {


    const formData = new FormData();
    formData.append('link', menuLink);
    formData.append('icon', menuIcon);
    formData.append('role', this.selectedRole);
    formData.append('name', menuName);
    formData.append('order', order);

    this.menuService.newRoleMenu(formData)
      .subscribe((res: any) => {


      }, err => {
        console.log('the error ' + JSON.stringify(err));

      });

  }

}
