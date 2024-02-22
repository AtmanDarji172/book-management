import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Observable, catchError, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {
    constructor(
        private http: HttpClient
    ) {

    }

    //#region Auth endpoints

    public signIn(obj: object): Observable<any> {
        let url = `${environment.API_URL}/login`;
        return this.http.post<any>(url, obj);
    }

    public signUp(obj: object): Observable<any> {
        let url = `${environment.API_URL}/register`;
        return this.http.post<any>(url, obj);
    }

    //#endregion

    //#region Book endpoints

    public getAllBooks(): Observable<any> {
      let url = `${environment.API_URL}/books/all`;
      return this.http.get<any>(url);
    }

    public getBookDetails(bookId: string): Observable<any> {
      let url = `${environment.API_URL}/books/${bookId}/details`;
      return this.http.get<any>(url);
    }

    public addNewBook(obj: object): Observable<any> {
      let url = `${environment.API_URL}/books/add`;
      return this.http.post<any>(url, obj);
    }

    public updateBook(bookId: string, obj: object): Observable<any> {
      let url = `${environment.API_URL}/books/${bookId}/update`;
      return this.http.post<any>(url, obj);
    }

    public deleteBook(bookId: string): Observable<any> {
      let url = `${environment.API_URL}/books/${bookId}/delete`;
      return this.http.delete<any>(url);
    }

    //#endregion

    //#region User endpoints

    public getAllUsers(): Observable<any> {
      let url = `${environment.API_URL}/users/all`;
      return this.http.get<any>(url);
    }

    public getUserDetails(userId: string): Observable<any> {
      let url = `${environment.API_URL}/users/${userId}/details`;
      return this.http.get<any>(url);
    }

    public updateUser(userId: string, obj: object): Observable<any> {
      let url = `${environment.API_URL}/users/${userId}/update`;
      return this.http.post<any>(url, obj);
    }

    public deleteUser(userId: string): Observable<any> {
      let url = `${environment.API_URL}/users/${userId}/delete`;
      return this.http.delete<any>(url);
    }

    //#endregion

    //#region My profile endpoint

    public getProfileDetails(): Observable<any> {
      let url = `${environment.API_URL}/users/my-profile`;
      return this.http.get<any>(url);
    }

    //#endregion
}