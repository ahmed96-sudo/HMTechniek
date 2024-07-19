'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Chargeaddform = () => {
    const [datechange1, setDatechange1] = useState(new Date().toISOString().slice(0, 10));
    const handleChange1 = (event) => {
        setDatechange1(event.target.value);
    }
    const [loadcharges, setLoadcharges] = useState([]);
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const chargeclick = document.getElementById("chargeclick");
        tableboard.style.backgroundColor = "#5E94FF";
        chargeclick.style.backgroundColor = "#436AB8";
    },[]);
    useEffect(() => {
        document.getElementById("loadingcheckaddcharge").classList.remove("-translate-y-full");
        fetch("/api/getchargetype")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckaddcharge").classList.add("-translate-y-full");
                setLoadcharges(data.result);
            } else {
                document.getElementById("loadingcheckaddcharge").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    const handleSubmit = (e)=>{
        e.preventDefault();
        const selectcharge = document.getElementById("addselectcharge").value;
        if (selectcharge == '') {
            alert("Select a Charge");
        } else if (datechange1 == '') {
            alert("Pick a Date");
        } else {
            const datecharge = datechange1;
            const designationcharge = document.getElementById("designationaddcharge").value;
            const montantcharge = document.getElementById("montantaddcharge").value;
            var addchargepickingattachment;
            if (document.getElementById("addchargepickingattachment").files.length == 0) {
                addchargepickingattachment = "";
            } else {
                addchargepickingattachment = document.getElementById("addchargepickingattachment").files[0];
            }
            const form = new FormData();
            form.append("selectcharge", selectcharge);
            form.append("datecharge", JSON.stringify(datecharge));
            form.append("designationcharge", designationcharge);
            form.append("montantcharge", montantcharge);
            form.append("addchargepickingattachment", addchargepickingattachment);
            document.getElementById("loadingcheckaddcharge").classList.remove("-translate-y-full");
            fetch("/api/addcharge", {
                method: "POST",
                body: form
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("loadingcheckaddcharge").classList.add("-translate-y-full");
                    alert("charge added");
                    window.location.href = "/charge";
                } else {
                    document.getElementById("loadingcheckaddcharge").classList.add("-translate-y-full");
                    alert(data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    }
    return (
        <form className="flex-[1] overflow-y-auto flex flex-col items-center" onSubmit={handleSubmit}>
            <div id="loadingcheckaddcharge" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Ajouter Charge</h1>
            <select id="addselectcharge" required className="h-[40px] w-[200px] rounded-[10px] pl-[15px] mx-auto my-[10px]">
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
            <input className="h-[70px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" required id="designationaddcharge" />
            <label>Montant</label>
            <input className="h-[40px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="number" required id="montantaddcharge" />
            <label>Attachement</label>
            <input type="file" className="text-[#5E94FF] mx-auto my-[10px]" id="addchargepickingattachment" />
            <button className="h-[50px] w-[150px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] flex items-center justify-center mx-auto">Enregister</button>
        </form>
    );
}

export default Chargeaddform;