import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import { CommonService } from '../../utils/common.service';

@Component({
  selector: 'app-tests',
  templateUrl: './tests.component.html',
  styleUrls: ['./tests.component.scss']
})
export class TestsComponent implements OnInit {

  formTestSuite: FormGroup;

  showCreateModal = false;

  environments: any;
  selectedEnvironment: any;
  dataservices: any;
  selectedDataservice: any;
  datasets: any;
  testsuite = [];
  selectedTestsuite: any;
  attributes = [];

  attribute: any;
  dataset: string;
  mapping = [];

  errors = {
    misc: ''
  };

  spinners = {
    misc: false
  };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) {
    this.formTestSuite = this.fb.group({
      _id: ['', Validators.required],
      environment: ['', Validators.required],
      app: ['', Validators.required],
      dataserviceName: ['', Validators.required],
      api: ['', Validators.required],
      testEachAttribute: [true, Validators.required],
      testParams: [],
    });
  }

  ngOnInit(): void {
    this.__getEnvironments();
    this.__getDatasets();
    this.__getTestsuites();
  }

  __resetErrors(): void {
    this.errors = {
      misc: ''
    };
  }

  __resetSpinners(): void {
    this.spinners = {
      misc: false
    };
  }

  __getEnvironments(): void {
    this.__resetErrors();
    this.__resetSpinners();
    this.commonService.get('environment', '/', null)
    .subscribe(
      data => this.environments = data,
      () => this.errors.misc = 'Error fetching environments'
    );
  }

  __getDatasets(): void {
    this.__resetErrors();
    this.__resetSpinners();
    this.commonService.get('dataset', '/', {select: '_id', sort: '_id'})
    .subscribe(
      data => this.datasets = data.map(d => d._id),
      () => this.errors.misc = 'Error fetching environments'
    );
  }

  __getTestsuites(): void {
    this.__resetErrors();
    this.__resetSpinners();
    this.commonService.get('testsuite', '/', {sort: '_id'})
    .subscribe(
      data => {
        this.testsuite = data.map(d => d._id);
        if (data.length > 0) {
          this.selectedTestsuite = data[0];
        }
      },
      () => this.errors.misc = 'Error fetching testsuites'
    );
  }

  updateDataServiceList(event): void {
    const selectedEnvironment = event.target.value;
    this.formTestSuite.patchValue({api: null});
    this.environments.forEach(environment => {
      if (environment._id === selectedEnvironment) {
        this.selectedEnvironment = environment;
        this.dataservices = environment.dataservices;
        this.formTestSuite.patchValue({app: this.selectedEnvironment.app});
      }
    });
  }

  updateAPI(event): void {
    const selectedDataservice = event.target.value;
    this.selectedEnvironment.dataservices.forEach(dataservice => {
      if (dataservice._id === selectedDataservice) {
        this.selectedDataservice = dataservice;
        this.attributes = this.commonService.generateAttributeSet('', dataservice.definition);
        const constuctedAPI = `${this.selectedEnvironment.url}/api/c/${this.selectedEnvironment.app}${this.selectedDataservice.api}`;
        this.formTestSuite.patchValue({api: constuctedAPI});
      }
    });
  }

  startCreate(): void {
    this.formTestSuite.reset();
    this.showCreateModal = true;
  }

  createNewTestSuite(): void {
    console.log(this.formTestSuite.value);
    this.commonService.post('testsuite', '/', this.formTestSuite.value)
    .subscribe(
      () => {
        this.__getTestsuites();
        this.showCreateModal = false;
      },
      () => this.errors.misc = 'Error creating testsuite'
    );
  }

  addToDatasetMapping(): void {
    this.mapping.push([this.attribute, this.dataset]);
    this.formTestSuite.patchValue({testParams: this.mapping});
    this.attribute = null;
    this.dataset = null;
  }

  clearItemFromMapping(i: number): void {
    this.mapping.splice(i, 1);
    this.formTestSuite.patchValue({testParams: this.mapping});
    this.attribute = null;
    this.dataset = null;
  }

  clearAllMappings(): void {
    this.mapping = [];
    this.formTestSuite.patchValue({testParams: this.mapping});
    this.attribute = null;
    this.dataset = null;
  }

  menuClick(id: string): void {
    console.log(this.selectedTestsuite);
  }

}
