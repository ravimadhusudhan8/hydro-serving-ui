import { MdlModule } from '@angular-mdl/core';
import { MdlSelectModule } from '@angular-mdl/select';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ApplicationsRoutingModule } from '@applications/applications.router';
import { EffectsModule } from '@ngrx/effects';
import { StoreModule } from '@ngrx/store';
import { SharedModule } from '@shared/shared.module';
import { ChartsModule } from 'ng2-charts';
import { CodemirrorModule } from 'ng2-codemirror';

import { ApplicationsEffects } from '@applications/effects/_index';
import { reducers } from '@applications/reducers';

import {
    ApplicationsWrapperComponent,
    ApplicationsItemDetailComponent,
    ApplicationsStageDetailComponent,
    ApplicationFormComponent,
    KafkaFormComponent,
    ServiceFormComponent,
    DialogAddApplicationComponent,
    DialogAddMetricComponent,
    DialogDeleteMetricComponent,
    DialogDeleteApplicationComponent,
    DialogTestComponent,
    DialogUpdateApplicationComponent,
    DialogUpdateModelVersionComponent
} from '@applications/components';

import {
    ApplicationsService,
    ApplicationsBuilderService,
    ApplicationsGuard,
    ApplicationFormService
} from '@applications/services';
import { CustomValidatorsService } from '@core/services/custom-validators.service';

const DIALOGS = [
    DialogDeleteApplicationComponent,
    DialogAddApplicationComponent,
    DialogAddMetricComponent,
    DialogDeleteMetricComponent,
    DialogUpdateApplicationComponent,
    DialogUpdateModelVersionComponent,
    DialogTestComponent,
];

const PRIVATE_COMPONENTS = [
    ApplicationsWrapperComponent,
    ApplicationsItemDetailComponent,
    ApplicationsStageDetailComponent,
    ApplicationFormComponent,
    KafkaFormComponent,
    ServiceFormComponent,
];
@NgModule({
    imports: [
        SharedModule,
        CommonModule,
        MdlModule,
        MdlSelectModule,
        ApplicationsRoutingModule,
        FormsModule,
        ChartsModule,
        StoreModule.forFeature('applications', reducers),
        EffectsModule.forFeature([ApplicationsEffects]),
        ReactiveFormsModule,
        CodemirrorModule,
    ],
    declarations: [
        ...PRIVATE_COMPONENTS,
        ...DIALOGS,
    ],
    entryComponents: [
        ...DIALOGS,
    ],
    providers: [
        ApplicationsService,
        ApplicationsBuilderService,
        ApplicationsGuard,
        ApplicationFormService,
        CustomValidatorsService,
    ],
})
export class ApplicationsModule { }
