import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {

  addView = false;

  constructor() { }

  ngOnInit(): void {
  }

  showAddEnvironment(): void {
    console.log('showAddEnvironment');
    this.addView = true;
  }

  cancelAddEnvironment(): void {
    console.log('cancelAddEnvironment');
    this.addView = false;
  }

  addEnvironment(): void {
    console.log('addEnvironment');
    this.addView = false;
  }



}
