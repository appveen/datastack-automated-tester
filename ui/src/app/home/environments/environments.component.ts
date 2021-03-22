import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-environments',
  templateUrl: './environments.component.html',
  styleUrls: ['./environments.component.scss']
})
export class EnvironmentsComponent implements OnInit {

  addView = true;
  formEnvironment: FormGroup;

  constructor(
    private fb: FormBuilder,
  ) {
    this.formEnvironment = this.fb.group({
      name: ['', Validators.required],
      url: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      app: ['', Validators.required]
    });
  }

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
    const payload = this.formEnvironment.value;
    console.log(payload);
    this.addView = false;
  }



}
