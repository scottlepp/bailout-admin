import { Component, OnInit, ViewChild } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';
import { BehaviorSubject } from 'rxjs';
import { ModalComponent } from './modal';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.html',
  styleUrls: ['./edit.css']
})
export class EditComponent implements OnInit {

  bond = {};
  columns = [];

  today = new Date();
  startDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  endDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  totalLiability = 0;
  totalNet = 0;
  totalGross = 0;
  totalBuf = 0;

  @ViewChild(ModalComponent)
  public readonly modal: ModalComponent;

  private start = new BehaviorSubject<number>(this.startDate.getTime());
  private end = new BehaviorSubject<number>(this.endDate.getTime());

  constructor(private af: AngularFire) {}

  // ngOnInit() {
  //   this.queryBonds();
  // }

  ngOnInit() {
    this.modal.visible = false;
  }

  public show(bond) {
    this.bond = bond;
    this.modal.show();
  }

  cancel() {
    this.modal.hide();
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
