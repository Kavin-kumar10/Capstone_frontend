import React, { useEffect,useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useSelector,useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

//icons
import { MdOutlineClose } from "react-icons/md";
import { IoIosArrowBack } from "react-icons/io";
import { FaHeart } from "react-icons/fa";

//Components
import Map from "../../Components/Map";

//Reducers
import { setPopClose,setPopOpen } from "../../Redux/MatchSlice";
import { setPostMessage,setPostToProfileId } from "../../Redux/MatchSlice";

//Async Functions
import { getMemberById } from "../../Redux/MemberSlice";
import { getPersonalInformationByMemberId } from "../../Redux/MemberSlice";
import { postLikesByMemberId } from "../../Redux/LikeSlice";
import { postNewMatch } from "../../Redux/MatchSlice";
import Toastify from "../../utils/Toastify";



const Profile = () =>{
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [img,setImg] = useState();

    //My Profile
    const myprofile = useSelector(state => state.Members.Profile)

    //Selected Member
    const selected = useSelector(state=>state.Members.Selected)

    //Pop
    const pop = useSelector(state => state.Match.pop)
    const postmatch = useSelector(state=>state.Match.PostMatchRequest)

    //Get Request for Selected 
    let value = useParams();
    console.log(value.userid);
    useEffect(()=>{
        window.scrollTo(0, 0);
        dispatch(getMemberById(value.userid))
    },[])
    console.log(selected);


    return(
        <div className="w-screen  flex flex-col p-5 md:p-10 lg:p-20 gap-5 bg-tertiary">

            {/* Preview image  */}
            {
                img?
                <div className="fixed top-0 left-0 flex flex-col items-center justify-center w-full h-screen bg-offmode bg-opacity-50 z-50">
                <div className="bg-tertiary rounded-lg w-full max-w-md p-6">
                  <div className="flex justify-between items-center">
                    <h1 className="text-xl font-bold">Preview</h1>
                    <button className="text-gray-500 hover:text-gray-700">
                      <MdOutlineClose onClick={()=>setImg()} size={24} />
                    </button>
                  </div>
                  <div className="aspect-square mt-4">
                    <img src={img} alt="preview" className="object-cover w-full h-full rounded-md" />
                  </div>
                </div>
              </div>:
              <></>
            }


            {/* Request pop */}
            {
                pop?
                <div id="MatchRequestPop" class="rounded-md h-screen z-20 w-screen fixed bg-mode bg-opacity-50 top-0 left-0 flex items-center justify-center">
                    <div class="bg-mode p-5 w-full m-1 md:w-1/2 lg:w-1/3 rounded-sm shadow-sm shadow-secondary">
                        <h1 class="text-primary text-xl md:text-2xl font-semibold my-3">Match Request</h1>
                        <p class="mb-3 text-lg text-secondary opacity-60">Match request to {selected.personName}</p>
                        <input onChange={(e)=>dispatch(setPostMessage(e.target.value))} id="message" name="message" class="rounded-md w-full px-2 md:px-5 py-1 md:py-2 outline-none border border-secondary" type="text" placeholder="Hey Let's get matched ...."/>
                        <div class="flex mt-3 gap-5">
                            <button onClick={()=>dispatch(setPopClose())} id="cancel" class="rounded-md bg-tertiary text-offmode border-2 border-tertiary md:px-4 md:py-1 px-2 py-1">Cancel</button>
                            <button onClick={async ()=>{
                                    try{
                                        const requestingAction = await dispatch(postNewMatch(postmatch))
                                        Toastify.success("Request Sent Successfull");
                                        dispatch(setPopClose())
                                    }
                                    catch(err){
                                        console.error(err)
                                    }
                                }
                            } id="submission"  class="rounded-md bg-primary text-mode border-2 border-primary md:px-4 md:py-1 px-2 py-1 ">Request</button>
                        </div>
                    </div>
                </div>:<></>
            }

            {/* Header */}

            <div className="flex items-center justify-between">
                <div onClick={()=>navigate(-1)} className="back font-bold cursor-pointer opacity-50 flex items-center justify-start ">
                    <IoIosArrowBack/> &nbsp;
                    <p className="hover:underline hidden sm:block">Back to home page</p>
                </div>
                {
                    myprofile.membership == 1 && myprofile.dailyLog ?
                    <p className="back font-bold opacity-50 flex items-center justify-start"> Credits Remain : {myprofile.dailyLog.creditsCount}</p>:<></>
                }
            </div>

            {/* Profile Pic layout */}

            <div className="flex gap-10 bg-mode p-3 sm:p-10 flex-col sm:flex-row">
                <div className="max-h-52 max-w-52 aspect-square rounded-md">
                    <img onClick={()=>setImg(selected.profilePic)} className="h-full cursor-pointer w-full rounded-full" src={selected.profilePic} alt="" />
                </div>
                <div className="flex-1 flex flex-col justify-center gap-3">
                    <h1 className="text-xl sm:text-3xl md:text-5xl font-bold text-primary opacity-65">{selected.personName}</h1>
                    {/* <p className="text-lg sm:text-xl md:text-2xl font-bold opacity-70">{selected.gender} - {selected.age} years old</p> */}
                    <div className="flex gap-2">
                        {selected.isVerified ?<div className="text-[#4398EF] px-2 py-1 text-sm rounded-md border-2 border-[#4398EF]">Verified</div>:<></>}
                        {selected.membership == 1 ?<div className="border-2 border-primary px-2 py-1 text-sm rounded-md text-primary">Premium</div>:<div className="border-2 border-green-600 px-2 py-1 text-sm rounded-md text-green-600">Free</div>}
                    </div>
                    <div className="flex flex-col gap-4 items-start">
                        <h1 className="text-md font-bold opacity-50">Hurry up ... ! Send Match Request Now ... !</h1>
                            <div className="flex gap-3">
                                <button onClick={async()=>
                                    {
                                        try{
                                            await dispatch(setPopOpen());
                                            await dispatch(setPostToProfileId(selected.memberId))
                                        }
                                        catch(err){
                                            console.error("Error Sending Request");
                                        }
                                        
                                    }
                                } className="text-tertiary bg-primary px-2 py-1 rounded-md">Request Match</button>
                                <button onClick={()=>{
                                    dispatch(postLikesByMemberId(selected.memberId))
                                    Toastify.success("Added to Wishlist");
                                    setTimeout(()=>{
                                        navigate('/Like')
                                    },1000)
                                    }} className="border-2 border-primary text-primary px-2 py-1 rounded-md flex gap-2 items-center justify-center"><FaHeart size={20}/> Hit</button>
                            </div>
                        </div>
                </div>
            </div>

            {/* About Layout */}

            <div className=" bg-mode p-5 flex flex-col gap-5">
                <div className="flex flex-col">
                    <h1 className="text-xl text-primary font-bold">About</h1>
                    <p className="text-md opacity-50 mb-2">Described as</p>
                    <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">{selected.about}</h2>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl mb-3 text-primary font-bold">Basics</h1>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Gender : {selected.gender}</h2>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Age : {selected.age}</h2>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Native : {selected.native}</h2>
                </div>
                <div className="flex flex-col">
                    <h1 className="text-xl mb-3 text-primary font-bold">Other Details</h1>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Mother Tongue : {selected.motherTongue}</h2>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Religion : {selected.religion}</h2>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Caste : {selected.caste}</h2>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Marital Status : {selected.maritalStatus}</h2>
                    <h2 className="font-semibold opacity-60 text-sm sm:text-md md:text-lg">Disabilities : {selected.disabilities}</h2>
                </div>
                {/* <div className="flex flex-col gap-2">
                    <h1 className="text-xl text-primary font-bold mb-1">Hobbies</h1>
                    <p className="text-md opacity-50 mb-5">Described as</p>
                    {
                        selected.hobby?.map((elem)=>
                            <h2 className="font-bold opacity-60 px-2 py-1 shadow-sm shadow-offmode w-fit rounded-md text-xs sm:text-sm md:text-md">#{elem.hobbyName}</h2>
                        )
                    }
                </div> */}
            </div>

            {/* Premium Layout (Credits) */}

            <div className="rounded-md bg-mode p-1 sm:p-3 md:p-5">
                {
                    selected.PersonalDetail?
                    <div className="">
                        <div className="rounded-md bg-mode p-1 sm:p-3 md:p-5">
                            <h1 className="text-xl font-bold mb-1 text-primary">More Images</h1>
                            <p className="text-md opacity-50">Click to preview</p>
                            <div className="flex gap-5 flex-wrap">
                                {
                                    selected.PersonalDetail.pictures.map((elem)=>
                                        <img onClick={()=>setImg(elem.pictureUrl)} className="h-32 w-32 bg-tertiary border-2 cursor-pointer rounded-md my-5 flex items-center justify-center" src={elem.pictureUrl} alt="" />
                                    )
                                }
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 md:gap-10 p-1 sm:p-3 md:p-5">
                            <div className="flex flex-col p-3 md:p-5 rounded-md shadow-sm shadow-offmode">
                                <h1 className="text-xl text-primary font-bold">Professional Status</h1>
                                <p className="text-md opacity-50 mb-2">Employment</p>
                                <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">Current job : {selected.PersonalDetail.professionName}</h2>
                                <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">Salary : {selected.PersonalDetail.annualIncome}</h2>
                                <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">Education : {selected.PersonalDetail.education}</h2>
                                <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">Mobile : {selected.PersonalDetail.mobile}</h2>
                            </div>
                            <div className="flex flex-col p-3 md:p-5 rounded-md shadow-sm shadow-offmode">
                                <h1 className="text-xl text-primary font-bold">Family Status</h1>
                                <p className="text-md opacity-50 mb-2">Family</p>
                                <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">Family Type : {selected.PersonalDetail.familyType}</h2>
                                <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">Family Status : {selected.PersonalDetail.familyStatus}</h2>
                                <h2 className="font-bold opacity-60 text-sm sm:text-md md:text-lg">Family Value : {selected.PersonalDetail.familyValue}</h2>
                            </div>
                        </div>
                        <Map/>
                    </div>:
                    <div className="template flex items-center justify-center h-80 w-full rounded-md border-2 border-dotted border-primary">
                        <button onClick={()=>dispatch(getPersonalInformationByMemberId(selected.memberId))} className="bg-primary text-mode px-4 py-2 rounded-md outline-none">Use Credits / Matched</button>
                    </div>
                }
            </div>

        </div>
    )
}

export default Profile