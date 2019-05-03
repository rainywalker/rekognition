import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { ImgDetectState } from './types';
import { RootState } from '../../types';


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
