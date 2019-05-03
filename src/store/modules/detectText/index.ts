import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { TextDetectState } from '@/store/interface/state/detectText';
import { RootState } from '@/store/interface';


export const state: TextDetectState = {
    dataList: [],
};

const namespaced: boolean = true;

export const textDetect: Module<TextDetectState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
