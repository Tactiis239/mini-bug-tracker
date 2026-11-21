import { TicketDTO } from "./TicketDTO.js";

export class TicketCollectionDTO {
    constructor({
                    totalItems,
                    member = [],
                    view = null,
                    '@context': context = null,
                    '@id': iri = null,
                    '@type': type = null
                }) {
        this.totalItems = totalItems;
        this.tickets = member.map(TicketDTO.fromApi);
        this.view = view;
        this.context = context;
        this.iri = iri;
        this.type = type;
    }

    get hasNext() {
        return !!this.view?.next;
    }

    get hasPrevious() {
        return !!this.view?.previous;
    }

    get lastPage() {
        const last = this.view?.last;
        if (!last) {
            return 1;
        }
        const page = new URLSearchParams(last.split("?")[1]).get("page");
        return Number(page) || 1;
    }

    static fromApi(data) {
        return new TicketCollectionDTO(data);
    }
}