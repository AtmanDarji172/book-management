import { Injectable } from "@angular/core";
import { FormControl } from "@angular/forms";

@Injectable({
    providedIn: 'root'
})
export class UtilService {
    constructor() {

    }

    public noWhitespaceValidator(control: FormControl) {
        return (control?.value?.toString() || '')?.trim()?.length ? null : { whitespace: true };
    }

    public sendErrorMessage(error: any): string {
        if (error?.errors?.details?.length > 0) {
            return error?.errors?.details[0]?.message;
        }
        return error?.message;
    }

    public numberOnly(event: any): boolean {
        const charCode = event.which ? event.which : event.keyCode;
        if (charCode > 31 && (charCode < 48 || charCode > 57)) {
            return false;
        }
        return true;
    }
}