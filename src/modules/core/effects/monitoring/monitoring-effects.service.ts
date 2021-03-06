
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import {of as observableOf,  Observable } from 'rxjs';
import { switchMap, catchError ,  map } from 'rxjs/operators';

import { MdlSnackbarService } from '@angular-mdl/core';
import * as HydroActions from '@core/actions/monitoring.actions';
import { MetricSettingsService } from '@core/services/metrics/_index';
import { MetricSettings } from '@shared/models/metric-settings.model';

@Injectable()
export class MonitoringEffects {
    @Effect() name$: Observable<Action> = this.actions$.ofType('ACTIONTYPE');

    @Effect() addMetric$: Observable<Action> = this.actions$
        .ofType(HydroActions.MonitoringActionTypes.AddMetric)
        .pipe(
            map((action: HydroActions.AddMetricAction) => action.aggregation),
            switchMap(aggregation => {
                // debugger;
                return this.metricService.addMetricSettings(aggregation)
                    .pipe(
                        map(response => {
                            this.mdlSnackbarService.showSnackbar({
                                message: 'Metric was successfully added',
                                timeout: 5000,
                            });
                            return new HydroActions.AddMetricSuccessAction(new MetricSettings(response));
                        }),
                        catchError(error => {
                            this.mdlSnackbarService.showSnackbar({
                                message: `Error: ${error}`,
                                timeout: 5000,
                            });
                            return observableOf(new HydroActions.AddMetricFailAction(error));
                        })
                    );
            })
        );

    @Effect() getMetrics$: Observable<Action> = this.actions$
        .ofType(HydroActions.MonitoringActionTypes.GetMetrics)
        .pipe(
            map((action: HydroActions.GetMetricsAction) => action.stageId),
            switchMap(stageId => {
                return this.metricService.getMetricSettings(stageId)
                    .pipe(
                        map(response =>
                            new HydroActions.GetMetricsSuccessAction(response.map(_ => new MetricSettings(_)))
                        ),
                        catchError(error => {
                            this.mdlSnackbarService.showSnackbar({
                                message: `Error: ${error}`,
                                timeout: 5000,
                            });
                            return observableOf(new HydroActions.GetMetricsFailAction(error));
                        })
                    );
            })
        );

    @Effect() deleteMetric$: Observable<Action> = this.actions$
        .ofType(HydroActions.MonitoringActionTypes.DeleteMetric)
        .pipe(
            map((action: HydroActions.DeleteMetricAction) => action.id),
            switchMap(metricId => {
                return this.metricService.deleteMetricSettings(metricId)
                    .pipe(
                        map(response => new HydroActions.DeleteMetricSuccessAction(new MetricSettings(response))),
                        catchError(error => {
                            this.mdlSnackbarService.showSnackbar({
                                message: `Error: ${error}`,
                                timeout: 5000,
                            });
                            return observableOf(new HydroActions.GetMetricsFailAction(error));
                        })
                    );
            })
        );

    constructor(
        private actions$: Actions,
        private metricService: MetricSettingsService,
        private mdlSnackbarService: MdlSnackbarService
    ) { }
}
