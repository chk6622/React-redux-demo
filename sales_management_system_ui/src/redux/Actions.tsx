import IAction from './IAction';
import {CHANGE_ACTIVE_ITEM,CHANGE_OPEN_STATE} from './ActionTypes'

export const ChangeActiveItemAction=(value:any)=>{
    const action:IAction = {
        type:CHANGE_ACTIVE_ITEM,
        value:value
    }
    return action;
}

export const ChangeOpenStateAction=(value:any)=>{
    const action:IAction = {
        type:CHANGE_OPEN_STATE,
        value:value
    }
    return action;
}