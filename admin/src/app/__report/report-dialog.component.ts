import { Component, Input, OnInit } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { DashboardService } from '../_dashboard-retail/dashboard.service';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AppConnections } from '../app.connections';
import { NotificationEmailService } from '../_notificationEmail/notificationemail.service';

@Component({
  selector: 'app-report-dialog',
  templateUrl: './report-dialog.component.html',
})
export class ReportDialogComponent implements OnInit {

  @Input() title: string;
  @Input() message: string;
  @Input() btnOkText: string;
  @Input() btnCancelText: string;
  header;
  selectedMonth;
  selectedYear;
  months;
  years;
  reportTypes;
  selectedReportType;

  notification;
  disabledMonthly = false;

  detailReportSetting = {
    type: '',
    year: '',
    month: '',
    email: ''
  };

  constructor(private activeModal: NgbActiveModal, private notificationEmailService: NotificationEmailService, private appConnections: AppConnections, private ngxIndexedDBService: NgxIndexedDBService, private dashboardService: DashboardService) { }


  ngOnInit() {
    this.ngxIndexedDBService.getByID('users', 1).subscribe((user) => {

      this.header = user.oUserToken;
      this.months = this.appConnections.months;
      this.years = this.appConnections.years;
      this.reportTypes = this.appConnections.reportTypes;

      const date = new Date();
      this.selectedMonth = this.months.find(x => x.number === date.getMonth() + 1);
      this.selectedYear = this.years.find(x => x.year === date.getFullYear().toString());
      this.selectedReportType = this.reportTypes.find(x => x.type === 'Aylik');


      this.detailReportSetting.type = this.selectedReportType;
      this.detailReportSetting.month = this.selectedMonth;
      this.detailReportSetting.year = this.selectedYear;

      this.getNotificationEmailWhatFor('rapor');
    });
  }



  public accept() {


    this.activeModal.close(this.detailReportSetting);
  }

  public dismiss() {
    this.activeModal.dismiss();
  }


  selectMonth(selectedMonth) {
    this.detailReportSetting.month = selectedMonth;

  }


  selectYear(selectedYear) {


    this.detailReportSetting.year = selectedYear;

  }


  selectReportType(selectedReportType) {

    if (selectedReportType.type === 'Yillik') {
      this.disabledMonthly = true;
    } else {
      this.disabledMonthly = false;
    }

    this.detailReportSetting.type = selectedReportType;

  }

  monthlyRevenue(month, lastDay, year): void {

    this.dashboardService.getMonthlyRevenue(month, lastDay, year, this.header).subscribe((res: any) => {



    }, err => {


    });
  }


  getNotificationEmailWhatFor(whatFor): void {

    this.notificationEmailService.getNotificationEmailWhatFor(whatFor, this.header).subscribe((res: any) => {

      this.notification = res.emails;



      for (const _email of this.notification) {
        this.detailReportSetting.email += _email.email + ',';
      }







      this.detailReportSetting.email = this.detailReportSetting.email.substring(0, this.detailReportSetting.email.length - 1);


    }, err => {


    });
  }

}
