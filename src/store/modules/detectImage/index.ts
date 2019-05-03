import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { ImgDetectState } from '@/store/interface/state/detectImage';
import { RootState } from '@/store/interface';


export const state: ImgDetectState = {
    items: [],
};

const namespaced: boolean = true;

export const imageDetect: Module<ImgDetectState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
