import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CONSTANTS } from 'app/core/helpers/common';
import { IError, IResponse } from 'app/core/helpers/model';
import { APIService } from 'app/core/services/api.service';
import { AuthService } from 'app/core/services/auth.service';
import { UtilService } from 'app/core/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss'],
})
export class SignUpComponent implements OnInit, OnDestroy {
    
    //#region private variables

    private subs: Subscription[] = [];

    //#endregion

    //#region public variables variables
    
    public focus: boolean;
    public focus1: boolean;
    public focus2: boolean;
    public focus3: boolean;
    public focus4: boolean;
    public submitted: boolean = false;

    public myForm: FormGroup;

    //#endregion

    //#region life cycle hook

    constructor(
        private _apiService: APIService,
        private _fb: FormBuilder,
        private _utilService: UtilService,
        private router: Router,
        private _toastrService: ToastrService,
        private _authService: AuthService
    ) {
        /**
         * Restrict come back to sign up, if user already signed in
         */
        if (this._authService.isAuthenticated()) {
            this.router.navigate(['pages', 'home']);
        }
    }

    ngOnInit(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.add('navbar-transparent');

        /**
         * Initiate form
         */
        this.initiateForm();
    }

    ngOnDestroy(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');

        var navbar = document.getElementsByTagName('nav')[0];
        navbar.classList.remove('navbar-transparent');
        
        /**
         * Unsubscribe all the subscriptions at component's destroy time
         */
        if (this.subs?.length > 0) {
            this.subs.forEach((sub: Subscription) => {
                sub.unsubscribe();
            });
        }
    }

    //#endregion

    //#region private methods

    private initiateForm(): void {
        this.myForm = this._fb.group({
            first_name: [null, [Validators.required, this._utilService.noWhitespaceValidator]],
            last_name: [null, [Validators.required, this._utilService.noWhitespaceValidator]],
            phone: [null, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.PHONE_PATTERN)]],
            email: [null, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.EMAIL_PATTERN)]],
            password: [null, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.PASSWORD_PATTERN)]]
        });
    }

    //#endregion

    //#region public methods

    public onSubmit(): void {
        this.submitted = true;
        if (this.myForm.valid) {
            const subs1 = this._apiService.signUp(this.myForm.value).subscribe({
                next: (res: IResponse) => {
                    this._toastrService.success(res.message);
                    
                    /**
                     * Redirect to sign-in page after 1 second
                     */
                    setTimeout(() => {
                        this.goToLogin();
                    }, 1000);
                },
                error: (error: IError) => {
                    const errMsg: string = this._utilService.sendErrorMessage(error?.error);
                    this._toastrService.error(errMsg);
                }
            });
            this.subs.push(subs1);
        }
    }

    public goToLogin(): void {
        this.router.navigate(['auth', 'sign-in']);
    }

    //#endregion
}
