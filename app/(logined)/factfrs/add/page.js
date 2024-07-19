'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Factfrsaddpage = () => {
    const [datechange1, setDatechange1] = useState(new Date().toISOString().slice(0, 10));
    const handleChange1 = (event) => {
        setDatechange1(event.target.value);
    }
    const [datechange2, setDatechange2] = useState(new Date().toISOString().slice(0, 10));
    const handleChange2 = (event) => {
        setDatechange2(event.target.value);
    }
    const [loadfrs, setLoadfrs] = useState([]);
    const [factfrs, setFactfrs] = useState({});
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const factfrsclick = document.getElementById("factfrsclick");
        tableboard.style.backgroundColor = "#5E94FF";
        factfrsclick.style.backgroundColor = "#436AB8";
    },[]);
    useEffect(() => {
        document.getElementById("loadingcheckfactfrsadd").classList.remove("-translate-y-full");
        fetch("/api/getsource?type=frs")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactfrsadd").classList.add("-translate-y-full");
                setLoadfrs(data.result);
            } else {
                document.getElementById("loadingcheckfactfrsadd").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    const handleSubmit = (e)=>{
        e.preventDefault();
        const selectfactfrs = document.getElementById("addselectfactfrs").value;
        if (selectfactfrs == '') {
            alert("Select a Frs");
        } else if (datechange1 == '') {
            alert("Pick a Date");
        } else {
            const datefactfrs = datechange1;
            const montantfactfrs = document.getElementById("montantaddfactfrs").value;
            var addfactfrspickingattachment;
            if (document.getElementById("addfactfrspickingattachment").files.length == 0) {
                addfactfrspickingattachment = "";
            } else {
                addfactfrspickingattachment = document.getElementById("addfactfrspickingattachment").files[0];
            }
            const factfrsobj = {
                selectfactfrs: selectfactfrs,
                datefactfrs: datefactfrs,
                montantfactfrs: montantfactfrs,
                addfactfrspickingattachment: addfactfrspickingattachment
            }
            console.log(factfrsobj);
            const addreg = document.getElementById("addregfrs");
            addreg.classList.remove("hidden");
            const ttcaddreg = document.getElementById("ttcaddregfrs");
            ttcaddreg.value = montantfactfrs;
            setFactfrs(factfrsobj);
        }
    }
    const handleCloseReg = ()=>{
        const addreg = document.getElementById("addregfrs");
        addreg.classList.add("hidden");
    }
    const handleRegSubmit = (e)=>{
        e.preventDefault();
        var regType;
        const radio1 = document.getElementById("especeaddregfrs");
        const radio2 = document.getElementById("creditaddregfrs");
        const radio3 = document.getElementById("repriseaddregfrs");
        const radio4 = document.getElementById("vireaddregfrs");
        const radio5 = document.getElementById("banqaddregfrs");
        if (radio1.checked) {
            regtype = "Espece";
        } else if (radio2.checked) {
            regtype = "Credit";
        } else if (radio3.checked) {
            regtype = "Reprise";
        } else if (radio4.checked) {
            regtype = "Virement";
        } else if (radio5.checked) {
            regtype = "Banque";
        }
        const date2 = datechange2;
        const ttcaddregfrs = document.getElementById("ttcaddregfrs").value;
        const refaddregfrs = document.getElementById("refaddregfrs").value;
        const regobj = {
            regtype: regType,
            date: date2,
            ttcaddregfrs: ttcaddregfrs,
            refaddregfrs: refaddregfrs
        }
        const form = new FormData();
        form.append("selectfactfrs", factfrs.selectfactfrs);
        form.append("datefactfrs", JSON.stringify(factfrs.datefactfrs));
        form.append("montantfactfrs", factfrs.montantfactfrs);
        form.append("addfactfrspickingattachment", factfrs.addfactfrspickingattachment);
        form.append("regtype", regobj.regtype);
        form.append("date", JSON.stringify(date2));
        form.append("ttcaddregfrs", ttcaddregfrs);
        form.append("refaddregfrs", refaddregfrs);
        document.getElementById("loadingcheckfactfrsadd").classList.remove("-translate-y-full");
        fetch("/api/addfactfrs", {
            method: "POST",
            body: form
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactfrsadd").classList.add("-translate-y-full");
                alert("Facture Frs added");
                window.location.href = "/factfrs";
            } else {
                document.getElementById("loadingcheckfactfrsadd").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <div id="loadingcheckfactfrsadd" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <form className="flex flex-col items-center" onSubmit={handleSubmit}>
                <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Ajouter Fact Frs</h1>
                <select id="addselectfactfrs" required className="h-[40px] w-[200px] rounded-[10px] pl-[15px] mx-auto my-[10px]">
                    <option value="" key=""></option>
                    {
                        loadfrs.map((factfrs,index)=>{
                            return (
                                <option value={factfrs.id_client} key={factfrs.id_client}>{factfrs.raison_social}</option>
                            );
                        })
                    }
                </select>
                <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[10px]" type="date" required value={datechange1} onChange={handleChange1} />
                <label>Montant</label>
                <input className="h-[40px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="number" required id="montantaddfactfrs" />
                <label>Attachement</label>
                <input type="file" className="text-[#5E94FF] mx-auto my-[10px]" id="addfactfrspickingattachment" />
                <button className="h-[50px] w-[150px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] flex items-center justify-center mx-auto">Enregister</button>
            </form>
            <form id="addregfrs" onSubmit={handleRegSubmit} className="hidden">
                <div className="flex flex-row-reverse h-[70px] items-center">
                    <div onClick={handleCloseReg} id="hambfrs" className="hamb" htmlFor="side-menu"><span id="hamblinefrs" className="hamb-line rotbef rotaft"></span></div>
                    <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF] w-full ml-[17%]">Reglement</h1>
                </div>
                <div className="flex flex-row justify-evenly h-[50px]">
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="especeaddregfrs" name="regtyperadio" /> Espece</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="creditaddregfrs" name="regtyperadio" /> Credit</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="repriseaddregfrs" name="regtyperadio" /> Reprise</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="vireaddregfrs" name="regtyperadio" /> Virement</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="banqaddregfrs" name="regtyperadio" /> Banque</label>
                </div>
                <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[20px] flex" type="date" required value={datechange2} onChange={handleChange2} />
                <input className="h-[40px] w-[75%] mx-auto pl-[10px] rounded-[10px] my-[20px] flex" type="number" placeholder="Prix Unit (TTC)" required id="ttcaddregfrs" />
                <input type="text" className="h-[40px] w-[80%] my-[10px] flex pl-[10px] border-[1px] border-[#999] rounded-[10px] bg-white mx-auto" id="refaddregfrs" placeholder="Reference" />
                <button className="h-[40px] w-[100px] text-white bg-[#5E94FF] my-[20px] rounded-[10px] mx-auto flex items-center justify-center">Valider</button>
            </form>
        </main>
    );
}

export default Factfrsaddpage;