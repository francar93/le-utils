import {AbstractControl, FormArray, FormControl, FormGroup, ValidationErrors, ValidatorFn} from '@angular/forms';
import {CommonUtils} from './CommonUtils';
import {hasOwnProperty} from 'tslint/lib/utils';
import * as _ from 'lodash';

export const form_error_codes = {
    oneRequired: 'oneRequired',
    backendError: 'backendError',
    pattern: 'pattern',
    required: 'required',
};

export class FormUtils {

    /**
     * disabilita i form control nel parametro list,
     * se la list è null non fa niente
     * @param form
     * @param list -> formControlNames dei form da disabilitare
     */
    static disableFormControls(form: FormGroup, list: string[]): void {
        if (!list) {
            return;
        } else {
            for (let elem of list) {
                if (form.get(elem)) {
                    form.controls[elem].disable();
                }
            }
        }
    }

    /**
     * resetta e disabilita i form control nel parametro list,
     * se la list è null non fa niente
     * @param form
     * @param list -> formControlNames dei form da disabilitare
     */
    static resetDisableRemoveValidatorsToFormControls(form: FormGroup, list: string[]): void {
        if (!list) {
            return;
        } else {
            for (let elem of list) {
                if (form.get(elem)) {
                    form.controls[elem].reset();
                    form.controls[elem].disable();
                    //form.controls[elem].clearValidators();
                    form.controls[elem].setErrors(null);
                }
            }

            form.updateValueAndValidity({onlySelf: false, emitEvent: false});
        }
    }

    /**
     * abilita i form control nel parametro list,
     * se la list è null non fa niente
     * @param form
     * @param list -> formControlNames dei form da abilitare
     */
    static enableFormControls(form: FormGroup, list: string[]): void {
        if (!list) {
            return;
        } else {
            for (let elem of list) {
                if (form.get(elem)) {
                    form.controls[elem].enable();
                }
            }
        }
    }

    static disableAllFormControls(form: FormGroup): void {
        if (!form) {
            return;
        } else {
            for (let controlsKey in form.controls) {
                form.get(controlsKey).disable();
            }
        }
    }

    static enableAllFormControls(form: FormGroup): void {
        if (!form) {
            return;
        } else {
            for (let controlsKey in form.controls) {
                form.get(controlsKey).enable();
            }
        }
    }

    /**
     * Abilita o Disabilita il formControl in base al value passato
     * se il value è TRUE, allora ABILITA il formControl,
     * se il value è FALSE, allora DISABILIT il formControl
     * @param form
     * @param value
     */
    static toggleAllEditStateByValue(form: FormGroup, value: any) {
        if (!!form) {
            if (value) {
                this.enableAllFormControls(form);
            } else {
                this.disableAllFormControls(form);
            }
        }
    }

    static hasRequiredError(formControlName: string, formGroup: FormGroup): boolean {
        return FormUtils.hasError(formControlName, formGroup, form_error_codes.required);
    }

    static hasPatternError(formControlName: string, formGroup: FormGroup): boolean {
        return FormUtils.hasError(formControlName, formGroup, form_error_codes.pattern);
    }

    static hasIsOneRequiredError(formControlName: string, formGroup: FormGroup): boolean {
        return FormUtils.hasError(formControlName, formGroup, form_error_codes.oneRequired);
    }

    static hasBackendError(formControlName: string, formGroup: FormGroup): boolean {
        return FormUtils.hasError(formControlName, formGroup, form_error_codes.backendError);
    }

    static hasError(formControlName: string, formGroup: FormGroup, errorCode: string): boolean {
        if (!CommonUtils.isVoid(formGroup) && formGroup.controls[formControlName]) {
            return this.hasInvalid(formControlName, formGroup)
                && formGroup.controls[formControlName].hasError(errorCode);
        } else {
            return false;
        }
    }

    static hasInvalid(formControlName: string, formGroup: FormGroup): boolean {
        if (!CommonUtils.isVoid(formGroup) && formGroup.controls[formControlName]) {
            return formGroup.controls[formControlName].touched
                && formGroup.controls[formControlName].invalid;
        } else {
            return false;
        }
    }

    static isRequiredValidator(formControl: AbstractControl): boolean {
        return FormUtils.isValidator(formControl, form_error_codes.required);
    }

    static isRequiredError(formControl: AbstractControl): boolean {
        return FormUtils.isError(formControl, form_error_codes.required);
    }

    static isPatternError(formControl: AbstractControl): boolean {
        return FormUtils.isError(formControl, form_error_codes.pattern);
    }

    static isOneRequiredError(formControl: AbstractControl): boolean {
        return FormUtils.isError(formControl, form_error_codes.oneRequired);
    }

    static isBackendError(formControl: AbstractControl): boolean {
        return FormUtils.isError(formControl, form_error_codes.backendError);
    }

    static isError(formControl: AbstractControl, errorCode: string): boolean {
        if (!CommonUtils.isVoid(formControl)) {
            return this.isInvalid(formControl)
                && formControl.hasError(errorCode);
        } else {
            return false;
        }
    }

    static isValidator(formControl: AbstractControl, validatorCode: string): boolean {
        if (formControl.validator) {
            const validator = formControl.validator({} as AbstractControl);
            if (validator && validator[validatorCode]) {
                return true;
            }
        }
        return false;
    }

    static isInvalid(formControl: AbstractControl): boolean {
        if (!CommonUtils.isVoid(formControl)) {
            return formControl.touched
                && formControl.invalid;
        } else {
            return false;
        }
    }

    /**
     * Controllo che permette di verificare se almeno uno dei due formControl è valorizzato,
     * in caso contrario ad entrambi in controlli verrà settato l'errore 'oneRequired',
     * nel caso in cui l'errore invece c'era ma ora uno dei due controlli è stato valorizzato,
     * toglie l'errore 'oneRequired'.
     * @param formGroup
     * @param formControlName1
     * @param formControlName2
     */
    static toggleOneRequired(formGroup: FormGroup, formControlName1: string, formControlName2: string) {
        const control1 = formGroup.get(formControlName1);
        const control2 = formGroup.get(formControlName2);
        if (CommonUtils.isVoid(control1)) {
            console.warn(`Attenzione!: il formControl: ${formControlName1} non è presente nel formGroup: ${formGroup}`);
        }
        if (CommonUtils.isVoid(control2)) {
            console.warn(`Attenzione!: il formControl: ${formControlName2} non è presente nel formGroup: ${formGroup}`);
        }

        if (CommonUtils.isVoid(control1.value) &&
            CommonUtils.isVoid(control2.value)) {
            control1.setErrors({[form_error_codes.oneRequired]: true});
            control2.setErrors({[form_error_codes.oneRequired]: true});
        } else {

            if (control1.hasError(form_error_codes.oneRequired)) {
                delete control1.errors[form_error_codes.oneRequired];
                control1.updateValueAndValidity({onlySelf: true});
            }

            if (control2.hasError(form_error_codes.oneRequired)) {
                delete control2.errors[form_error_codes.oneRequired];
                control2.updateValueAndValidity({onlySelf: true});
            }
        }
    }

    /**
     * Se la condition è vera aggiunge un validator altrimenti lo toglie
     * @param formGroup
     * @param formControlName
     * @param validator
     * @param condition
     */
    static toggleValidator(formGroup: FormGroup, formControlName: string, validator: ValidatorFn, condition: boolean) {
        const control = formGroup.get(formControlName);

        if (CommonUtils.isVoid(control)) {
            console.warn(`Attenzione!: il formControl: ${formControlName} non è presente nel formGroup: ${formGroup}`);
        }

        if (condition) {
            control.setValidators(validator);
        } else {
            control.setValidators(null);
            control.clearValidators();
        }

        control.updateValueAndValidity({onlySelf: true});
    }

    /**
     * Controllo che permette di inserire/togliere  l'errore 'backendError' su una formControl in base ad una condizione "isValid"
     * @param formGroup
     * @param formControlName
     * @param isValid
     */
    static toggleBackEndError(formGroup: FormGroup, formControlName: string, isValid: boolean) {
        return FormUtils.toggleError(formGroup, formControlName, isValid, 'backendError');
    }

    /**
     * Funzione che permette di inserire/togliere un codice d'errore fornito come parametro su una formControl in base ad una condizione "isValid"
     * @param formGroup
     * @param formControlName
     * @param isValid
     * @param errorCode
     */
    static toggleError(formGroup: FormGroup, formControlName: string, isValid: boolean, errorCode: string) {
        const control = formGroup.get(formControlName);

        if (CommonUtils.isVoid(control)) {
          console.warn(`Attenzione!: il formControl: ${formControlName} non è presente nel formGroup: ${formGroup}`);
        }

        if (!isValid) {
            control.setErrors({errorCode: true});
        } else {

            if (control.hasError(errorCode)) {
                delete control.errors[errorCode];
                control.updateValueAndValidity({onlySelf: true});
            }
        }
    }

    static getInvalidCssClass(formControlName: string, formGroup: FormGroup): string {
        return this.hasInvalid(formControlName, formGroup) ? 'a-input--error' : '';
    }

    static addValidator(control: AbstractControl, validators: ValidatorFn[]): AbstractControl {
        if (!validators || !validators.length) {
            return;
        }

        let previousValidators = control.validator;
        control.clearValidators();
        control.setValidators(previousValidators ? [previousValidators, ...validators] : validators);
        control.updateValueAndValidity({onlySelf: true});
        return control;
    };

    /** Getter che dato un form template e una form, torna il suo valore, altrimenti default value*/
    static getValueFromTemplate(form: FormGroup, formTemplate, defaultValue = null): any {
        return CommonUtils.checkAndGet(form, `controls[${formTemplate}].value`, defaultValue);
    }

    static formDisable(form: FormGroup): void {
        if (!CommonUtils.isVoidObj(form)) {
            for (let control of Object.keys(form.controls)) {
                form.controls[control].disable();
            }
        }
    }

    /**
     * Abilita o Disabilita il formControl in base al value passato
     * se il value è TRUE, allora ABILITA il formControl,
     * se il value è FALSE, allora DISABILIT il formControl
     * @param form
     * @param controlName
     * @param value
     */
    static toggleEditStateByValue(form: FormGroup, controlName: string, value: any) {
        if (!!form && !!form.get(controlName)) {
            if (value) {
                form.get(controlName).enable();
            } else {
                form.get(controlName).disable();
            }
        }
    }


    static patchValueAndDisableValued(form: FormGroup, controlName: string, value: any) {
        form.get(controlName).patchValue(value);
        if (!CommonUtils.isVoid(value)) {
            form.get(controlName).disable();
        }
    }


    static patchValueAndEnableValued(form: FormGroup, controlName: string, value: any) {
        form.get(controlName).patchValue(value);
        if (!CommonUtils.isVoid(value)) {
            form.get(controlName).enable();
        }
    }

    static disabledFieldsForm(form: FormGroup, list: string[]): void {
        if (form && list && list.length > 0) {
            for (let elem of list) {
                if (form.get(elem)) {
                    form.controls[elem].disable();
                }
            }
        }
    }

    static enabledFieldsForm(form: FormGroup, list: string[]): void {
        if (form && list && list.length > 0) {
            for (let elem of list) {
                if (form.get(elem)) {
                    form.controls[elem].enable();
                }
            }
        }
    }

    static initSimpleFormGroup(templateInput: Object, model: Object): FormGroup {
        const group = {};
        const templateProperties = Object.keys(templateInput);
        templateProperties.forEach((key) => {
                group[key] = new FormControl((!CommonUtils.isVoid(model) && !CommonUtils.isVoid(model[key])) ? model[key] : null);
            }
        );
        return new FormGroup(group);
    }


    /**
     * Return the input form, but if the form is null, launch the initSimpleFormGroup, otherwise add the new controls if there are any
     *
     * @param templateInput
     * @param model
     * @param form
     */
    static buildForm(templateInput: Object, model: Object, form: FormGroup): FormGroup {

        if (CommonUtils.isVoid(form)) {
            return FormUtils.initSimpleFormGroup(templateInput, model);
        } else {
            const templateProperties = Object.keys(templateInput);
            templateProperties.forEach((key) => {
                if (!hasOwnProperty(form.controls, key)) {
                    form.addControl(key, new FormControl((!CommonUtils.isVoid(model) && !CommonUtils.isVoid(model[templateInput[key]])) ? model[templateInput[key]] : null));
                }
            });
        }
        return form;
    }

    /**
     * Sets all the input FormGroup controls to "Touched" and "Dirty"
     *
     * @param formGroup
     */
    static validateAllFormFields(formGroup: FormGroup): void {
        if (!CommonUtils.isVoid(formGroup)) {
            Object.keys(formGroup.controls).forEach(field => {
                const control = formGroup.get(field);
                if (control instanceof FormControl) {
                    control.markAsTouched({onlySelf: true});
                    control.markAsDirty({onlySelf: true});
                } else if (control instanceof FormGroup) {
                    FormUtils.validateAllFormFields(control);
                }
            });
        }
    }

    /**
     * Given a FormGroup, logs the key with at least one form errors.
     *
     * @param form
     * @param caller
     */
    static getFormValidationErrors(form: FormGroup, caller: string): void {
        if (!CommonUtils.isVoidObj(form)) {
            Object.keys(form.controls).forEach(key => {

                const controlErrors: ValidationErrors = form.controls[key].errors;
                if (controlErrors != null) {
                    Object.keys(controlErrors).forEach(keyError => {
                      console.warn(`Attenzione!: getFormValidationErrors:` + 'KEY: ' + key + ', ERROR: ' + keyError);
                    });
                }
            });
        }
    }

    /**
     * Espone _formGroupFromJSON e ritorna il form group più esterno.
     *
     * @param input JSON del form group.
     * @param makeEmpty Se true, instanzia i control a '' (ignora il valore di ogni chiave di ultimo livello). Utile per dati mockati.
     * @returns {FormGroup} Form Group contenente form control per ogni chiave, eventualmente raggruppati in form group innestati
     */
    static formGroupFromJSON(input: Object, makeEmpty = false): FormGroup {
        return FormUtils._formGroupFromJSON(input, makeEmpty, '')['']; //"spacchetta" livello più esterno
    }

    /**
     * Crea un oggetto contenente form control per ogni chiave del JSON in input.
     * I control sono raggruppati in form group, uno per ogni sottoinsieme del JSON (oggetto o array), in maniera da
     * replicare esattamente la struttura dei dati in input.
     *
     * @param input JSON del form group.
     * @param makeEmpty Se true, instanzia i control a '' (ignora il valore di ogni chiave di ultimo livello). Utile per dati mockati.
     * @param {string} prefix Prefisso di ogni control name, usato solo nelle chiamate ricorsive.
     * @returns {Object} Oggetto contenente formGroup e/o formControl del relativo livello ricorsivo
     */
    private static _formGroupFromJSON(input: Object, makeEmpty = false, prefix = ''): Object {
        let forms = {};
        const format = (k: string, i = -1) => `${prefix ? prefix + '_' : ''}${k}${i > -1 ? i : ''}`;

        for (let key in input) {
            const innerObj = input[key];
            if (CommonUtils.isObjectPlain(innerObj)) {
                forms = _.assign({}, this._formGroupFromJSON(innerObj, makeEmpty, format(key)), forms);
            } else if (Array.isArray(innerObj)) {
                let numberedControls = new FormArray([]);
                for (let i = 0; i < innerObj.length; i++) {
                    numberedControls.push(this._formGroupFromJSON(innerObj[i], makeEmpty)['']);
                }
                forms = _.assign({}, {[format(key)]: numberedControls}, forms);
            } else {
                forms[key] = new FormControl(makeEmpty ? '' : input[key]);
            }
        }
        return {[prefix]: new FormGroup(forms)};
    }

}
