import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { EditComponent } from './edit';
import { NgDateRangePickerOptions } from 'ng-daterangepicker';

@Component({
  selector: 'app-report',
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class ReportComponent implements OnInit {

  @ViewChild(EditComponent)
  public readonly editComponent: EditComponent;

  bonds;
  columns = [];

  today = new Date();
  startDate: Date = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  endDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  options: NgDateRangePickerOptions;
  // '01/03/2017-31/03/2017'
  dateRange;

  totalLiability = 0;
  totalNet = 0;
  totalGross = 0;
  totalBuf = 0;

  private start;
  private end;

  constructor(private af: AngularFire) {}

  ngOnInit() {
    this.startDate.setHours(0, 0, 0, 0);
    this.endDate.setHours(23, 59, 59, 999);

    this.start = new BehaviorSubject<number>(this.startDate.getTime());
    this.end = new BehaviorSubject<number>(this.endDate.getTime());

    this.options = {theme: 'default', range: 'tm'};
    this.queryBonds();
  }

  filterResults() {
    // console.log(this.dateRange);
    if (this.dateRange !== undefined) {
      const dates = this.dateRange.split('-');
      const start = dates[0];
      const end = dates[1];
      const startDayMonthYear = start.split('/');
      const endDayMonthYear = end.split('/');
      const isoStartDate = startDayMonthYear[2] + '-' + startDayMonthYear[1] + '-' + startDayMonthYear[0];
      const isoEndDate = endDayMonthYear[2] + '-' + endDayMonthYear[1] + '-' + endDayMonthYear[0];
      // 5 is UTC timezone offset
      this.startDate = new Date(isoStartDate + 'T00:00-05:00');
      // this.startDate.setHours(0, 0, 0, 0);
      this.endDate = new Date(isoEndDate + 'T23:59-05:00');
      // this.endDate.setHours(23, 59, 59, 999);
    }
    this.start.next(this.startDate.getTime());
    this.end.next(this.endDate.getTime());
    // this.queryBonds();
  }

  print() {
    window.print();
  }

  add() {
    let bond = {dateCreated: new Date().getTime()};
    this.editComponent.show(bond, false);
  }
  edit(bond) {
    this.editComponent.show(bond, true);
  }

  queryBonds() {
    this.bonds = this.af.database.list('/bonds', {
      query: {
        orderByChild: 'dateCreated',
        startAt: this.start,
        endAt: this.end
      }
    })
    .map(list => {
      // this.bonds = list;
      let totalLiability = 0, totalNet = 0, totalBuf = 0, totalGross = 0;

      // after an update it adds the item here until a full refresh
      list = list.filter(item => {
        return item.$key !== undefined;
      });

      for (let bond of list) {

        if (bond.power) {
          bond.power = bond.power.toUpperCase();
          if (bond.power.indexOf('-') === -1) {
            bond.power = bond.power.slice(0,4) + '-' + bond.power.slice(4);
          }
        }
        totalLiability += parseFloat(bond.amount);

        bond.gross = bond.amount * 0.1;
        totalGross += bond.gross;

        bond.net = bond.amount * 0.01;
        if (bond.net < 10) {
          bond.net = 10;
        }
        totalNet += bond.net;

        bond.buf = bond.amount * 0.005;
        if (bond.buf < 5) {
          bond.buf = 5;
        }
        totalBuf += bond.buf;

        if (bond.defendant) {
          let fullName = this.toTitleCase(bond.defendant);
          this.cleanLegacyName(bond, fullName, 'defendant');
        }

        if (bond.indemnitor) {
          let fullName = this.toTitleCase(bond.indemnitor);
          this.cleanLegacyName(bond, fullName, 'indemnitor');
        }

        this.cleanPhone(bond);
      }

      this.sort(list, 'power');

      this.totalBuf = totalBuf;
      this.totalLiability = totalLiability;
      this.totalGross = totalGross;
      this.totalNet = totalNet;

      return list;
    });
  }

  parseDate(dateString: string): Date {
      if (dateString) {
          return new Date(dateString);
      } else {
          return null;
      }
  }

  isDate(dateVal) {
    let d = new Date(dateVal);
    return d.toString() === 'Invalid Date' ? false : true;
  }

  private sort(array, field) {
    array.sort((a, b) => {
      if (a[field] > b[field]) {
        return 1;
      }
      if (a[field] < b[field]) {
          return -1;
      }
      return 0;
    });
  }

  private cleanPhone(bond) {
    if (bond.phone !== undefined) {
      bond.phone = bond.phone.replace(/_/g, '');
    }
    if (bond.indPhone !== undefined) {
      bond.indPhone = bond.indPhone.replace(/_/g, '');
    }
  }

  private cleanLegacyName(bond, name, type) {
    if (name.indexOf(',') > -1) {
      let names = name.split(',');
      bond[type + 'Last'] = names[0].trim();
      names = names[1].trim().split(' ');
      bond[type + 'First'] = names[0];
      if (names.length > 1) {
        bond[type + 'Middle'] = names[1];
      }
    } else {
      let names = name.split(' ');
      bond[type + 'First'] = names[0];
      if (names.length > 2) {
        bond[type + 'Middle'] = names[1];
        bond[type + 'Last'] = names[2];
      } else {
        bond[type + 'Last'] = names[1];
      }
    }
  }

  private toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
