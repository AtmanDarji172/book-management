import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IBook, IError, IResponse } from 'app/core/helpers/model';
import { APIService } from 'app/core/services/api.service';
import { UtilService } from 'app/core/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'app/core/services/auth.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
    selector: 'app-details',
    templateUrl: './details.component.html',
    styleUrls: ['./details.component.scss'],
})
export class DetailsComponent implements OnInit, OnDestroy {
    
    //#region private methods

    private subs: Subscription[] = [];

    private bookId: string;

    //#endregion

    //#region public variables

    public bookDetails: IBook;

    public isLoggedIn: boolean = false;

    //#endregion

    //#region life cycle hook

    constructor(
        private router: Router,
        private _apiService: APIService,
        private _toastrService: ToastrService,
        private _utilService: UtilService,
        private _activatedRoute: ActivatedRoute,
        private _authService: AuthService,
        private modalService: NgbModal
    ) {
        this.bookId = this._activatedRoute.snapshot.paramMap.get('id');
        this.isLoggedIn = this._authService.isAuthenticated();
    }

    ngOnInit(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('landing-page');

        /**
         * Fetch book details
         */
        this.getBookDetails();
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

    private getBookDetails(): void {
        const subs1 = this._apiService.getBookDetails(this.bookId).subscribe({
            next: (res: IResponse) => {
                this.bookDetails = res?.data;
                this._toastrService.success(res.message);
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

    public addEditBook(bookId: any): void {
        /**
         * Check and restrict for add / edit if user is not logged in
         */
        if (this._authService.isAuthenticated()) {
            this.router.navigate(['pages', 'book', bookId, 'add-edit']);
        } else {
            this._toastrService.error('Please sign in to perform this action');
        }
    }

    public deleteBook(content: any): void {
        /**
         * Check and restrict for delete if user is not logged in
         */
        if (this._authService.isAuthenticated()) {
            const modal = this.modalService.open(content);
            modal.result.then((result: any) => {
                if (result == 'Confirm') {
                    const subs2 = this._apiService.deleteBook(this.bookId).subscribe({
                        next: (res: IResponse) => {
                            this._toastrService.success(res.message);
    
                            /**
                             * Navigate to home after deletion
                             */
                            setTimeout(() => {
                                this.router.navigate(['pages', 'home']);
                            }, 2000);
                        },
                        error: (error: IError) => {
                            const errMsg: string = this._utilService.sendErrorMessage(error?.error);
                            this._toastrService.error(errMsg);
                        }
                    });
                    this.subs.push(subs2);
                }
            }, (reason: any) => {
            });

        } else {
            this._toastrService.error('Please sign in to perform this action');
        }
    }

    //#endregion
}
