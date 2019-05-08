<template>
    <v-app>
        <div class="top">
            <h1>AWS Rekonition Test (드루와~)</h1>
            <strong>업로드한 이미지들은 언제든지 삭제될수 있습니다</strong>
        </div>
        <ul class="menu">
            <li v-for="(item,i) in routeURI" :key="i">
                <router-link :to="item.uri">{{item.label}}</router-link>
            </li>
        </ul>
        <transition name="fade" mode="out-in">
            <router-view></router-view>
        </transition>
        <loading-bar v-if="getIsLoading" />
    </v-app>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {State, Action, Getter} from 'vuex-class';
    import LoadingBar from '@/components/LoadingBar.vue';

    @Component({
        components : {
            LoadingBar
        }
    })

    export default class App extends Vue {

        @Action('AWS_INIT') AWS_INIT : any;
        @Getter('getIsLoading') getIsLoading : any;

        private isLoading : boolean = false;

        private routeURI : Array<object> = [
            {
                label : 'Detect Image',
                uri : '/'
            },
            {
                label : 'Detect Text',
                uri : '/detectText'
            },
            {
                label : 'Detect Moderation',
                uri : '/moderation'
            }
        ]
        private created() {
            this.AWS_INIT()
        }
    }
</script>

<style lang="scss">
    @import './assets/style/common.scss';
    .top{
        text-align: center;
        padding:20px 0;
    }

    .menu{
        display: flex;box-shadow: 1px 1px 1px #ddd;margin-bottom:20px;
        li{

            margin-left:20px;flex:1;
            &:first-child{margin-left:0}
            a{
                display: block;font-size:15px;text-align: center;padding:15px 0;color:rgba(0,0,0,0.87);
                &.router-link-exact-active{color:#005caf;border-bottom:2px solid #005caf}

            }
        }
    }
    .fade-enter-active, .fade-leave-active {
        transition: all 0.3s ease;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
        transform: translateX(-5%);
    }


</style>
