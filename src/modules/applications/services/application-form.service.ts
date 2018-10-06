import { Injectable, OnDestroy } from "@angular/core";
import { 
    FormArray,
    FormBuilder,
    FormGroup,
    FormControl,
    Validators,
    ValidatorFn,
    ValidationErrors,
} from "@angular/forms";
import { 
    Runtime, 
} from "@shared/_index";
import { HydroServingState } from "@core/reducers";
import { Store } from '@ngrx/store';
import { Subscription } from "rxjs";


interface Service {
    weight: number;
    environment: any;
    runtime: any;
    modelVersion: any;    
}

interface Stage {
    services: Service[]
}

interface ExecutionGraph {
    stages: Stage[]
}

interface FormData {
    name?: string;
    executionGraph: ExecutionGraph;
}

@Injectable()
export class ApplicationFormService implements OnDestroy {


    private runtimes: Runtime[];
    private runtimesSub: Subscription;

    private _form: FormGroup;

    public initForm(data: FormData = this.defaultFormData()): FormGroup {
        this._form = this.fb.group({
            applicationName: this.buildApplicationNameControl(data.name),
            kafkaStreaming: this.fb.array([]),
            stages: this.fb.array(this.getStagesArray(data.executionGraph.stages))
        })

        return this._form;
    }

    constructor(
        private fb: FormBuilder,
        store: Store<HydroServingState>
    ) {
        this.runtimesSub = store.select('runtimes').subscribe(
            runtimes => this.runtimes = runtimes
        )
    }

    public get stages(): FormArray {
        return this._form.get('stages') as FormArray
    }

    public addStageControl(stage = this.defaultStageData()): void {
        this.stages.push(this.buildStageGroup(stage));
    }

    public addServiceToStage(stageControl: FormGroup){
        let services = stageControl.get('services') as FormArray
        services.push(this.buildServiceGroup())
    }

    private buildApplicationNameControl(applicationName: string = ''){
        return [applicationName, [Validators.required, CustomValidators.uniqNameValidation()]]
    }

    private buildStageGroup(stage): FormGroup {
        const services = stage.services.map(
            (service: Service) => this.buildServiceGroup(service)
        )

        return this.fb.group({
            services: this.fb.array(services, CustomValidators.weightValidation())
        })
    }

    private buildServiceGroup(service: Service = this.defaultService()): FormGroup {
         return this.buildServiceForm(service)
    }

    private getStagesArray(stages: Array<any> = []): Array<FormGroup>{
        return stages.map(stage => this.buildStageGroup(stage)) 
    }

    private defaultStageData(): Stage{
        return {
            services: [this.defaultService()]
        }
    }

    private defaultService(): Service{
        return {
            weight: 10,
            environment: {
                id: 0
            },
            runtime: {
                id: this.defaultRuntimeId()
            },
            modelVersion: {
                id: 1,
                model: {
                    id: 1
                }
            }
        }
    }

    private defaultFormData(): FormData{
        return {
            name: '',
            executionGraph: {
                stages: [this.defaultStageData()]
            }
        }
    }

    private defaultRuntimeId(){
        if(this.runtimes){
            return this.runtimes[0].id;
        }
    }

    public buildServiceForm(service: Service = this.defaultService()): FormGroup{
        debugger;
        const environment = new FormControl(service.environment && service.environment.id);
        const weight = new FormControl(service.weight);
        const runtime = new FormControl(service.runtime && service.runtime.id);
        const signatureName = new FormControl();
        const model = new FormGroup({
            modelId: new FormControl(service.modelVersion && service.modelVersion.model.id),
            modelVersionId: new FormControl(service.modelVersion && service.modelVersion.id)
        })

        return new FormGroup({
            environment,
            weight,
            runtime,
            signatureName,
            model
        })
    }

    ngOnDestroy(){
        this.runtimesSub.unsubscribe();
    }
}

class CustomValidators {
    static weightValidation(): ValidatorFn {
        return (control: FormArray) : ValidationErrors => {
            const sum = control.controls.reduce((a, c) => a + Number(c.get('weight').value), 0)
            if(sum > 100) {
                return { 'weight': 'Sum of weights must be lower than 100'}
            }
        }
    }

    static uniqNameValidation(): ValidatorFn {
        return (control: FormControl) : ValidationErrors => {
            if(['1'].includes(control.value)) {
                return { 'uniq': 'Application name must be uniq'}
            }
        }
    }    
}