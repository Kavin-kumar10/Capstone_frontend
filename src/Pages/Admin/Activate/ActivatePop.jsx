import React from "react";
import { useSelector,useDispatch } from "react-redux";
import { setSelected,setPlan,setRole } from "../../../Redux/AdminSlice";
import { ActivateMember } from "../../../Redux/AdminSlice";

const ActivatePop = () =>{
    const Selected = useSelector(state=>state.Admin.Selected)
    const Activator = useSelector(state=>state.Admin.Activate)
    const dispatch = useDispatch();
    return(
        <div id="ActivatePop" className="rounded-md h-screen z-20 w-screen fixed bg-white bg-opacity-50 top-0 left-0 flex items-center justify-center">
        <div className="bg-white p-5 w-full m-1 sm:w-1/2 lg:w-1/3 rounded-md shadow-sm shadow-secondary">
            <h1 className="text-primary opacity-80 text-xl md:text-3xl font-bold my-3">Activate Account</h1>
            <p className="mb-3 text-lg text-secondary opacity-60">Member Id : {Selected.memberId}</p>
            <div className="w-full mb-3">
                <select onChange={(e)=>dispatch(setRole(e.target.value))} name="Role" className=" w-full px-3 py-2 text-base text-gray-700 rounded-md border border-gray-300 focus:outline-none">
                    <option value="" selected>Select an option</option>
                    <option value={0}>User</option>
                    <option value={1}>Admin</option>
                </select>
            </div>

            <div className="w-full">
                <select onChange={(e)=>dispatch(setPlan(e.target.value))
                    
                } name="Membership" className=" w-full px-3 py-2 text-base text-gray-700 rounded-md border border-gray-300 focus:outline-none">
                    <option value="" selected>Select an option</option>
                    <option value={0}>Free</option>
                    <option value={1}>Prime</option>
                </select>
            </div>

            
            <div className="flex mt-3">
                <button onClick={()=>dispatch(setSelected({}))} id="cancel"  className="rounded-md bg-tertiary text-primary border-2 opacity-80 border-primary md:px-4 md:py-1 px-2 py-1 ">Cancel</button>
                <button onClick={()=>{
                    dispatch(ActivateMember(Activator));
                    setTimeout(()=>{
                        window.location.reload()
                    },1000)
                }} id="submission" className="rounded-md bg-primary opacity-80 text-tertiary border-2 border-primary md:px-4 md:py-1 px-2 py-1 ml-5 ">Activate</button>
            </div>
        </div>
    </div>
    )
}

export default ActivatePop