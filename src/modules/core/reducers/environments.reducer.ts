import * as ModelActions from '@core/actions';
import { Environment } from '@shared/models/_index';

const initialState: Environment[] = [];

export function EnvironmentsReducer(state = initialState, action: ModelActions.EnvironmentsActions) {
    switch (action.type) {
        case ModelActions.GET_ENVIRONMENTS_SUCCESS:
            return Object.assign([], state, action.payload);
        default:
            return state;
    }
}
