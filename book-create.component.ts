import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {ApiService} from '../api.service';
import {FormControl, FormGroupDirective, FormBuilder, FormGroup, NgForm, Validators} from '@angular/forms';

@Component({
  selector: 'app-book-create',
  templateUrl: './book-create.component.html',
  styleUrls: ['./book-create.component.css']
})
export class BookCreateComponent implements OnInit {
  book = {};
  bookForm: FormGroup;
  Customer_ID: string = '';
  Customer_Name: string = '';
  Customer_married: string = '';
  Customer_Age: string = '';
  Customer_License: string = '';
  Customer_car: string = '';

  constructor(private router: Router, private api: ApiService, private formBuilder: FormBuilder) {
  }

  ngOnInit() {
    this.bookForm = this.formBuilder.group({
      'Customer_ID': [null, Validators.required],
      'Customer_Name': [null, Validators.required],
      'Customer_Age': [null, Validators.required],
      'Customer_married': [null, Validators.required],
      'Customer_License': [null, Validators.required],
      'Customer_car': [null, Validators.required]
    });
  }

  onFormSubmit(form: NgForm) {
    this.api.postBook(form)
      .subscribe(res => {
        let id = res['_id'];
        this.router.navigate(['/book-details', id]);
      }, (err) => {
        console.log(err);
      });
  }
}
