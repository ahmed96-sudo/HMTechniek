'use client'

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Suspensedata = ()=>{
    const searchparam = useSearchParams();
    const facturefrsid = searchparam.get("facturefrsid");
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
    const [datafetched, setDatafetched] = useState({});
    useEffect(() => {
        document.getElementById("loadingcheckfactfrsedit").classList.remove("-translate-y-full");
        fetch("/api/getsource?type=frs")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactfrsedit").classList.add("-translate-y-full");
                setLoadfrs(data.result);
            } else {
                document.getElementById("loadingcheckfactfrsedit").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(()=>{
        document.getElementById("loadingcheckfactfrsedit").classList.remove("-translate-y-full");
        fetch(`/api/geteditfactfrs?facturefrsid=${facturefrsid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactfrsedit").classList.add("-translate-y-full");
                setDatafetched(data.result.factfrsobj);
                const dateFromBackend = new Date(String(data.result.factfrsobj.date_facture));
                const formattedDate = dateFromBackend.toISOString().slice(0, 10);
                setDatechange1(formattedDate);
                document.getElementById("editselectfactfrs").value = String(data.result.factfrsobj.id_client);
            } else {
                document.getElementById("loadingcheckfactfrsedit").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    },[facturefrsid]);
    const handleSubmit = (e)=>{
        e.preventDefault();
        const selectfactfrs = document.getElementById("editselectfactfrs").value;
        if (selectfactfrs == '') {
            alert("Select a Frs");
        } else if (datechange1 == '') {
            alert("Pick a Date");
        } else {
            const datefactfrs = datechange1;
            const montantfactfrs = document.getElementById("montanteditfactfrs").value;
            var editfactfrspickingattachment;
            if (document.getElementById("editfactfrspickingattachment").files.length == 0) {
                editfactfrspickingattachment = "";
            } else {
                editfactfrspickingattachment = document.getElementById("editfactfrspickingattachment").files[0];
            }
            const factfrsobj = {
                selectfactfrs: selectfactfrs,
                datefactfrs: datefactfrs,
                montantfactfrs: montantfactfrs,
                editfactfrspickingattachment: editfactfrspickingattachment
            }
            console.log(factfrsobj);
            const editreg = document.getElementById("editregfrs");
            editreg.classList.remove("hidden");
            const ttceditreg = document.getElementById("ttceditregfrs");
            ttceditreg.value = montantfactfrs;
            setFactfrs(factfrsobj);
        }
    }
    const handleCloseReg = ()=>{
        const editreg = document.getElementById("editregfrs");
        editreg.classList.add("hidden");
    }
    const handleRegSubmit = (e)=>{
        e.preventDefault();
        var regType;
        const radio1 = document.getElementById("especeeditregfrs");
        const radio2 = document.getElementById("crediteditregfrs");
        const radio3 = document.getElementById("repriseeditregfrs");
        const radio4 = document.getElementById("vireeditregfrs");
        const radio5 = document.getElementById("banqeditregfrs");
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
        const ttceditregfrs = document.getElementById("ttceditregfrs").value;
        const refeditregfrs = document.getElementById("refeditregfrs").value;
        const regobj = {
            regtype: regType,
            date: date2,
            ttceditregfrs: ttceditregfrs,
            refeditregfrs: refeditregfrs
        }
        const form = new FormData();
        form.append("selectfactfrs", factfrs.selectfactfrs);
        form.append("datefactfrs", JSON.stringify(factfrs.datefactfrs));
        form.append("montantfactfrs", factfrs.montantfactfrs);
        form.append("editfactfrspickingattachment", factfrs.editfactfrspickingattachment);
        form.append("regtype", regobj.regtype);
        form.append("date", JSON.stringify(date2));
        form.append("ttceditregfrs", ttceditregfrs);
        form.append("refeditregfrs", refeditregfrs);
        form.append("facturefrsid", facturefrsid);
        document.getElementById("loadingcheckfactfrsedit").classList.remove("-translate-y-full");
        fetch("/api/editfactfrs", {
            method: "POST",
            body: form
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactfrsedit").classList.add("-translate-y-full");
                alert("Facture Frs Edited");
                window.location.href = "/factfrs";
            } else {
                document.getElementById("loadingcheckfactfrsedit").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <div id="loadingcheckfactfrsedit" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center">
                <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Modifier Fact Frs</h1>
                <select id="editselectfactfrs" required className="h-[40px] w-[200px] rounded-[10px] pl-[15px] mx-auto my-[10px]">
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
                <input className="h-[40px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="number" defaultValue={datafetched.total_ttc} required id="montanteditfactfrs" />
                <label>Attachement</label>
                <input type="file" className="text-[#5E94FF] mx-auto my-[10px]" id="editfactfrspickingattachment" />
                <button className="h-[50px] w-[150px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] flex items-center justify-center mx-auto">Enregister</button>
            </form>
            <form id="editregfrs" onSubmit={handleRegSubmit} className="hidden">
                <div className="flex flex-row-reverse h-[70px] items-center">
                    <div onClick={handleCloseReg} id="hambeditfrs" className="hamb" htmlFor="side-menu"><span id="hamblineeditfrs" className="hamb-line rotbef rotaft"></span></div>
                    <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF] w-full ml-[17%]">Reglement</h1>
                </div>
                <div className="flex flex-row justify-evenly h-[50px]">
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="especeeditregfrs" name="regtyperadio" /> Espece</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="crediteditregfrs" name="regtyperadio" /> Credit</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="repriseeditregfrs" name="regtyperadio" /> Reprise</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="vireeditregfrs" name="regtyperadio" /> Virement</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="banqeditregfrs" name="regtyperadio" /> Banque</label>
                </div>
                <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[20px] flex" type="date" required value={datechange2} onChange={handleChange2} />
                <input className="h-[40px] w-[75%] mx-auto pl-[10px] rounded-[10px] my-[20px] flex" type="number" placeholder="Prix Unit (TTC)" required id="ttceditregfrs" />
                <input type="text" className="h-[40px] w-[80%] my-[10px] flex pl-[10px] border-[1px] border-[#999] rounded-[10px] bg-white mx-auto" id="refeditregfrs" placeholder="Reference" />
                <button className="h-[40px] w-[100px] text-white bg-[#5E94FF] my-[20px] rounded-[10px] mx-auto flex items-center justify-center">Valider</button>
            </form>
        </main>
    );
}

const Factfrseditpage = () => {
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const factfrsclick = document.getElementById("factfrsclick");
        tableboard.style.backgroundColor = "#5E94FF";
        factfrsclick.style.backgroundColor = "#436AB8";
    },[]);
    return (
        <Suspense fallback={<div className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in">Loading...</div>}>
            <Suspensedata />
        </Suspense>
    );
}

export default Factfrseditpage;