import React from "react";
import { useRef } from "react";

export default function TestDaisy() {

    const modalRef = useRef<HTMLDialogElement>(null);

    return (
        <div className="p-6 flex flex-col gap-8">
            {/* Botones */}
            <div className="flex gap-2">
                <button className="btn btn-primary">Primary</button>
                <button className="btn btn-secondary">Secondary</button>
                <button className="btn btn-accent">Accent</button>
                <button className="btn btn-info">Info</button>
                <button className="btn btn-success">Success</button>
                <button className="btn btn-warning">Warning</button>
                <button className="btn btn-error">Error</button>
            </div>

            {/* Card */}
            <div className="card w-96 bg-base-200 shadow-xl">
                <div className="card-body">
                    <h2 className="card-title">Card</h2>
                    <p>Ejemplo de card con acción.</p>
                    <div className="card-actions justify-end">
                        <button className="btn btn-primary">Acción</button>
                    </div>
                </div>
            </div>

            {/* Alertas */}
            <div className="flex flex-col gap-2">
                <div className="alert alert-info"><span>Info alert</span></div>
                <div className="alert alert-success"><span>Success alert</span></div>
                <div className="alert alert-warning"><span>Warning alert</span></div>
                <div className="alert alert-error"><span>Error alert</span></div>
            </div>

            {/* Badge */}
            <div className="flex gap-2">
                <span className="badge badge-primary">Primary</span>
                <span className="badge badge-secondary">Secondary</span>
                <span className="badge badge-accent">Accent</span>
            </div>

            {/* Input + Form */}
            <div className="form-control w-full max-w-xs">
                <label className="label">
                    <span className="label-text">Correo electrónico</span>
                </label>
                <input type="text" placeholder="ejemplo@correo.com" className="input input-bordered w-full max-w-xs" />
            </div>

            {/* Checkbox y Radio */}
            <div className="flex flex-col gap-2">
                <label className="cursor-pointer label">
                    <span className="label-text">Aceptar términos</span>
                    <input type="checkbox" className="checkbox checkbox-primary" />
                </label>
                <div className="flex gap-4">
                    <label className="label cursor-pointer">
                        <span className="label-text">Opción A</span>
                        <input type="radio" name="radio-1" className="radio checked:bg-blue-500" />
                    </label>
                    <label className="label cursor-pointer">
                        <span className="label-text">Opción B</span>
                        <input type="radio" name="radio-1" className="radio checked:bg-red-500" />
                    </label>
                </div>
            </div>

            {/* Navbar */}
            <div className="navbar bg-base-200 rounded-lg">
                <div className="flex-1">
                    <a className="btn btn-ghost normal-case text-xl">DaisyUI</a>
                </div>
                <div className="flex-none gap-2">
                    <button className="btn btn-primary">Login</button>
                </div>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <a className="tab tab-bordered tab-active">Tab 1</a>
                <a className="tab tab-bordered">Tab 2</a>
                <a className="tab tab-bordered">Tab 3</a>
            </div>

            {/* Modal */}
            <button className="btn" onClick={() => modalRef.current?.showModal()}>
                Abrir Modal
            </button>
            <dialog id="my_modal" className="modal">
                <div className="modal-box">
                    <h3 className="font-bold text-lg">¡Hola!</h3>
                    <p className="py-4">Este es un modal de DaisyUI.</p>
                    <div className="modal-action">
                        <form method="dialog">
                            <button className="btn">Cerrar</button>
                        </form>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
