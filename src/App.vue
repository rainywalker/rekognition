<template>
    <v-app>
        <router-view></router-view>

    </v-app>
</template>

<script lang="ts">
    import {Component, Prop, Vue} from 'vue-property-decorator';
    import HelloWorld from '@/components/HelloWorld.vue'

    @Component({
        components: {
            HelloWorld
        }
    })
    export default class App extends Vue {

    }
</script>
