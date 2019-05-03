import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { TextDetectState } from '@/store/interface/state/detectText';
import { RootState } from '@/store/interface';


export const state: TextDetectState = {
    dataList: [],
    imgDimension : {
        width : null,
        height : null
    },
    lineShape : {
        detectText : '',
        width: null,
        height: null,
        top: null,
        left: null
    }
};

const namespaced: boolean = true;

export const textDetect: Module<TextDetectState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
