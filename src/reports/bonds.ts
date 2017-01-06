import { Component, OnInit } from '@angular/core';
import { AngularFire } from 'angularfire2';

@Component({
  selector: 'app-bonds',
  templateUrl: './bonds.html',
  styleUrls: ['./bonds.css']
})
export class BondsComponent implements OnInit {

  constructor(private af: AngularFire) {}

  ngOnInit() {

  }

}
