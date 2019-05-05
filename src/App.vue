<template>
    <v-app>
        <h1>AWS Rekonition Test (드루와~)</h1>
        <strong>업로드한 이미지들은 언제든지 삭제될수 있습니다</strong>
        <ul>
            <li v-for="(item,i) in routeURI" :key="i">
                <router-link :to="item.uri">{{item.label}}</router-link>
            </li>
        </ul>
        <router-view></router-view>

    </v-app>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import {State, Action, Getter} from 'vuex-class';

    @Component

    export default class App extends Vue {

        @Action('AWS_INIT') AWS_INIT : any;
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
