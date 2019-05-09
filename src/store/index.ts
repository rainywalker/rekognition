import Vue from 'vue';
import Vuex, {GetterTree} from 'vuex';
import {labelDetect} from './modules/detectLabel'
import {textDetect} from './modules/detectText'
import {moderationDetect} from './modules/moderation';
import { RootState } from '@/store/interface';
import {AWS} from './AWS'


Vue.use(Vuex);


export default new Vuex.Store<RootState>({
    state: {
        bucketName : 'rekonition-img',
        bucketRegion : 'ap-northeast-2',
        IdentiryPoolId : 'ap-northeast-2:2d3bcfc3-d348-4ebe-b7dc-c08e0a0808e8',
        isLoading : false
    },
    getters : {
        getIsLoading : (state) => state.isLoading
    }
    ,
    modules: {
        labelDetect,
        textDetect,
        moderationDetect
    },
    mutations: {

    },
    actions: {
        AWS_INIT({commit, state}) : void {

            AWS.config.update({
                region : state.bucketRegion,
                credentials : new AWS.CognitoIdentityCredentials({
                    IdentityPoolId : state.IdentiryPoolId
                })
            });

        },
    },
});

