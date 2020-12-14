import { Component, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  genders = ['male', 'female'];
  signUpForm: FormGroup;
  notAllowedUsername = ['mido', 'mahmoud'];
  notEnoughLetters = false;
  formStatus = false;

  ngOnInit() {
    this.signUpForm = new FormGroup({
      'username': new FormControl(null, [Validators.required, this.checkAllowedNames.bind(this), this.countLetters.bind(this)]),
      'email': new FormControl(null, [Validators.required, Validators.email], this.notAllowedEmails),
      'gender': new FormControl('male'),
      'hobbies': new FormArray([]),
      'favourites': new FormArray([])
    })

    this.signUpForm.statusChanges.subscribe(
      (status) => {
        console.log(status);
        switch(status) {
          case 'PENDING':
            this.formStatus = false;
            console.log('now pending');
            break;
          case 'INVALID':
            this.formStatus = false;
            break;
          case 'VALID':
            this.formStatus = true;
            break;
          default:
            this.formStatus = false;
        }
      }
    )
  }

  onSubmit() {
    console.log(this.signUpForm);
  }

  getHobbies() {
    return (<FormArray>this.signUpForm.get('hobbies')).controls;
  }

  onAddHobby() {
    const control = new FormControl(null, Validators.required);
    (<FormArray>this.signUpForm.get('hobbies')).push(control);
  }

  getfavourites() {
    return (<FormArray>this.signUpForm.get('favourites')).controls;
  }

  onAddFavouriet() {
    const newControl = new FormControl(null, Validators.required);
    (<FormArray>this.signUpForm.get('favourites')).push(newControl);
  }

  onRemoveHobby(index: number) {
    (<FormArray>this.signUpForm.get('hobbies')).controls.splice(index, 1);
    console.log('removed hobby' + index);
  }

  onRemoveFavourite(index: number) {
    (<FormArray>this.signUpForm.get('favourites')).controls.splice(index, 1);
    console.log('removed favourite' + index);
  }

  checkAllowedNames(control: FormControl): {[s: string]: boolean} {
    if (this.notAllowedUsername.indexOf(control.value) !== -1) {
      return {'notAllowed': true};
    }
    return null;
  }

  countLetters(control: FormControl): {[s: string]: boolean} {
    if (control.value) {
      if (control.value.length < 6 && this.notAllowedUsername.indexOf(control.value)) {
        this.notEnoughLetters = true;
        return {'notEnough': true};
      }
    }
    this.notEnoughLetters = false;
    return null;
  }

  notAllowedEmails(control: FormControl): Promise<any> | Observable<any> {
    const promise = new Promise((resolve, reject) => {
      setTimeout(() => {
        if (control.value === 'test@test.com') {
          resolve({'notValid': true})
        } else {
          resolve(null);
        }
      }, 1500)
    })
    return promise
  }
}
