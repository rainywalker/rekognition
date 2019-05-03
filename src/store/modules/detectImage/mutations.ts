import {MutationTree} from 'vuex';
import { ImgDetectState } from './types';

export const mutations : MutationTree<ImgDetectState> = {
    getDB(state, obj) : void {
        console.log(obj)
        state.items = obj.Items
    },
    pushItem(state : any, obj : any) : void {
        state.items.unshift(obj)
    },
}