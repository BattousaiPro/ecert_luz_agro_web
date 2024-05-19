import Swal from 'sweetalert2';

export class ModalOptions {

    constructor() { }

    public success(msj: string, tit: string = 'Completado con éxito!'): void {
        Swal.fire({
            title: '' + tit,
            text: '' + msj,
            icon: 'success',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'volver!'
        });
    }

    public error(msj: string, tit: string = '¡Hubo un error!'): void {
        Swal.fire({
            title: '' + tit,
            text: '' + msj,
            icon: 'error',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'volver!'
        });
    }

    public warning(msj: string, tit: string = '¡Atención!'): void {
        Swal.fire({
            title: '' + tit,
            text: '' + msj,
            icon: 'warning',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'volver!'
        });
    }

    public info(msj: string, tit: string = '¡Información!'): void {
        Swal.fire({
            title: '' + tit,
            text: '' + msj,
            icon: 'info',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'volver!'
        });
    }

    public question(msj: string, tit: string = '¡Consulta!'): void {
        Swal.fire({
            title: '' + tit,
            text: '' + msj,
            icon: 'question',
            // showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'volver!'
        });
    }

}