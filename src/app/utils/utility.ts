export class Uyility {

    public datatoken?: any;

    constructor() { }

    consultar(buscar: string) {
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

}