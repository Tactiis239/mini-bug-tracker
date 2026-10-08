import {createRouter, createWebHistory} from "vue-router";
import Tickets from "@/Tickets.vue";

export const router = createRouter({
    history: createWebHistory(),
    routes: [
        {
            path: "/",
            redirect: "/tickets",
        },
        {
            path: "/tickets",
            name: "tickets",
            component: Tickets,
        },
        {
            path: "/gestion-tickets",
            name: "gestion-tickets",
            component: Tickets,
        },
    ],
});