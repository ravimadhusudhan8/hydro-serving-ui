
import {map, first, mergeMap} from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { Actions, Effect } from '@ngrx/effects';
import { Action } from '@ngrx/store';
import { Observable } from 'rxjs';
import { RuntimesService } from '@core/services';
import { RuntimeBuilder } from '@core/builders/_index';
import * as HydroActions from '@core/actions';


@Injectable()
export class RuntimesEffects {
    @Effect() getRuntimes$: Observable<Action> = this.actions.ofType(HydroActions.GET_RUNTIMES).pipe(
        mergeMap(() => this.runtimesService.getRuntimes().pipe(first(),
            map(data => {
                return ({ type: HydroActions.GET_RUNTIMES_SUCCESS, payload: data.map(this.runtimeBuilder.build, this.runtimeBuilder) });
            }),)
        ));

    constructor(
        private runtimeBuilder: RuntimeBuilder,
        private runtimesService: RuntimesService,
        private actions: Actions
    ) { }
}
