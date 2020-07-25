import IAction from './IAction';
import {CHANGE_MENU_ACTIVE_ITEM,CHANGE_MENU_OPEN_STATE} from './ActionTypes'

export const ChangeActiveItemAction=(value:any)=>{
    const action:IAction = {
        type:CHANGE_MENU_ACTIVE_ITEM,
        value:value
    }
    return action;
}

export const ChangeOpenStateAction=(value:any)=>{
    const action:IAction = {
        type:CHANGE_MENU_OPEN_STATE,
        value:value
    }
    return action;
}