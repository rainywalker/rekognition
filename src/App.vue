<template>
    <v-app>
        <h1>AWS Rekonition Image Detect Test...</h1>
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
    import HelloWorld from '@/components/HelloWorld.vue'

    @Component({
        components: {
            HelloWorld
        }
    })
    export default class App extends Vue {

    }
</script>
