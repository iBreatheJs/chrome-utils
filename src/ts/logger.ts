export class ExtensionLogger {
    private static readonly STORAGE_KEY = 'extension_logs';
    private static readonly TOAST_CONTAINER_ID = 'my-extension-toast-container';
    private static readonly LOG_OVERLAY_ID = 'my-extension-log-overlay';

    private logs: string[] = [];

    /**
     * only load logs and inject css when needed. 
     * this extension could cun on all urls so most the time its not needed i think. or if there is some welcome log etc maybe always offload!?
     */
    private loaded: boolean = false

    constructor() {
        // this.loadLogs();
        // this.injectCSS(); // auto-inject styles if needed
    }

    private async loadLogs(): Promise<void> {
        const result = await chrome.storage.local.get(ExtensionLogger.STORAGE_KEY);
        this.logs = result[ExtensionLogger.STORAGE_KEY] || [];
        this.loaded = true;
    }

    private async saveLogs(): Promise<void> {
        await chrome.storage.local.set({ [ExtensionLogger.STORAGE_KEY]: this.logs });
    }

    public async log(message: string): Promise<void> {
        if (!this.loaded) {
            await this.loadLogs()
            this.injectCSS()
        }
        const timestamp = new Date().toISOString();
        const entry = `[${timestamp}] ${message}`;
        this.logs.push(entry);
        await this.saveLogs();
        this.showToast(message);
    }

    private getOrCreateToastContainer(): HTMLElement {
        let container = document.getElementById(ExtensionLogger.TOAST_CONTAINER_ID);
        if (!container) {
            container = document.createElement('div');
            container.id = ExtensionLogger.TOAST_CONTAINER_ID;
            container.className = 'ext-toast-container';
            document.body.appendChild(container);
        }
        return container;
    }

    private showToast(message: string, duration = 3000): void {
        const container = this.getOrCreateToastContainer();

        const toast = document.createElement('div');
        toast.className = 'ext-toast';
        toast.textContent = message;

        // show log history onclick
        toast.addEventListener('click', async () => {
            this.showLogOverlay()
        })

        container.appendChild(toast);

        requestAnimationFrame(() => toast.classList.add('visible'));

        let timeoutId = setTimeout(() => hide(), duration);

        function hide() {
            toast.classList.remove('visible');
            setTimeout(() => toast.remove(), 300);
        }

        toast.addEventListener('mouseenter', () => clearTimeout(timeoutId));
        toast.addEventListener('mouseleave', () => {
            timeoutId = setTimeout(() => hide(), 1000);
        });
    }

    public async showLogOverlay(): Promise<void> {
        await this.loadLogs();

        if (document.getElementById(ExtensionLogger.LOG_OVERLAY_ID)) return;

        const overlay = document.createElement('div');
        overlay.id = ExtensionLogger.LOG_OVERLAY_ID;
        overlay.className = 'ext-log-overlay';

        const header = document.createElement('div');
        header.className = 'ext-log-header';

        const closeBtn = document.createElement('button');
        closeBtn.textContent = '×';
        closeBtn.className = 'ext-close-btn';
        closeBtn.onclick = () => overlay.remove();

        const clearBtn = document.createElement('button');
        clearBtn.textContent = 'Clear Logs';
        clearBtn.className = 'ext-clear-btn';
        clearBtn.onclick = async () => {
            await this.clearLogs();
            content.textContent = '';
        };

        header.append(clearBtn, closeBtn);

        const content = document.createElement('pre');
        content.className = 'ext-log-content';
        content.textContent = this.logs.join('\n');

        overlay.append(header, content);
        document.body.appendChild(overlay);
    }

    public async clearLogs(): Promise<void> {
        this.logs = [];
        await chrome.storage.local.remove(ExtensionLogger.STORAGE_KEY);
    }

    private injectCSS(): void {
        const id = 'extension-logger-style';
        if (document.getElementById(id)) return;

        const style = document.createElement('style');
        style.id = id;
        style.textContent = `
      .ext-toast-container {
        position: fixed;
        top: 20px;
        right: 20px;
        z-index: 999999;
        display: flex;
        flex-direction: column;
        gap: 10px;
        pointer-events: none;
      }

      .ext-toast {
        background-color: #333;
        color: white;
        padding: 10px 15px;
        border-radius: 5px;
        box-shadow: 0 2px 6px rgba(0,0,0,0.3);
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
        pointer-events: auto;
      }

      .ext-toast.visible {
        opacity: 1;
      }

      .ext-log-overlay {
        position: fixed;
        top: 10%;
        left: 50%;
        transform: translateX(-50%);
        width: 80vw;
        max-width: 700px;
        max-height: 80vh;
        background: white;
        border: 1px solid #ccc;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 999999;
        padding: 10px;
        display: flex;
        flex-direction: column;
        resize: both;
        overflow: auto;
        font-family: monospace;
        font-size: 12px;
      }

      .ext-log-header {
        display: flex;
        justify-content: space-between;
        margin-bottom: 5px;
      }

      .ext-close-btn,
      .ext-clear-btn {
        background: transparent;
        border: 1px solid #ccc;
        padding: 2px 8px;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
      }

      .ext-log-content {
        white-space: pre-wrap;
        flex-grow: 1;
        overflow-y: auto;
      }
    `;
        document.head.appendChild(style);
    }
}
