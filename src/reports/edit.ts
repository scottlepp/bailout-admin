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

  action = 'Edit';
  bond = {};
  date;
  dateTime;
  time;
  today = new Date();
  startDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  endDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);
  editing = true;
  key;
  timeChange = false;

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

  public show(bond, edit) {
    this.editing = edit;
    this.action = this.editing ? 'Edit':'Add';
    this.bond = bond;
    this.date = new Date(bond.dateCreated);
    this.dateTime = new Date(bond.dateCreated);
    this.time = this.date.toTimeString().split(' ')[0];
    this.modal.show();
  }

  ok() {
    // console.log(this.bond);
    // console.log(this.date);
    // console.log(this.dateTime);
    if (this.timeChange) {
      this.dateTime.setHours(this.dateTime.getHours() + 5);
    }
    this.timeChange = false;
    let bondDate = new Date(this.date.getFullYear(), this.date.getMonth(), this.date.getDate(), this.dateTime.getHours(), this.dateTime.getMinutes(), this.dateTime.getSeconds());
    // console.log(bondDate);
    this.bond['dateCreated'] = bondDate.getTime();
    this.saveBond(this.bond);
  }

  delete() {
    let bonds = this.af.database.list('/bonds');
    let key = this.bond['$key'];
    if(key !== undefined) {
      bonds.remove(key).then(_ => this.modal.hide());
    }
  }

  cancel() {
    this.modal.hide();
  }

  timeChanged() {
    this.timeChange = true;
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

  private saveBond(bond) {
    let bonds = this.af.database.list('/bonds');

    if (this.editing) {
      this.key = bond['$key'];
      delete bond['$key'];
      delete bond['$exists'];
      bonds.update(this.key, bond).then(() => {
        this.modal.hide();
      });
    } else {
      bond['status'] = 'open';
      bonds.push(bond).then(() => {
        this.modal.hide();
      });
    }
  }

  private cleanPhone(bond) {
    if (bond.phone !== undefined) {
      bond.phone = bond.phone.replace(/_/g, '');
    }
    if (bond.indPhone !== undefined) {
      bond.indPhone = bond.indPhone.replace(/_/g, '');
    }
  }

  private toTitleCase(str) {
    return str.replace(/\w\S*/g, function(txt) {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  }
}
