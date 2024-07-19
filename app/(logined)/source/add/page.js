'use client'

import Image from "next/image";
import { useEffect, useState } from "react";

const Sourceaddpage = () => {
    const [imageUrl, setImageUrl] = useState('');
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };
    useEffect(() => {
        const tableboard = document.getElementById("tableboard");
        const sourceclick = document.getElementById("sourceclick");
        tableboard.style.backgroundColor = "#5E94FF";
        sourceclick.style.backgroundColor = "#436AB8";
    }, []);
    const handleSubmit = (e)=>{
        e.preventDefault();
        const showimage = imageUrl ? imageUrl : "/user.png";
        const socialaddsource = document.getElementById("socialaddsource").value;
        const responaddsource = document.getElementById("responaddsource").value;
        const iceaddsource = document.getElementById("iceaddsource").value;
        const tlfaddsource = document.getElementById("tlfaddsource").value;
        const idenaddsource = document.getElementById("idenaddsource").value;
        const tlf2addsource = document.getElementById("tlf2addsource").value;
        const cnssaddsource = document.getElementById("cnssaddsource").value;
        const emailaddsource = document.getElementById("emailaddsource").value;
        const villeaddsource = document.getElementById("villeaddsource").value;
        const addresaddsource = document.getElementById("addresaddsource").value;
        const clientaddsource = document.getElementById("clientaddsource").checked;
        var sourcetype = clientaddsource ? "Client" : "Fournisseur";
        const source = {
            socialaddsource: socialaddsource,
            responaddsource: responaddsource,
            iceaddsource: iceaddsource,
            tlfaddsource: tlfaddsource,
            idenaddsource: idenaddsource,
            tlf2addsource: tlf2addsource,
            cnssaddsource: cnssaddsource,
            emailaddsource: emailaddsource,
            villeaddsource: villeaddsource,
            addresaddsource: addresaddsource,
            sourcetype: sourcetype,
            showimage: showimage
        }
        document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
        fetch("/api/addsource", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({source:source})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert("Source Added");
                window.location.href = "/source";
            } else {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    return (
        <form className="flex-[1] overflow-y-auto" onSubmit={handleSubmit}>
            <div id="loadingcheckaddsource" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Ajouter Source</h1>
            <div className="flex flex-row">
                {imageUrl? (
                    <Image
                        src={imageUrl}
                        alt="user photo"
                        className='w-[100px] h-[100px] border-[1px] border-[#999] m-[10px] p-[10px]'
                        id="showimage"
                        width={100}
                        height={100}
                    />
                    ) : (
                    <Image
                        src="/user.png"
                        alt="user photo"
                        className='w-[100px] h-[100px] border-[1px] border-[#999] m-[10px] p-[10px]'
                        id="showimage"
                        width={100}
                        height={100}
                    />
                )}
                <div className="flex flex-col justify-center w-[60%]">
                    <input
                        type="file"
                        className="text-[#5E94FF]"
                        id="pickingimage"
                        onChange={handleImageChange}
                        accept="image/*"
                    />
                    <label className="h-[30px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white my-[10px] rounded-[10px]" htmlFor="pickingimage">Reverse</label>
                </div>
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">Raison Social</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" required id="socialaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">Responsable</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" required id="responaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">ICE</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" placeholder="00000000000000" required id="iceaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">TLF</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" required id="tlfaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">Identifiant Fiscal</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" placeholder="0000" required id="idenaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">TLF 2</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" placeholder="0" id="tlf2addsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">CNSS</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" placeholder="0000" required id="cnssaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">Email</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" placeholder="@" required id="emailaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">Ville</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" id="villeaddsource" />
            </div>
            <div className="flex flex-col h-[70px] w-full">
                <div className="pl-[20px]">Addresse</div>
                <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" required id="addresaddsource" />
            </div>
            <div className="flex flex-row justify-evenly items-center h-[50px]">
                <div>
                    <label><input type="radio" required id="clientaddsource" name="sourcetyperadio" defaultChecked /> Client</label>
                </div>
                <div>
                    <label><input type="radio" required id="fouraddsource" name="sourcetyperadio" /> Fournisseur</label>
                </div>
            </div>
            <div className="w-full h-[65px]">
                <button className="w-[70%] h-[85%] flex items-center justify-center mx-auto bg-[#5E94FF] text-white rounded-[10px]">Ajouter</button>
            </div>
        </form>
    );
}

export default Sourceaddpage;