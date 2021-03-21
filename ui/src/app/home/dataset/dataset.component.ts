import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {

  selected = 'String';

  constructor() { }

  ngOnInit(): void {
  }

  menuClick(selection: string): void {
    this.selected = selection;
  }

}
