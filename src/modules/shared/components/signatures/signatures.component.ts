import { Component, Input, OnDestroy, OnInit, OnChanges } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { MdlSnackbarService } from '@angular-mdl/core';

import { Signature, ApplicationState } from '@shared/models/_index';
import { SignaturesService } from '@shared/services/_index';
import { Store } from '@ngrx/store';
// import * as Actions from '@shared/actions/_index';
import { Subscription } from 'rxjs/Subscription';



@Component({
    selector: 'hydro-signatures',
    templateUrl: './signatures.component.html',
    styleUrls: ['./signatures.component.scss']
})
export class SignaturesComponent implements OnInit, OnDestroy, OnChanges {

    @Input() modelId: number;
    public signatures: Signature[];
    public isReadOnly = true;
    public signaturesForm: FormGroup;
    private signaturesSub: Subscription;

    constructor(
        public fb: FormBuilder,
        private signaturesService: SignaturesService,
        private mdlSnackbarService: MdlSnackbarService,
        private store: Store<ApplicationState>
    ) { }

    ngOnInit() {
        this.createForm();
        this.signaturesSub = this.store.select('signatures')
            .filter(signatures => signatures.length > 0)
            .subscribe(signatures => {
                this.signatures = signatures;
                this.resetForm();
                this.updateSignaturesFormValues(this.signatures);
            });
    }

    ngOnChanges() { }

    ngOnDestroy() {
        if (this.signaturesSub) {
            this.signaturesSub.unsubscribe();
        }
    }

    public onSubmit() {
        this.signaturesForm.value.signatures.forEach(signature => {
            signature.inputs.forEach(input => {
                if (typeof input.shape === 'string') { // ToDo: Fix condition
                    input.shape = input.shape.split(/[ ,.]+/).map(Number);
                }
            });
            signature.outputs.forEach(output => {
                if (typeof output.shape === 'string') { // ToDo: Fix condition
                    output.shape = output.shape.split(/[ ,.]+/);
                }
            });
        });
        this.signaturesService.updateModelSignatures(this.modelId, { signatures: this.signaturesForm.value.signatures })
            .subscribe(() => {
                this.toggleSignaturesMode();
                this.mdlSnackbarService.showSnackbar({
                    message: 'Contract was successfully updated',
                    timeout: 5000
                });
            }, (error) => {
                this.mdlSnackbarService.showSnackbar({
                    message: `Contract update was failed with error: ${error}`,
                    timeout: 5000
                });
            });
    }

    public addSignatureFields(signatureIndex: number, fieldType: string) {
        const control = <FormArray>this.signaturesForm.get(['signatures', signatureIndex]).get(fieldType);
        control.push(this.addSignatureValues());
    }

    public removeSignatureFields(signatureIndex: number, fieldIndex: number, fieldType: string) {
        const control = <FormArray>this.signaturesForm.get(['signatures', signatureIndex]).get(fieldType);
        control.removeAt(fieldIndex);
    }

    public cancelEdit() {
        this.resetForm();
        this.updateSignaturesFormValues(this.signatures);
        this.toggleSignaturesMode();
    }

    public initFormChangesListener() {
        this.signaturesForm.valueChanges
            .subscribe(form => {
                console.log(form);
            });
    }

    public toggleSignaturesMode() {
        this.isReadOnly = !this.isReadOnly;
    }

    public addSignatureControl(event?) {
        const control = <FormArray>this.signaturesForm.get('signatures');
        control.push(this.addSignature(event));
    }

    public removeSignatureControl(i: number) {
        const control = <FormArray>this.signaturesForm.get('signatures');
        control.removeAt(i);
    }

    private createForm() {
        this.signaturesForm = this.fb.group({
            signatures: this.fb.array([])
        });
    }

    private addSignature(event?): FormGroup {
        return this.fb.group({
            signatureName: ['', Validators.required],
            inputs: this.fb.array(event ? [this.addSignatureValues()] : []),
            outputs: this.fb.array(event ? [this.addSignatureValues()] : []),
        });
    }

    private addSignatureValues(): FormGroup {
        return this.fb.group({
            fieldName: ['', Validators.required],
            dataType: ['', Validators.required],
            shape: ['']
        });
    }

    private resetForm() {
        this.createForm();
    }

    private updateSignaturesFormValues(signatures: Signature[]) {
        signatures.forEach((signature, i) => {
            this.addSignatureControl();
            const inputs = <FormArray>this.signaturesForm.get(['signatures', i]).get('inputs');
            const outputs = <FormArray>this.signaturesForm.get(['signatures', i]).get('outputs');
            signature.inputs.forEach(() => {
                inputs.push(this.addSignatureValues());
            });
            signature.outputs.forEach(() => {
                outputs.push(this.addSignatureValues());
            });
        });
        this.signaturesForm.patchValue({ signatures: signatures });
    }

}
