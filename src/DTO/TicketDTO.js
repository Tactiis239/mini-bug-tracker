export class TicketDTO {
    constructor({
                    id,
                    title,
                    description,
                    status,
                    priority,
                    createdAt,
                    '@id': iri = null,
                    '@type': type = null
                }) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.status = status;
        this.priority = priority;
        this.createdAt = createdAt;
        this.iri = iri;
        this.type = type;
    }

    static fromApi(data) {
        return new TicketDTO(data);
    }
}