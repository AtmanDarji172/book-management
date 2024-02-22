import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IBook, IError, IResponse } from 'app/core/helpers/model';
import { APIService } from 'app/core/services/api.service';
import { UtilService } from 'app/core/services/util.service';
import { FileUploader } from 'ng2-file-upload';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-add-edit',
    templateUrl: './add-edit.component.html',
    styleUrls: ['./add-edit.component.scss'],
})
export class AddEditComponent implements OnInit, OnDestroy {
    
    //#region private methods

    private subs: Subscription[] = [];

    //#endregion
    
    //#region public variables
    
    public focus: boolean;
    public focus1: boolean;
    public focus2: boolean;
    public focus3: boolean;
    public focus4: boolean;
    public submitted: boolean = false;
    
    public myForm: FormGroup;
    
    public bookDetails: IBook;
    
    public bookId: string;

    public uploader: FileUploader = new FileUploader({
        url: '',
        isHTML5: true,
        allowedFileType: ['image'],
    });

    public uploadedArray: any[] = [];

    //#endregion

    //#region life cycle hook

    constructor (
        private router: Router,
        private _apiService: APIService,
        private _toastrService: ToastrService,
        private _utilService: UtilService,
        private _activatedRoute: ActivatedRoute,
        private _fb: FormBuilder,
    ) {
        /**
         * Set bookId using activated route
         */
        this.bookId = this._activatedRoute.snapshot.paramMap.get('id');

        /**
         * Initiate form
         */
        this.initiateForm();
    }

    ngOnInit(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('landing-page'); 

        if (this.bookId != '-1') {
            this.getBookDetails();
        }
    }

    ngOnDestroy(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('landing-page');
        
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
            name: [null, [Validators.required, this._utilService.noWhitespaceValidator]],
            author: [null, [Validators.required, this._utilService.noWhitespaceValidator]],
            price: [null, [Validators.required, this._utilService.noWhitespaceValidator]],
            description: [null, [Validators.required, this._utilService.noWhitespaceValidator]],
            // image: [null, [Validators.required]],
        });
    }

    private updateForm(): void {
        this.myForm = this._fb.group({
            name: [this.bookDetails.name, [Validators.required, this._utilService.noWhitespaceValidator]],
            author: [this.bookDetails.author, [Validators.required, this._utilService.noWhitespaceValidator]],
            price: [this.bookDetails.price, [Validators.required, this._utilService.noWhitespaceValidator]],
            description: [this.bookDetails.description, [Validators.required, this._utilService.noWhitespaceValidator]],
            // image: [null],
        });
    }

    private getBookDetails(): void {
        const subs1 = this._apiService.getBookDetails(this.bookId).subscribe({
            next: (res: IResponse) => {
                this.bookDetails = res?.data;

                /**
                 * Update form and set data
                 */
                this.updateForm();
            },
            error: (error: IError) => {
                const errMsg: string = this._utilService.sendErrorMessage(error?.error);
                this._toastrService.error(errMsg);
            }
        });
        this.subs.push(subs1);
    }

    //#endregion

    //#region public methods

    public onSubmit(): void {
        this.submitted = true;
        if (this.myForm.valid) {
            // const formData = new FormData();
            // formData.append('name', this.myForm.value.name);
            // formData.append('author', this.myForm.value.author);
            // formData.append('price', this.myForm.value.price);
            // formData.append('description', this.myForm.value.description);
            // if (this.uploadedArray?.length > 0) {
            //     formData.append('image', this.uploadedArray[0]);
            // }

            /**
             * Change endpoint as per bookId
             */
            let endpoint = this._apiService.addNewBook(this.myForm.value);
            if (this.bookId != '-1') {
                endpoint = this._apiService.updateBook(this.bookId, this.myForm.value)
            }

            const subs2 = endpoint.subscribe({
                next: (res: IResponse) => {
                    this._toastrService.success(res.message);

                    /**
                     * Redirect to book details page after 2 second
                     */
                    setTimeout(() => {
                        this.router.navigate(['pages', 'book', res.data?._id, 'details']);
                    }, 2000);
                },
                error: (error: IError) => {
                    const errMsg: string = this._utilService.sendErrorMessage(error?.error);
                    this._toastrService.error(errMsg);
                }
            });
            this.subs.push(subs2);
        }
    }

    public numberOnly(event: any): boolean {
        return this._utilService.numberOnly(event);
    }

    public uploadMyData(e: any): void {
        if (this.uploader?.queue?.length > 0) {
            this.uploader?.queue?.forEach((val, i, arr) => {
                this.uploadedArray.push(val._file);
            });
        }
    }

    //#endregion
}
