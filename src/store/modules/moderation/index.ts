import { Module } from 'vuex';
import { getters } from './getters';
import { actions } from './actions';
import { mutations } from './mutations';
import { ModerationState } from '@/store/interface/state/moderation';
import { RootState } from '@/store/interface';


const namespaced: boolean = true;

export const state: ModerationState = {

}

export const moderationDetect: Module<ModerationState, RootState> = {
    namespaced,
    state,
    getters,
    actions,
    mutations
};
