export class PreviewProxy {
    iframe: HTMLIFrameElement

    constructor(iframe: HTMLIFrameElement) {
        this.iframe = iframe
    }

    iframe_command(action: string, args: any) {
        this.iframe.contentWindow!.postMessage({ action, args }, '*')
    }

    eval(script: string | string[]) {
        return this.iframe_command('eval', { script })
    }
}