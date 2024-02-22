import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CONSTANTS } from 'app/core/helpers/common';
import { IError, IResponse, IUser } from 'app/core/helpers/model';
import { APIService } from 'app/core/services/api.service';
import { UtilService } from 'app/core/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-my-profile',
    templateUrl: './my-profile.component.html',
    styleUrls: ['./my-profile.component.scss'],
})
export class MyProfileComponent implements OnInit, OnDestroy {
    
    //#region private variables

    private subs: Subscription[] = [];

    //#endregion

    //#region public variables variables
    
    public focus: boolean;
    public focus1: boolean;
    public focus2: boolean;
    public focus3: boolean;
    public submitted: boolean = false;

    public myForm: FormGroup;

    public userDetails: IUser;

    //#endregion

    //#region life cycle hook

    constructor(
        private _apiService: APIService,
        private _fb: FormBuilder,
        private _utilService: UtilService,
        private _toastrService: ToastrService,
    ) {}

    ngOnInit(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('profile-page');

        /**
         * Initiate form
         */
        this.initiateForm();

        /**
         * Fetch profile details
         */
        this.getCurrentUserDetails();
    }

    ngOnDestroy(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('profile-page');

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
            email: [null, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.EMAIL_PATTERN)]]
        });
    }

    private updateForm(): void {
        this.myForm = this._fb.group({
            first_name: [this.userDetails?.first_name, [Validators.required, this._utilService.noWhitespaceValidator]],
            last_name: [this.userDetails?.last_name, [Validators.required, this._utilService.noWhitespaceValidator]],
            phone: [this.userDetails?.phone, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.PHONE_PATTERN)]],
            email: [this.userDetails?.email, [Validators.required, this._utilService.noWhitespaceValidator, Validators.pattern(CONSTANTS.EMAIL_PATTERN)]]
        });
    }

    private getCurrentUserDetails(): void {
        const subs2 = this._apiService.getProfileDetails().subscribe({
            next: (res: IResponse) => {
                this.userDetails = res.data;
                this.updateForm();
                this._toastrService.success(res.message);
            },
            error: (error: IError) => {
                const errMsg: string = this._utilService.sendErrorMessage(error?.error);
                this._toastrService.error(errMsg);
            }
        });
        this.subs.push(subs2);
    }

    //#endregion

    //#region public methods

    public onSubmit(): void {
        this.submitted = true;
        if (this.myForm.valid) {
            const subs1 = this._apiService.updateUser(this.userDetails?._id, this.myForm.value).subscribe({
                next: (res: IResponse) => {
                    this.userDetails = res?.data;
                    this._toastrService.success(res.message);
                },
                error: (error: IError) => {
                    const errMsg: string = this._utilService.sendErrorMessage(error?.error);
                    this._toastrService.error(errMsg);
                }
            });
            this.subs.push(subs1);
        }
    }

    public numberOnly(event: any): boolean {
        return this._utilService.numberOnly(event);
    }

    //#endregion
}
