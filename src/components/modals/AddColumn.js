import React, { useState, useEffect } from 'react'

import Add from "../../assets/svg/add.svg";
import Text from "../../assets/text.json"
export default function AddColumn({ handleClick, newVal, isEdit, handleUpdate }) {
    const [title, setTitle] = useState(newVal?.name ? newVal?.name : '');
    useEffect(() => {
        setTitle(newVal?.name ? newVal?.name : '')
    }, [newVal])

    const columnModal=()=><dialog id="my_modal_3" className="modal">
    <div className="modal-box">
        <form method="dialog">
            {/* if there is a button in form, it will close the modal */}
            <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">{Text.close}</button>
        </form>
        <h3 className="font-bold text-lg">{isEdit ? Text.editColumn : Text.addColumn}</h3>
        <input placeholder={Text.title} className="py-3 px-2 mt-3 bg-[rgb(14,17,23)] w-full placeholder-white rounded-lg" value={title} onChange={(e) => setTitle(e?.target?.value)} />
        <div className='pt-3 flex justify-end'>
            {!isEdit ? <button className='btn btn-primary text-center text-white py-1 capitalize' disabled={title === '' ? true : false} onClick={() => handleClick(title)}>
                {Text?.save}
            </button> : <button className='btn btn-primary text-center text-white py-1 capitalize' disabled={title === '' ? true : false} onClick={() => handleUpdate(title)}>
                {Text?.update}
            </button>}
        </div>
    </div>
</dialog>

const columnAdd=()=><div className='py-3 px-3 w-72 rounded-lg bg-[rgb(14,17,23)] hover:border border-red-500 flex items-center space-x-3 cursor-pointer' onClick={() => document.getElementById('my_modal_3').showModal()}>
<img src={Add} alt='add' className='w-6' />
<p className='text-white capitalize'>
   {Text.addColumn}
</p>
</div>

    return (
        <div>
            {columnAdd()}
            {columnModal()}
            </div>
    )
}
