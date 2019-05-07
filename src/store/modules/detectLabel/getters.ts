import {GetterTree} from 'vuex';
import { ImgDetectState } from '@/store/interface/state/detectImage';
import { RootState } from '@/store/interface';

export const getters : GetterTree<ImgDetectState, RootState> = {
    getItems(state) : Array<object> {
        return state.items
    }
}