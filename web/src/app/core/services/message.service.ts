import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
    
    //#region private variables

    private dataSubject = new Subject<any>();

    //#endregion
    
    constructor() {

    }

    //#region public methods

    public sendMessage(data: any): void {
        this.dataSubject.next(data);
    }

    public getMessage(): Observable<any> {
        return this.dataSubject.asObservable();
    }

    //#endregion
}