import {MutationTree} from 'vuex';
import { ModerationState } from '@/store/interface/state/moderation';

export const mutations : MutationTree<ModerationState> = {
    getItems(state, obj) : void {
        state.items = [...obj]
    },
    pushItem(state : any, obj : any) : void {
        state.items.unshift(obj)
    }


}
