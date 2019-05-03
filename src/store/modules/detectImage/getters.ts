import {GetterTree} from 'vuex';
import {ImgDetectState} from './types'
import {RootState} from '../../types';

export const getters : GetterTree<ImgDetectState, RootState> = {
    getItems(state) : Array<object> {
        return state.items
    }
}