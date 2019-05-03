import {GetterTree} from 'vuex';
import { TextDetectState } from '@/store/interface/state/detectText';
import { RootState } from '@/store/interface';

export const getters : GetterTree<TextDetectState, RootState> = {
    getItems(state) : any {
        console.log(state.dataList)
        return state.dataList
    }
}