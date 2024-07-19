'use client'

import { useEffect } from "react";

// #436AB8
// #5E94FF
const FooterMenu = () => {
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const devisclick = document.getElementById("devisclick");
        const factureclick = document.getElementById("factureclick");
        const factfrsclick = document.getElementById("factfrsclick");
        const chargeclick = document.getElementById("chargeclick");
        const sourceclick = document.getElementById("sourceclick");
        const paraclick = document.getElementById("paraclick");
        const deconnclick = document.getElementById("deconnclick");
        tableboard.addEventListener("click", () => {
            window.location.href = "/dashboard";
        });
        devisclick.addEventListener("click", () => {
            window.location.href = "/devis";
        });
        factureclick.addEventListener("click", () => {
            window.location.href = "/facture";
        });
        factfrsclick.addEventListener("click", () => {
            window.location.href = "/factfrs";
        });
        chargeclick.addEventListener("click", () => {
            window.location.href = "/charge";
        });
        sourceclick.addEventListener("click", () => {
            window.location.href = "/source";
        });
        paraclick.addEventListener("click", () => {
            window.location.href = "/parametre";
        });
        deconnclick.addEventListener("click", () => {
            window.location.href = "/";
        });
    },[]);
    return (
        <footer className="w-full h-[80px] flex flex-col sticky bottom-0">
            <hr className="border-t-2"/>
            <div className="w-full h-[80px] flex flex-row items-center overflow-x-auto">
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#436AB8] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="tableboard">Tableu De Board</div>
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#5E94FF] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="devisclick">Devis</div>
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#5E94FF] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="factureclick">Facture</div>
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#5E94FF] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="factfrsclick">Fact Frs</div>
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#5E94FF] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="chargeclick">Charges</div>
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#5E94FF] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="sourceclick">Sources</div>
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#5E94FF] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="paraclick">Parametre</div>
                <div className="flex-grow-0 flex-shrink-0 basis-auto h-[80%] w-[150px] bg-[#5E94FF] text-white text-[17px] flex justify-center items-center mx-[20px] rounded-[20px] cursor-pointer" id="deconnclick">Deconection</div>
            </div>
        </footer>
    );
}

export default FooterMenu;