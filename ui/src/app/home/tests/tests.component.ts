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
  deleteConfirmation = false;

  environments: any;
  selectedEnvironment: any;
  dataservices: any;
  selectedDataservice: any;
  datasets: any;
  testsuites = [];
  selectedTestsuite: any;
  attributes = [];

  attribute: any;
  dataset: string;
  mapping = [];

  errors = {
    misc: null,
    remove: null
  };

  spinners = {
    misc: false,
    remove: false
  };

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) {
    this.formTestSuite = this.fb.group({
      _id: ['', Validators.required],
      environment: ['', Validators.required],
      app: ['', Validators.required],
      dataservice: ['', Validators.required],
      dataserviceName: [''],
      api: ['', Validators.required],
      testEachAttribute: ['', Validators.required],
      testParams: [],
    });
  }

  ngOnInit(): void {
    this.__getTestsuites();
  }

  __resetErrors(): void {
    this.errors = {
      misc: null,
      remove: null
    };
  }

  __resetSpinners(): void {
    this.spinners = {
      misc: false,
      remove: false
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
        this.testsuites = data;
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
        this.formTestSuite.patchValue({dataserviceName: this.selectedDataservice.name});
        this.attributes = this.commonService.generateAttributeSet('', dataservice.definition);
        const constuctedAPI = `${this.selectedEnvironment.url}/api/c/${this.selectedEnvironment.app}${this.selectedDataservice.api}`;
        this.formTestSuite.patchValue({api: constuctedAPI});
      }
    });
  }

  startCreate(): void {
    this.__getEnvironments();
    this.__getDatasets();
    this.formTestSuite.reset();
    this.formTestSuite.patchValue({testEachAttribute: true});
    this.showCreateModal = true;
  }

  createNewTestSuite(): void {
    this.commonService.post('testsuite', '/', this.formTestSuite.value)
    .subscribe(
      () => {
        this.__getTestsuites();
        this.showCreateModal = false;
      },
      () => this.errors.misc = 'Error creating testsuite'
    );
  }

  exitTestSuite(): void {
    this.showCreateModal = true;
    this.formTestSuite.setValue(this.selectedTestsuite);
    this.mapping = [];
  }

  deleteTestSuite(): void {
    this.commonService.delete('testsuite', `/${this.selectedTestsuite._id}`)
    .subscribe(
      () => {
        this.__getTestsuites();
        this.showCreateModal = false;
        this.deleteConfirmation = false;
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

  datasetSelect(id: string): void {
    const dsIndex = this.mapping.indexOf(id);
    if (dsIndex === -1 ) {
      this.mapping.push(id);
    } else {
      this.mapping.splice(dsIndex, 1);
    }
    this.formTestSuite.patchValue({testParams: this.mapping});
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

  menuClick(ts: any): void {
    this.selectedTestsuite = ts;
  }

  datasetHasBeenSelected(id: any): boolean {
    return this.mapping.indexOf(id) !== -1;
  }

  datasetChanges(): void {
    const qs = {
      sort: '_id',
      select: '_id',
      filter: {}
    };
    if (!this.formTestSuite.get('testEachAttribute').value) {
      qs.filter = {
        _id: {
          '$nin': [ 'String', 'Number', 'Date', 'Location', 'Boolean' ]
        }
      };
    }
    this.mapping = [];
    this.commonService.get('dataset', '/', qs)
    .subscribe(
      data => this.datasets = data.map(d => d._id),
      () => this.errors.misc = 'Error fetching environments'
    );
  }

}
