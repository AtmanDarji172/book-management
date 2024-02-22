import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CONSTANTS } from 'app/core/helpers/common';
import { IError, IResponse } from 'app/core/helpers/model';
import { APIService } from 'app/core/services/api.service';
import { AuthService } from 'app/core/services/auth.service';
import { MessageService } from 'app/core/services/message.service';
import { UtilService } from 'app/core/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss'],
})
export class SignInComponent implements OnInit, OnDestroy {
    
    //#region private variables

    private subs: Subscription[] = [];

    //#endregion

    //#region public variables variables
    
    public focus: boolean;
    public focus1: boolean;
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
        private _authService: AuthService,
        private _messageService: MessageService,
    ) {
        /**
         * Restrict come back to login, if user already signed in
         */
        if (this._authService.isAuthenticated()) {
            this.router.navigate(['pages', 'home']);
        }
    }

    ngOnInit(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('login-page');

        /**
         * Initiate form
         */
        this.initiateForm();
    }

    ngOnDestroy(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('login-page');
        
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
            email: [null, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.EMAIL_PATTERN)]],
            password: [null, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.PASSWORD_PATTERN)]]
        });
    }

    //#endregion

    //#region public methods

    public onSubmit(): void {
        this.submitted = true;
        if (this.myForm.valid) {
            const subs1 = this._apiService.signIn(this.myForm.value).subscribe({
                next: (res: IResponse) => {
                    sessionStorage.setItem('token', res?.data?.token);

                    
                    this._toastrService.success(res.message);
                    
                    /**
                     * Redirect to home page
                     */
                    setTimeout(() => {
                        /**
                         * Update isLoggedIn flag for navbar
                         */
                        this._messageService.sendMessage('sign-in');
                        this.router.navigate(['pages', 'home']);
                    }, 2000);
                },
                error: (error: IError) => {
                    const errMsg: string = this._utilService.sendErrorMessage(error?.error);
                    this._toastrService.error(errMsg);
                }
            });
            this.subs.push(subs1);
        }
    }

    public goToRegister(): void {
        this.router.navigate(['auth', 'sign-up']);
    }

    //#endregion
}
