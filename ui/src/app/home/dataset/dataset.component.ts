import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonService } from '../../utils/common.service';
import { DatasetString, DatasetNumber, DatasetObject } from '../../utils/interfaces';

@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  styleUrls: ['./dataset.component.scss']
})
export class DatasetComponent implements OnInit {

  selected = 'String';
  showReinitConfirmation = false;
  showAddEnvironment = false;
  saveRequired = false;

  stringASCII: DatasetString;
  stringData: DatasetString;
  numberData: DatasetNumber;
  dateData: DatasetObject;
  locationData: DatasetObject;

  errors = {
    fetch: null,
    upsert: null,
    init: null
  };
  spinner = {
    fetch: false,
    fetchAscii: false,
    upsert: false,
    init: false,
  };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) { }

  ngOnInit(): void {
    this.menuClick('String');
  }

  __resetError(): void {
    this.errors = {
      fetch: null,
      upsert: null,
      init: null
    };
  }

  __resetSpinners(): void {
    this.spinner = {
      fetch: false,
      fetchAscii: false,
      upsert: false,
      init: false,
    };
  }

  menuClick(selection: string): void {
    this.selected = selection;
    this.spinner.fetch = true;
    this.spinner.fetchAscii = true;
    switch (this.selected) {
      case 'String': this.__loadStringData(); break;
      case 'Number': this.__loadNumberData(); break;
      case 'Boolean': this.__loadBooleanData(); break;
      case 'Date': this.__loadDateData(); break;
      case 'Location': this.__loadLocationData(); break;
      default:
        break;
    }
  }

  __loadStringData(): void {
    this.commonService.get('dataset', '/stringASCII', null)
    .subscribe(
      response => {
        this.stringASCII = response;
        this.spinner.fetchAscii = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetchAscii = false;
      }
    );
    this.commonService.get('dataset', '/stringData', null)
    .subscribe(
      response => {
        this.stringData = response;
        this.spinner.fetch = false;
      },
      () => {
        this.errors.fetch = true;
        this.spinner.fetch = false;
      }
    );
  }

  removeItemFromDataSet(dataset: string, data: string): void {
    switch (dataset) {
      case 'stringASCII': this.stringASCII.data.splice(this.stringASCII.data.indexOf(data), 1); break;
      case 'stringData': this.stringData.data.splice(this.stringASCII.data.indexOf(data), 1); break;
      case 'numberData': this.numberData.data.splice(this.numberData.data.indexOf(data), 1); break;
      case 'dateData': this.dateData.data.splice(this.dateData.data.indexOf(data), 1); break;
      case 'locationData': this.locationData.data.splice(this.locationData.data.indexOf(data), 1); break;
      default:
        break;
    }
    this.saveRequired = true;
  }

  saveDataSet(dataset: any): void {
    this.__resetError();
    this.__resetSpinners();
    this.spinner.upsert = true;
    this.commonService.put('dataset', `/${dataset._id}`, dataset)
    .subscribe(
      response => {
        this.__loadStringData();
        this.spinner.upsert = false;
        this.saveRequired = false;
      },
      () => {
        this.errors.upsert = true;
        this.spinner.upsert = false;
      }
    );
  }

  clearAllASCIIData(): void {
    this.stringASCII.data = null;
    this.saveRequired = true;
  }

  clearAllStringData(): void {
    this.stringData.data = null;
    this.saveRequired = true;
  }

  __loadNumberData(): void {}

  __loadBooleanData(): void {}

  __loadDateData(): void {}

  __loadLocationData(): void {}

  reinitData(): void {
    this.__resetError();
    this.__resetSpinners();
    this.spinner.init = true;
    this.commonService.post('dataset', '/init', null)
    .subscribe(
      response => {
        this.menuClick('String');
        this.spinner.init = false;
        this.showReinitConfirmation = false;
      },
      () => {
        this.errors.init = true;
        this.spinner.init = false;
      }
    );
  }

}
