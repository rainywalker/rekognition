<template>
    <v-app>
        <h1>AWS Rekonition Test (드루와~)</h1>
        <strong>업로드한 이미지들은 언제든지 삭제될수 있습니다</strong>
        <ul>
            <li><router-link to="/">Detect Image</router-link> </li>
            <li><router-link to="/detectText"> Detect Text</router-link> </li>
            <li><router-link to="/moderation"> Detect Moderation</router-link> </li>
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

        private created() {
            this.AWS_INIT()
        }
    }
</script>
