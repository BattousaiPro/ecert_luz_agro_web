import { environment } from "../../environments/environment";

export class Utility {

    public datatoken?: any;
    private basePath?: string = environment.URL_SERVER_BACK;

    constructor() { }

    public consultar(buscar: string): boolean {
        // console.log('buscar: ' + buscar);
        try {
            if (localStorage !== null && typeof localStorage !== 'undefined') {
                let itemStorage = localStorage.getItem('datatoken');
                if (itemStorage) {
                    this.datatoken = JSON.parse(itemStorage);
                    if (this.datatoken!.permisos!.find((x: string) => x == buscar) == undefined) {
                        return false;
                    } else {
                        return true;
                    }
                }
            }
        } catch (err) {
            // console.log(err);
        }
        return false;
    }

    public verificarToken(): boolean {
        // console.log('verificarToken');
        try {
            if (typeof localStorage !== 'undefined' && localStorage !== null) {
                let itemStorage = localStorage.getItem('datatoken');
                if (itemStorage) {
                    this.datatoken = JSON.parse(itemStorage);
                    if (typeof this.datatoken!.token === 'undefined') {
                        // console.log('return false');
                        return false;
                    } else {
                        // console.log('return true');
                        return true;
                    }
                }
            }
        } catch (err) {
            // console.log(err);
        }
        // console.log('return false');
        return false;
    }

    public validateToken(): string {
        let resp: string = '';
        if (typeof localStorage !== 'undefined' && localStorage !== null) {
            let itemStorage = localStorage.getItem('datatoken');
            if (itemStorage) {
                this.datatoken = JSON.parse(itemStorage);
                if (typeof this.datatoken !== 'undefined'
                    && typeof this.datatoken.token !== 'undefined'
                    && this.datatoken.token !== '') {
                    return this.datatoken.token;
                }
            }
        }
        return resp;
    }

    public getFileName(baseNameFile: string, extension: string): string {
        let dat = new Date();
        const dateName = dat.getFullYear() + '_' + (dat.getMonth() + 1) + '_' + dat.getDate() + '_' + dat.getHours() + '_' + dat.getMinutes();
        let fileName: string = baseNameFile + '_' + dateName + extension;
        // console.log('fileName: ' + fileName);
        return fileName;
    }

    public downloadPdfByBase64(fileName: string, base64: string, browser: string = '', device: string = ''): void {
        let url = '';
        if (browser === 'Safari' && device === 'iPhone') {
            url = this.configDownloadPdfSafari(base64);
        } else {
            url = this.configDownloadPdf(base64);
        }
        const downloadLink = document.createElement('a');
        downloadLink.href = url;
        downloadLink.download = fileName;
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    public setBasePath(basePath: string) {
        this.basePath = basePath;
    }

    public getBasePath() {
        return this.basePath;
    }

    private configDownloadPdf(base64: string): string {
        const binary = atob(base64.replace(/\s/g, ''));
        const len = binary.length;
        const buffer = new ArrayBuffer(len);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < len; i += 1) {
            view[i] = binary.charCodeAt(i);
        }
        // create the blob object with content-type "application/pdf"
        const blob = new Blob([view], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);
        return url;
    }

    private configDownloadPdfSafari(base64: string): string {
        const clearUrl = base64.replace(/^data:image\/\w+;base64,/, '');
        const url = 'data:application/octet-stream;base64,' + encodeURIComponent(clearUrl);
        return url;
    }

}