import {createRouter, createWebHistory} from "vue-router";
import Tickets from "@/Tickets.vue";
import TicketCreate from "@/TicketCreate.vue";
import TicketDetail from "@/TicketDetail.vue";

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
            path: "/tickets/new",
            name: "ticket-create",
            component: TicketCreate,
        },
        {
            path: "/tickets/:id",
            name: "ticket-detail",
            component: TicketDetail,
            props: true,
        },
    ],
});