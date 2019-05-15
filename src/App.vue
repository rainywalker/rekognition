<template>
    <v-app>
        <router-view></router-view>
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

        private created() {
            this.AWS_INIT()
        }
    }
</script>

<style lang="scss" scoped>





</style>
