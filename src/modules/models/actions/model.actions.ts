import { Action } from '@ngrx/store';
import { Model } from '@shared/models/_index';

export enum ModelActionTypes {
    Get = '[Model] Get all models',
    GetSuccess = '[Model] Get all models with success',
    GetFail = '[Model] Get all models with fail',
    Build = '[Model] Build model',
    BuildSuccess = '[Model] Build model with success',
    BuildFail = '[Model] Build model with fail',
}


export class GetModelsAction implements Action {
    readonly type = ModelActionTypes.Get;
}

export class GetModelsSuccessAction implements Action {
    readonly type = ModelActionTypes.GetSuccess;
    constructor(public payload: Model[]) { }
}

export class GetModelsFailAction implements Action {
    readonly type = ModelActionTypes.GetFail;
    constructor(public error) { }
}

export class BuildModelAction implements Action {
    readonly type = ModelActionTypes.Build;
    constructor(public payload: any) { }
}

export class BuildModelSuccessAction implements Action {
    readonly type = ModelActionTypes.BuildSuccess;
    constructor(public payload: any) { }
}

export class BuildModelFailAction implements Action {
    readonly type = ModelActionTypes.BuildFail;
    constructor(public error) { }
}



export type ModelActions
    = GetModelsAction
    | GetModelsSuccessAction
    | GetModelsFailAction
    | BuildModelAction
    | BuildModelSuccessAction
    | BuildModelFailAction;
