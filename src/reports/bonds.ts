import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.html',
  styleUrls: ['./bonds.css']
})
export class BondsComponent implements OnInit {

  bonds;
  columns = [];

  today = new Date();
  startDate = new Date(this.today.getFullYear(), this.today.getMonth(), 1);
  endDate = new Date(this.today.getFullYear(), this.today.getMonth() + 1, 0);

  constructor(private af: AngularFire) {}

  ngOnInit() {
    let first = this.af.database.list('/bonds', {
      query: {
        limitToLast: 1
      }
    });
    first.subscribe(val => {
      this.generateColumns(val);
    });

    this.queryBonds();
  }

  filterResults() {
    this.queryBonds();
  }

  queryBonds() {
    let bonds = this.af.database.list('/bonds');
    bonds.subscribe(list => {
      this.bonds = list;
      for (let bond of this.bonds) {

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

      this.bonds = this.bonds.filter((bond) => {
        let dateCreated = new Date(bond.dateCreated);
        return dateCreated.getTime() >= this.startDate.getTime() && dateCreated.getTime() <= this.endDate.getTime();
      });
      this.sort(this.bonds, 'dateCreated');

    });
  }

  parseDate(dateString: string): Date {
      if (dateString) {
          return new Date(dateString);
      } else {
          return null;
      }
  }

  toCsv() {
    const items = this.bonds;
    const replacer = (key, value) => value === null ? '' : value; // specify how you want to handle null values here

    // const header = Object.keys(items[0]);
    const header = this.columns;
    let value;
    let csv = items.map(row =>
      header.map(fieldName => {
        value = row[fieldName.key];
        if (fieldName.key === 'dateCreated') {
          let date = new Date(value);
          value = (date.getMonth() + 1) + '/' + date.getDate() + '/' +  date.getFullYear();
        }
        return JSON.stringify(value, replacer);
      }
      ).join(',')
    );
    let columnNames = [];
    for (let col of this.columns) {
      columnNames.push(col.disp);
    }
    csv.unshift(columnNames.join(','));
    csv = csv.join('\r\n');

    // console.log(csv);
    // let encodedUri = encodeURI(csv);
    // window.open(encodedUri);
    return csv;
  }

  download() {
    let link = document.createElement('a');
    let csv = this.toCsv();

    if (link.download !== undefined) { // feature detection
        // Browsers that support HTML5 download attribute
        let blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        let url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'bonds.csv');
        // link.style = 'visibility:hidden';
    }

    if (navigator.msSaveBlob) { // IE 10+
      link.addEventListener('click', function (event) {
        let blob = new Blob([csv], {
          'type': 'text/csv;charset=utf-8;'
        });
      navigator.msSaveBlob(blob, 'bonds.csv');
      }, false);
    }

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  isDate(dateVal) {
    let d = new Date(dateVal);
    return d.toString() === 'Invalid Date' ? false : true;
  }

  private generateColumns(val) {
    let rec = val[0];
    let disp = '';
    for (let key in rec) {
      if (key !== '$key' && key !== '$exists' && key !== 'localTime') {
        disp = key;
        if (key.indexOf('date') > -1) {
          disp = 'date';
        }
        if (key === 'phone') {
          disp = 'defendPhone';
        }
        if (key.indexOf('defendant') > -1) {
          disp = disp.replace('defendant', 'defend');
        }
        if (key === 'indPhone') {
          disp = 'indemPhone';
        }
        if (key.indexOf('indemnitor') > -1) {
          disp = disp.replace('indemnitor', 'indem');
        }

        disp = disp.replace(/([A-Z])/g, ' $1').toUpperCase();

        this.columns.push({disp: disp, key: key});
        this.sort(this.columns, 'disp');
      }
    }
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
