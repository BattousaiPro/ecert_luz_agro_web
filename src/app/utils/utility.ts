export class Utility {

    public datatoken?: any;
    //private basePath?: string = 'http://localhost:3000';
    private basePath?: string = 'https://ecert-luz-agro-services.onrender.com';

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
        console.log('verificarToken');
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

    public setBasePath(basePath: string) {
        this.basePath = basePath;
    }

    public getBasePath() {
        return this.basePath;
    }

}