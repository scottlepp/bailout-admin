import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-report',
  templateUrl: './report.html',
  styleUrls: ['./report.css']
})
export class ReportComponent implements OnInit {

  bonds;
  columns = [];

  today = new Date();
  startDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  endDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  totalLiability = 0;
  totalNet = 0;
  totalGross = 0;
  totalBuf = 0;

  private start = new BehaviorSubject<number>(this.startDate.getTime());
  private end = new BehaviorSubject<number>(this.endDate.getTime());

  constructor(private af: AngularFire) {}

  ngOnInit() {
    this.queryBonds();
  }

  filterResults() {
    this.start.next(this.startDate.getTime());
    this.end.next(this.endDate.getTime());
    // this.queryBonds();
  }

  print() {
    window.print();
  }

  queryBonds() {
    let bonds = this.af.database.list('/bonds', {
      query: {
        orderByChild: 'dateCreated',
        startAt: this.start,
        endAt: this.end
      }
    });
    bonds.subscribe(list => {
      this.bonds = list;
      let totalLiability = 0, totalNet = 0, totalBuf = 0, totalGross = 0;
      for (let bond of this.bonds) {

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

      this.sort(this.bonds, 'power');

      this.totalBuf = totalBuf;
      this.totalLiability = totalLiability;
      this.totalGross = totalGross;
      this.totalNet = totalNet;

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
