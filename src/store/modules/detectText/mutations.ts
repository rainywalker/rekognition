import {MutationTree} from 'vuex';
import { TextDetectState } from '@/store/interface/state/detectText';

export const mutations : MutationTree<TextDetectState> = {
    getItems(state, obj) : void {
        state.dataList = [...obj]
    },
    pushItem(state : any, obj : any) : void {
        state.dataList.unshift(obj)
    },

}