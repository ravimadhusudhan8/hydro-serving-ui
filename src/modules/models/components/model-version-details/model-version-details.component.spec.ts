import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MdlSelectModule } from '@angular-mdl/select';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SignaturesService, LoaderStateService } from '@core/services';
import { HttpService } from '@core/services/http';
import {
    DataComparisonHistogramComponent
} from '@profiles/components/data-comparison-histogram/data-comparison-histogram.component';
import { DataProfilesComponent } from '@profiles/components/data-profiles/data-profiles.component';
import { DataStatsComponent } from '@profiles/components/data-stats/data-stats.component';
import { SharedModule } from '@shared/shared.module';
import { modelBuild } from '@testing/factories/modelBuild';
import { MockStoreProvider } from '@testing/mocks';
import { MomentModule } from 'angular2-moment';
import { of } from 'rxjs';
import { ModelVersionDetailsComponent } from './model-version-details.component';

describe('ModelVersionDetailsComponent', () => {
    let component: ModelVersionDetailsComponent;
    let fixture: ComponentFixture<ModelVersionDetailsComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [
                ModelVersionDetailsComponent,
                DataProfilesComponent,
                DataComparisonHistogramComponent,
                DataStatsComponent,
            ],
            imports: [
                MdlSelectModule,
                SharedModule,
                RouterTestingModule,
                MomentModule,
                HttpClientTestingModule,
            ],
            providers: [
                MockStoreProvider,
                SignaturesService,
                HttpService,
                LoaderStateService,
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ModelVersionDetailsComponent);
        component = fixture.componentInstance;
        // TODO: mock store
        component.build$ = of(modelBuild);

        fixture.detectChanges();
    });

    it('it should be created', () => {
        expect(component).toBeTruthy();
    });
});
