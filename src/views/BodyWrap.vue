<template>
    <div class="bodyWrap">
        <div class="top">
            <h1><a href="/">AWS Rekonition Test (드루와~)</a></h1>
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
    </div>
</template>

<script lang="ts">
    import { Component, Vue } from 'vue-property-decorator';

    @Component
    export default class BodyWrap extends Vue {

        private created() {

        }
        private routeURI : Array<object> = [
            {
                label : 'Detect Image',
                uri : '/detectLabel'
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


    }
</script>

<style lang="scss">
    @import '../assets/style/common.scss';

    .fade-enter-active, .fade-leave-active {
        transition: all 0.3s ease;
    }
    .fade-enter, .fade-leave-active {
        opacity: 0;
        transform: translateX(-5%);
    }

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
</style>
