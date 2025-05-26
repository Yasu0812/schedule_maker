export type TicketMaterial = {
    title: string,
    description: string,
    phases: {
        phase: string,
        duration: number,
        description: string,
    }[]
};