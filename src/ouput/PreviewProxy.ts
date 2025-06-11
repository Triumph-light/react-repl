export class PreviewProxy {
    iframe: HTMLIFrameElement
    handle_event: (e: any) => void
    handlers: Record<string, Function>

    constructor(iframe: HTMLIFrameElement, handlers: Record<string, Function>) {
        this.iframe = iframe

        this.handlers = handlers
        this.handle_event = (e) => this.handle_repl_message(e)
        window.addEventListener('message', this.handle_event)
    }

    iframe_command(action: string, args: any) {
        this.iframe.contentWindow!.postMessage({ action, args }, '*')
    }

    eval(script: string | string[]) {
        return this.iframe_command('eval', { script })
    }

    handle_repl_message(event: MessageEvent) {
        if (event.source !== this.iframe.contentWindow) return

        switch (event.data.action) {
            case 'error':
                return this.handlers.on_error(event.data)
            case 'cmd_ok':
                return this.handlers.on_success(event.data)
        }
    }
}