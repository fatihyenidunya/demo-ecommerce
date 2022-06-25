import { Component, OnInit } from '@angular/core';
import { NotifyService } from '../notify.service';
import { AppConnections } from '../../app.connections';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { NgbdModalContent } from '../../__server-error/server-error.component';


@Component({
    selector: 'app-notify-list',
    templateUrl: './notify-list.component.html',
    styleUrls: ['./notify-list.component.scss']
})
export class NotifyListComponent implements OnInit {


    public pageNumber = 1;
    public pageSize = 20;
    endDate;
    startDate;

    startMonth = '1';
    startDay = '1';
    startYear = '2000';

    endMonth = '12';
    endDay = '30';
    endYear = '2030';
    totalItems = 0;


    public selectedStatus;
    public selectedNotifyFor;
    notifyFor;

    notifyList;

    // tslint:disable-next-line:max-line-length
    public statuses;



    public notifyFors = JSON.parse('[{"notify":"operation"},{"notify":"warehouse"}]');

    constructor(private notifyService: NotifyService,
        private modalService: NgbModal,
        private route: ActivatedRoute,
        private router: Router,
        private appConnections: AppConnections,

    ) {

        this.selectedStatus = this.route.snapshot.params.status;

        this.selectedNotifyFor = this.route.snapshot.params.notifyFor;

        this.statuses = JSON.parse('[{"status":"Hepsi"},{"status":"' + this.appConnections.PendingApproval + '"},{"status":"' + this.appConnections.OrderApproved + '"},{"status":"' + this.appConnections.GettingReady + '"},{"status":"' + this.appConnections.ShipmentApproved + '"},{"status": "' + this.appConnections.ShipmentSuccessed + '"},{"status":  "' + this.appConnections.CanceledWanted + '"},{"status":"' + this.appConnections.CanceledOkay + '"}]');

    }


    selectStartDate(date): void {

        this.pageNumber = 1;
        this.startMonth = this.startDate.month;
        this.startDay = this.startDate.day;
        this.startYear = this.startDate.year;

        // tslint:disable-next-line:max-line-length
        this.getQueryResults(this.notifyFor, this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    selectEndDate(date): void {

        this.pageNumber = 1;

        this.endMonth = this.endDate.month;
        this.endDay = this.endDate.day;
        this.endYear = this.endDate.year;


        // tslint:disable-next-line:max-line-length
        this.getQueryResults(this.notifyFor, this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    ngOnInit() {

        // tslint:disable-next-line:max-line-length
        this.getQueryResults(this.selectedNotifyFor, this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    changePage(show) {



        // tslint:disable-next-line:max-line-length
        this.getQueryResults(this.notifyFor, this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);


    }


    selectFor(notifyFor) {

        this.selectedNotifyFor = notifyFor;
        this.pageNumber = 1;
        // tslint:disable-next-line:max-line-length
        this.getQueryResults(notifyFor, this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }


    selectStatus(status) {

        this.selectedStatus = status;
        this.pageNumber = 1;
        // tslint:disable-next-line:max-line-length
        this.getQueryResults(this.selectedNotifyFor, this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    getQueryResults(notifyFor, page, status, startmonth, startday, startyear, endmonth, endday, endyear): void {



        // tslint:disable-next-line:max-line-length
        this.notifyService.getQueryResult(notifyFor, page, this.pageSize, status, startmonth, startday, startyear, endmonth, endday, endyear, 'all')
            .subscribe((res: any) => {

                this.notifyList = res.orderNotifyList;
                this.totalItems = res.totalItems;

            }, err => {

                if (err.status === 401) {
                    this.router.navigate(['/login']);
                } else {
                    this.showError(JSON.stringify(err));
                }
            });

    }

    nowPage(wantedPage): void {

        this.pageNumber = wantedPage;
        // tslint:disable-next-line:max-line-length
        this.getQueryResults(this.notifyFor, this.pageNumber, this.selectedStatus, this.startMonth, this.startDay, this.startYear, this.endMonth, this.endDay, this.endYear);

    }

    public showError(error) {
        const modalRef = this.modalService.open(NgbdModalContent);
        modalRef.componentInstance.name = error;
    }

}
