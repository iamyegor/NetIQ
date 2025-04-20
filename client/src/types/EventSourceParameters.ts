export default interface EventSourceParameters {
    url: string;
    body: any;
    handler: (event: MessageEvent) => void;
}
