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

  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) {
    this.formTestSuite = this.fb.group({
      name: ['', Validators.required],
      environment: ['', Validators.required],
      app: ['', Validators.required],
      dataserviceName: ['', Validators.required],
      api: ['', Validators.required],
      testEachAttribute: [true, Validators.required],
      testParams: this.fb.group({
        attribute: ['', Validators.required],
        dataset: ['', Validators.required],
      }),
    });
  }

  ngOnInit(): void {
  }

}
