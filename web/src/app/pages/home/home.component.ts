import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IBook, IError, IResponse } from 'app/core/helpers/model';
import { APIService } from 'app/core/services/api.service';
import { UtilService } from 'app/core/services/util.service';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit, OnDestroy {
    
    //#region private variables

    private subs: Subscription[] = [];

    //#endregion

    //#region public variables

    public bookList: IBook[] = [];

    //#endregion

    //#region life cycle hook

    constructor (
        private router: Router,
        private _apiService: APIService,
        private _toastrService: ToastrService,
        private _utilService: UtilService
    ) {}

    ngOnInit(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.add('landing-page');
        
        /**
         * Get Book list
         */
        this.getAllBooks();
    }

    ngOnDestroy(): void {
        var body = document.getElementsByTagName('body')[0];
        body.classList.remove('landing-page');
        
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

    private getAllBooks(): void {
        const subs1 = this._apiService.getAllBooks().subscribe({
            next: (res: IResponse) => {
                this.bookList = res?.data;
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

    public goToBookDetails(bookId: string): void {
        this.router.navigate(['pages', 'book', bookId, 'details']);
    }

    //#endregion
}
