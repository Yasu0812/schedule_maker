export type TicketMaterial = {
    title: string,
    description: string,
    enabled: boolean,
    phases: {
        phase: string,
        duration: number,
        description: string,
    }[]
};