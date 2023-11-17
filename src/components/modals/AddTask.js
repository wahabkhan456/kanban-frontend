import React, { useState,useEffect } from 'react'

import Text from "../../assets/text.json";

export default function AddTask({ handleClick,id, newVal, isEdit, handleUpdate }) {
    const [row, setRow] = useState({ title: newVal?.text ? newVal?.text : '', description: newVal?.description ? newVal?.description : '' });
     useEffect(()=>{
        setRow({ title: newVal?.text ? newVal?.text : '', description: newVal?.description ? newVal?.description : '' })
     },[newVal])


     const taskAddModal=()=><dialog id="my_modal_4" className="modal">
     <div className="modal-box">
         <form method="dialog">
             {/* if there is a button in form, it will close the modal */}
             <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">{Text.close}</button>
         </form>
         <h3 className="font-bold text-lg">{isEdit?Text.editTask:Text.addTask}</h3>
         <input placeholder={Text.title} className="py-3 px-2 mt-3 bg-[rgb(14,17,23)] w-full placeholder-white rounded-lg" value={row?.title} onChange={(e) => setRow({ title: e?.target?.value, description: row.description })} />
         <textarea placeholder={Text.description} className="py-3 px-2 mt-3 bg-[rgb(14,17,23)] w-full placeholder-white rounded-lg" value={row?.description} onChange={(e) => setRow({ title: row?.title, description: e?.target?.value })} rows={8} />
         <div className='pt-3 flex justify-end'>
             {!isEdit ? <button className='btn btn-primary text-center text-white py-1' disabled={row?.title === '' || row?.description === '' ? true : false} onClick={() => {
                 handleClick(row)
                 setRow({ title: "", description: "" })
             }}>
                  {Text?.save}
             </button> : <button className='btn btn-primary text-center text-white py-1' disabled={row?.title === '' || row?.description === '' ? true : false} onClick={() => {
                 handleUpdate(row)
                 setRow({ title: "", description: "" })
             }}>
                  {Text?.update}
             </button>}
         </div>
     </div>
 </dialog>



    return (
        <div>
            {taskAddModal()}
            </div>
    )
}
