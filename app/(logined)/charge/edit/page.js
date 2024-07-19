'use client'

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Suspensedata = ()=>{
    const [datechange1, setDatechange1] = useState(new Date().toISOString().slice(0, 10));
    const handleChange1 = (event) => {
        setDatechange1(event.target.value);
    }
    const searchparam = useSearchParams();
    const chargeid = searchparam.get("chargeid");
    const [datafetched, setDatafetched] = useState({});
    const [loadcharges, setLoadcharges] = useState([]);
    useEffect(() => {
        document.getElementById("loadingcheckeditcharge").classList.remove("-translate-y-full");
        fetch("/api/getchargetype")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckeditcharge").classList.add("-translate-y-full");
                setLoadcharges(data.result);
            } else {
                document.getElementById("loadingcheckeditcharge").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(()=>{
        document.getElementById("loadingcheckeditcharge").classList.remove("-translate-y-full");
        fetch(`/api/geteditcharge?chargeid=${chargeid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckeditcharge").classList.add("-translate-y-full");
                const dateFromBackend = new Date(String(data.result.dt));
                const formattedDate = dateFromBackend.toISOString().slice(0, 10);
                setDatafetched(data.result);
                setDatechange1(formattedDate);
                document.getElementById("editselectcharge").value = data.result.title;
            } else {
                document.getElementById("loadingcheckeditcharge").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    },[chargeid]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        const selectcharge = document.getElementById("editselectcharge").value;
        if (selectcharge == '') {
            alert("Select a Charge");
        } else if (datechange1 == '') {
            alert("Pick a Date");
        } else {
            const datecharge = datechange1;
            const designationcharge = document.getElementById("designationeditcharge").value;
            const montantcharge = document.getElementById("montanteditcharge").value;
            var attachmentcharge;
            if (document.getElementById("pickingeditattachment").files.length == 0) {
                attachmentcharge = "";
            } else {
                attachmentcharge = document.getElementById("pickingeditattachment").files[0];
            }
            const form = new FormData();
            form.append("selectcharge", selectcharge);
            form.append("datecharge", JSON.stringify(datecharge));
            form.append("designationcharge", designationcharge);
            form.append("montantcharge", montantcharge);
            form.append("attachmentcharge", attachmentcharge);
            form.append("chargeid", chargeid);
            document.getElementById("loadingcheckeditcharge").classList.remove("-translate-y-full");
            fetch("/api/editcharge", {
                method: "POST",
                body: form
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("loadingcheckeditcharge").classList.add("-translate-y-full");
                    alert("Line Charge Edited");
                    window.location.href = "/charge";
                } else {
                    document.getElementById("loadingcheckeditcharge").classList.add("-translate-y-full");
                    alert(data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    }
    return (
        <form className="flex-[1] overflow-y-auto flex flex-col items-center" onSubmit={handleSubmit}>
            <div id="loadingcheckeditcharge" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Modifier Charge</h1>
            <select id="editselectcharge" required className="h-[40px] w-[200px] rounded-[10px] pl-[15px] mx-auto my-[10px]">
                <option value="" key=""></option>
                {
                    loadcharges.map((charge,index)=>{
                        return (
                            <option value={charge.title} key={index}>{(charge.title).slice(0,1).toUpperCase() + (charge.title).slice(1,(charge.title).length)}</option>
                        );
                    })
                }
            </select>
            <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[10px]" type="date" required value={datechange1} onChange={handleChange1} />
            <label>Designation</label>
            <input className="h-[70px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" defaultValue={datafetched.designation} required id="designationeditcharge" />
            <label>Montant</label>
            <input className="h-[40px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="number" defaultValue={datafetched.montant} required id="montanteditcharge" />
            <label>Attachement</label>
            <input type="file" className="text-[#5E94FF] mx-auto my-[10px]" id="pickingeditattachment" />
            <button className="h-[50px] w-[150px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] flex items-center justify-center mx-auto">Enregister</button>
        </form>
    );
}

const Chargeeditform = () => {
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const chargeclick = document.getElementById("chargeclick");
        tableboard.style.backgroundColor = "#5E94FF";
        chargeclick.style.backgroundColor = "#436AB8";
    },[]);
    return (
        <Suspense fallback={<div className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in">Loading...</div>}>
            <Suspensedata />
        </Suspense>
    );
}

export default Chargeeditform;