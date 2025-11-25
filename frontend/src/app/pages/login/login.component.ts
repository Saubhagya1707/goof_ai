import { Component, inject, OnDestroy } from '@angular/core';
import { AbstractControl, FormControl, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputGroupModule } from 'primeng/inputgroup'
import { InputGroupAddonModule } from 'primeng/inputgroupaddon'
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { LoginService } from './login.service';
import { LoginPayload, SignUpPayload, Token } from './models';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { TabsModule } from 'primeng/tabs'


@Component({
  selector: 'app-login',
  imports: [InputGroupAddonModule,
    InputGroupModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    RippleModule,
    CommonModule,
    TabsModule
  ],
  template: `
    <div id="login" style="background-image:  url(assets/login2.png); font-size: 16px"  class="h-screen px-6">
    <div class="flex flex-column gap-5 w-30rem h-100 bg-white py-6 absolute " style="top: 50%; left: 50%; transform: translate(-50%, -50%)">
      <div class="px-6">
      <p-tabs value="0">
    <p-tablist>
        <p-tab value="0" class="p-2">Login</p-tab>
        <p-tab value="1" class="p-2">SignUp</p-tab>
    </p-tablist>
    <p-tabpanels>
        <p-tabpanel value="0">
        <div class="flex flex-column gap-5 w-full h-full bg-white py-6 ">
          <header class="text-4xl w-full text-gray-500">Login</header>
          <p-inputgroup class="h-2rem">
            <p-inputgroup-addon>
                <i class="pi pi-user"></i>
            </p-inputgroup-addon>
            <input pInputText [formControl]="username" placeholder="Email" />
          </p-inputgroup>
          <p-inputgroup class="h-2rem">
          <p-inputgroup-addon>
                <i class="pi pi-key"></i>
            </p-inputgroup-addon>
          <input pInputText type="password" [formControl]="password" placeholder="Password" />
          </p-inputgroup>
          <div class="flex flex-row">
            <button [loading]="loading" pButton pRipple label="SignIn" class="w-full hover:bg-primary-200"  (click)="signIn()"></button>
          </div>
          <small *ngIf="errorMsg" class="text-sm text-red-500">{{errorMsg}}</small>
        </div>

        </p-tabpanel>
        <p-tabpanel value="1">
          <div class="flex flex-column gap-5 w-full h-full bg-white py-6" [formGroup]="signUpForm">
            <header class="text-4xl w-full text-gray-500">SignUp</header>

            <!-- Email Field -->
            <p-inputgroup class="h-2rem">
              <p-inputgroup-addon>
                <i class="pi pi-user"></i>
              </p-inputgroup-addon>
              <input pInputText formControlName="email" placeholder="Email" />
            </p-inputgroup>
            <small *ngIf="signUpForm.get('email')?.invalid && signUpForm.get('email')?.touched" class="text-red-500">
              Email is required and must be valid.
            </small>

            <!-- Full Name Field -->
            <p-inputgroup class="h-2rem">
              <p-inputgroup-addon>
                <i class="pi pi-user"></i>
              </p-inputgroup-addon>
              <input pInputText formControlName="fullName" placeholder="Full Name" />
            </p-inputgroup>
            <small *ngIf="signUpForm.get('fullName')?.invalid && signUpForm.get('fullName')?.touched" class="text-red-500">
              Full Name is required.
            </small>

            <!-- Password Field -->
            <p-inputgroup class="h-2rem">
              <p-inputgroup-addon>
                <i class="pi pi-key"></i>
              </p-inputgroup-addon>
              <input pInputText type="password" formControlName="password" placeholder="Password" />
            </p-inputgroup>
            <small *ngIf="signUpForm.get('password')?.invalid && signUpForm.get('password')?.touched" class="text-red-500">
              Password is required and must be at least 6 characters.
            </small>

            <!-- Confirm Password Field -->
            <p-inputgroup class="h-2rem">
              <p-inputgroup-addon>
                <i class="pi pi-key"></i>
              </p-inputgroup-addon>
              <input pInputText type="password" formControlName="confirmPassword" placeholder="Confirm Password" />
            </p-inputgroup>
            
            <small *ngIf="signUpForm.hasError('passwordMismatch') && signUpForm.touched" class="text-red-500">
              Passwords do not match.
            </small>
            <p-inputgroup class="h-2rem">
              <p-inputgroup-addon>
                <i class="pi pi-building"></i>
              </p-inputgroup-addon>
              <input pInputText type="text" formControlName="orgName" placeholder="Organization Name" />
            </p-inputgroup>
            <!-- SignUp Button -->
            <div class="flex flex-row">
              <button [loading]="loading" (click)="signUp()" pButton pRipple label="SignUp" class="hover:bg-primary-200" ></button>
            </div>
          </div>
        </p-tabpanel>
    </p-tabpanels>
    </p-tabs>
      </div>
    </div>
    </div>
  `,
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnDestroy {
  username: FormControl = new FormControl('', Validators.required);
  password: FormControl = new FormControl('', Validators.required);
  errorMsg!: string
  loading: boolean = false;
  signUpForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    fullName: new FormControl('', Validators.required),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    confirmPassword: new FormControl('', Validators.required),
    orgName: new FormControl('', Validators.required)
  }, { validators: this.passwordMatchValidator });

  private passwordMatchValidator(form: AbstractControl): ValidationErrors | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  private router: Router = inject(Router);
  private loginService: LoginService = inject(LoginService);

  ngOnInit() {
    const el = document.getElementById('login') as HTMLElement;
    el.addEventListener(('keydown'), ($event) => {
      if ($event.key === 'Enter') {
        this.signIn();
      }
    })
  }

  signIn() {
    this.errorMsg = ""
    this.loading = true
    if (!this.username.valid || !this.password.valid) {
      if (this.username.value.trim() === '' || this.password.value.trim() === '') {
        this.errorMsg = "Fields can't be empty!!"
      }
      this.loading = false;
      return;
    }
    const payload: LoginPayload = {
      username: this.username.value,
      password: this.password.value
    }
    this.loginService.login(payload).subscribe({
      next: (token: Token) => {
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error?.detail
        console.error(err)
        this.loading = false
      },
      complete: () => {
        this.loading = false
        this.router.navigate([''], {
        })
      }

    })
  }

  signUp() {
    debugger
    this.errorMsg = "";
    this.loading = true;

    if (this.signUpForm.invalid) {
      this.errorMsg = "Please fill out all fields correctly.";
      this.loading = false;
      return;
    }

    const payload: SignUpPayload = {
      email: this.signUpForm.get('email')?.value ?? '',
      full_name: this.signUpForm.get('fullName')?.value ?? '',
      password: this.signUpForm.get('password')?.value ?? '',
      confirmPassword: this.signUpForm.get('confirmPassword')?.value ?? '',
      org_name: this.signUpForm.get('orgName')?.value ?? ''
    };

    this.loginService.signUp(payload).subscribe({
      next: () => {
        this.errorMsg = "";
      },
      error: (err: HttpErrorResponse) => {
        this.errorMsg = err.error?.detail || "An error occurred during sign-up.";
        console.error(err.error);
        this.loading = false;
      },
      complete: () => {
        this.loading = false;
        this.signUpForm.reset();
        this.router.navigate(['newuser']);
      },
    });
  }

  ngOnDestroy(): void {
    const el = document.getElementById("login") as HTMLElement;
    if (el) {
      el.removeEventListener('keydown', () => {
        console.log('listener removed')
      });
    }
  }
}
