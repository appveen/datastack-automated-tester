import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChildActivationStart } from '@angular/router';

import { CommonService } from '../../utils/common.service';
@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {

  addView = true;
  formEnvironment: FormGroup;
  appList = [];
  dataserviceList = [];
  selectedApp: string;
  selectedDataservices = [];
  errors = {
    app: null,
    dataservice: null,
  };
  spinner = {
    fetchApp: false,
    fetchDataService: false,
  };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) {
    this.formEnvironment = this.fb.group({
      name: ['Bifrost', Validators.required],
      url: ['https://bifrost.odp.appveen.com', Validators.required],
      username: ['jerry@appveen.com', Validators.required],
      password: ['123123123', Validators.required],
      app: ['', Validators.required],
      dataServices: [this.fb.group({
        _id: ['', Validators.required],
        name: ['', Validators.required],
      }), [Validators.minLength(1), Validators.required]]
    });
  }

  ngOnInit(): void {
  }

  resetError(): void {
    this.errors = {
      app: null,
      dataservice: null,
    };
  }

  resetSpinners(): void {
    this.spinner = {
      fetchApp: false,
      fetchDataService: false
    };
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
    const payload = this.formEnvironment.value;
    console.log(payload);
    this.addView = false;
  }

  fetchApps(): void {
    const payload = this.formEnvironment.value;
    this.spinner.fetchApp = true;
    this.resetError();
    this.commonService.get('environment', '/fetch/apps', payload)
    .subscribe(
      response => {
        if (response.length < 1) {
          return this.errors.app = 'No apps found';
        }
        this.appList = response;
        this.selectedDataservices = [];
        this.resetSpinners();
      },
      () => {
        this.errors.app = 'Error fetching apps';
        this.resetSpinners();
      }
    );
  }

  appSelect(selectedApp: string): void {
    this.resetError();
    this.spinner.fetchDataService = true;
    this.formEnvironment.patchValue({app: selectedApp});
    this.selectedApp = selectedApp;
    const payload = this.formEnvironment.value;
    this.selectedDataservices = [];
    this.dataserviceList = [];
    this.commonService.get('environment', '/fetch/dataservices', payload)
    .subscribe(
      response => {
        if (response.length < 1) {
          return this.errors.dataservice = 'No dataservices found';
        }
        this.dataserviceList = response;
        this.resetSpinners();
      },
      () => {
        this.errors.dataservice = 'Error fetching dataservices';
        this.resetSpinners();
      }
    );
  }

  dataServiceSelect(selectedDataservice: object): void {
    const dsIndex = this.selectedDataservices.indexOf(selectedDataservice);
    if (dsIndex === -1 ) {
      this.selectedDataservices.push(selectedDataservice);
    } else {
      this.selectedDataservices.splice(dsIndex, 1);
    }
  }

  activateSaveButton(): boolean {
    this.formEnvironment.patchValue({ dataServices: JSON.parse(JSON.stringify(this.selectedDataservices)) });
    return this.formEnvironment.valid;
  }



}
