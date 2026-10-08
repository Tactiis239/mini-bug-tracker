import {TicketDTO} from "@/DTO/TicketDTO.js";

export class TicketCollectionDTO {
    constructor({
                    totalItems,
                    member = [],
                    '@context': context = null,
                    '@id': iri = null,
                    '@type': type = null
                }) {
        this.totalItems = totalItems;
        this.tickets = member.map(TicketDTO.fromApi);
        this.context = context;
        this.iri = iri;
        this.type = type;
    }

    static fromApi(data) {
        return new TicketCollectionDTO(data);
    }
}