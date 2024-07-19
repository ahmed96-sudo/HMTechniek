'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Factureaddpage = () => {
    const [datechange1, setDatechange1] = useState(new Date().toISOString().slice(0, 10));
    const handleChange1 = (event) => {
        setDatechange1(event.target.value);
    }
    const [datechange2, setDatechange2] = useState(new Date().toISOString().slice(0, 10));
    const handleChange2 = (event) => {
        setDatechange2(event.target.value);
    }
    const [loadclient, setLoadclient] = useState([]);
    const [ttc, setTtc] = useState(0);
    const [tva, setTva] = useState(0);
    const [ht, setHt] = useState(0);
    const [linesfact, setLinesfact] = useState([]);
    const [factnum, setFactnum] = useState("");
    const [fact, setFact] = useState({});
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const factureclick = document.getElementById("factureclick");
        tableboard.style.backgroundColor = "#5E94FF";
        factureclick.style.backgroundColor = "#436AB8";
    },[]);
    useEffect(() => {
        document.getElementById("loadingcheckfactadd").classList.remove("-translate-y-full");
        fetch("/api/getsource?type=client")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactadd").classList.add("-translate-y-full");
                setLoadclient(data.result);
            } else {
                document.getElementById("loadingcheckfactadd").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(() => {
        document.getElementById("loadingcheckfactadd").classList.remove("-translate-y-full");
        fetch("/api/loadlastfactnum")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactadd").classList.add("-translate-y-full");
                setFactnum(data.result);
            } else {
                document.getElementById("loadingcheckfactadd").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    const linefactform = ()=>{
        var describelinefactform = document.getElementById("describelinefactform").value;
        var qtnlinefactform = document.getElementById("qtnlinefactform").value;
        var ttclinefactform = document.getElementById("ttclinefactform").value;
        if (describelinefactform == "" || qtnlinefactform == "" || ttclinefactform == "") {
            alert("All Fields Required");
            return;
        } else {
            var totalttc = qtnlinefactform * ttclinefactform;
            var newttc = ttc + totalttc;
            var newtva = newttc*0.21;
            var newht = newttc-newtva;
            setTtc(parseFloat(newttc.toFixed(1)));
            setTva(parseFloat(newtva.toFixed(1)));
            setHt(parseFloat(newht.toFixed(1)));
            var line = {
                describelinefactform: describelinefactform,
                qtnlinefactform: qtnlinefactform,
                ttclinefactform: ttclinefactform
            };
            setLinesfact([...linesfact, line]);
            describelinefactform = "";
            qtnlinefactform = "";
            ttclinefactform = "";
        }
    }
    const handleDeletelinefact = (index) => {
        var newlinesfact = [...linesfact];
        if (linesfact.length == 0) {
            alert("Add some Items");
            return;
        } else {
            var lastlinefact = linesfact[index];
            var lastttc = lastlinefact.ttclinefactform;
            var lastqtn = lastlinefact.qtnlinefactform;
            var lasttotalttc = lastttc*lastqtn;
            var newttc = ttc - lasttotalttc;
            var newtva = newttc*0.21;
            var newht = newttc-newtva;
            setTtc(parseFloat(newttc.toFixed(1)));
            setTva(parseFloat(newtva.toFixed(1)));
            setHt(parseFloat(newht.toFixed(1)));
            newlinesfact.splice(index, 1);
            setLinesfact(newlinesfact);
        }
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const numaddfactformall = document.getElementById("numaddfactformall").value;
        const dateaddfactformall = datechange1;
        var addfactpickingattachment;
        if (document.getElementById("addfactpickingattachment").files.length == 0) {
            addfactpickingattachment = "";
        } else {
            addfactpickingattachment = document.getElementById("addfactpickingattachment").files[0];
        }
        const selectaddfactformall = document.getElementById("selectaddfactformall").value;
        const infoaddfactformall = document.getElementById("infoaddfactformall").value;
        const tvacheckaddfactformall = document.getElementById("tvacheckaddfactformall").checked;
        if (linesfact.length == 0) {
            alert("Add some Items");
            return;
        } else {
            if (tvacheckaddfactformall == true) {
                const factobj = {
                    numaddfactformall: numaddfactformall,
                    dateaddfactformall: dateaddfactformall,
                    addfactpickingattachment : addfactpickingattachment,
                    selectaddfactformall: selectaddfactformall,
                    infoaddfactformall: infoaddfactformall,
                    tvacheckaddfactformall: tvacheckaddfactformall,
                    ttc: ttc,
                    tva: tva,
                    ht: ht,
                    linesfact: linesfact
                };
                console.log(factobj);
                const addreg = document.getElementById("addreg");
                addreg.classList.remove("hidden");
                const ttcaddreg = document.getElementById("ttcaddreg");
                ttcaddreg.value = ttc;
                setFact(factobj);
            } else {
                const factobj = {
                    numaddfactformall: numaddfactformall,
                    dateaddfactformall: dateaddfactformall,
                    addfactpickingattachment : addfactpickingattachment,
                    selectaddfactformall: selectaddfactformall,
                    infoaddfactformall: infoaddfactformall,
                    tvacheckaddfactformall: tvacheckaddfactformall,
                    ttc: ttc,
                    tva: tva,
                    ht: ttc,
                    linesfact: linesfact
                };
                console.log(factobj);
                const addreg = document.getElementById("addreg");
                addreg.classList.remove("hidden");
                const ttcaddreg = document.getElementById("ttcaddreg");
                ttcaddreg.value = ttc;
                setFact(factobj);
            }
        }
    }
    const handlenumcheck = ()=> {
        const numaddfactformall = document.getElementById("numaddfactformall");
        const numcheckaddfactformall = document.getElementById("numcheckaddfactformall");
        if (numcheckaddfactformall.checked == true) {
            numaddfactformall.disabled = false;
            numaddfactformall.value = "";
        } else {
            numaddfactformall.disabled = true;
            numaddfactformall.value = factnum;
        }
    }
    const handleCloseReg = ()=>{
        const addreg = document.getElementById("addreg");
        addreg.classList.add("hidden");
    }
    const handleRegSubmit = (e)=>{
        e.preventDefault();
        var regType;
        const radio1 = document.getElementById("especeaddreg");
        const radio2 = document.getElementById("creditaddreg");
        const radio3 = document.getElementById("repriseaddreg");
        const radio4 = document.getElementById("vireaddreg");
        const radio5 = document.getElementById("banqaddreg");
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
        const ttcaddreg = document.getElementById("ttcaddreg").value;
        const refaddreg = document.getElementById("refaddreg").value;
        const regobj = {
            regtype: regType,
            date: date2,
            ttcaddreg: ttcaddreg,
            refaddreg: refaddreg
        }
        const form = new FormData();
        form.append("numaddfactformall", fact.numaddfactformall);
        form.append("dateaddfactformall", JSON.stringify(fact.dateaddfactformall));
        form.append("addfactpickingattachment", fact.addfactpickingattachment);
        form.append("selectaddfactformall", fact.selectaddfactformall);
        form.append("infoaddfactformall", fact.infoaddfactformall);
        form.append("tvacheckaddfactformall", fact.tvacheckaddfactformall);
        form.append("ttc", fact.ttc);
        form.append("tva", fact.tva);
        form.append("ht", fact.ht);
        form.append("linesfact", JSON.stringify(fact.linesfact));
        form.append("regtype", regobj.regtype);
        form.append("date", JSON.stringify(date2));
        form.append("ttcaddreg", ttcaddreg);
        form.append("refaddreg", refaddreg);
        document.getElementById("loadingcheckfactadd").classList.remove("-translate-y-full");
        fetch("/api/addfact", {
            method: "POST",
            body: form
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactadd").classList.add("-translate-y-full");
                alert("Facture added");
                window.location.href = "/facture";
            } else {
                document.getElementById("loadingcheckfactadd").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <div id="loadingcheckfactadd" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <form onSubmit={handleSubmit}>
                <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Ajouter Facture</h1>
                <div className="flex flex-row justify-evenly">
                    <input type="text" required value={factnum} className="h-[40px] w-[80%] my-[10px] flex pl-[10px] border-[1px] border-[#999] rounded-[10px] bg-white" id="numaddfactformall" disabled />
                    <input type="checkbox" onClick={handlenumcheck} id="numcheckaddfactformall" />
                </div>
                <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[10px] flex" type="date" required value={datechange1} onChange={handleChange1} />
                <input type="file" className="text-[#5E94FF] mx-auto my-[10px] flex" id="addfactpickingattachment" />
                <div className="flex flex-col items-center">
                    <label>Client</label>
                    <select id="selectaddfactformall" required className="h-[40px] w-[80%] rounded-[10px] pl-[15px] mx-auto my-[10px]">
                        <option value=""></option>
                        {
                            loadclient.map((client,index)=>{
                                return (
                                    <option value={client.id_client} key={index}>{client.raison_social}</option>
                                );
                            })
                        }
                    </select>
                </div>
                <div className="flex flex-col items-center">
                    <label>Information Traditionels</label>
                    <input className="h-[70px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" id="infoaddfactformall" />
                </div>
                <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                    HT: {ht.toString()}
                </div>
                <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                    <div>TVA: {tva.toString()}</div>
                    <div className="ml-[20px]">
                        <input type="checkbox" defaultChecked id="tvacheckaddfactformall" />
                    </div>
                </div>
                <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                    TTC: {ttc.toString()}
                </div>
                <div className="flex flex-col">
                    <input className="h-[80px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" id="describelinefactform" placeholder="Designation" />
                    <input className="h-[40px] w-[70%] mx-auto pl-[10px] rounded-[10px] my-[10px]" type="number" placeholder="Quantite" id="qtnlinefactform" />
                    <input className="h-[40px] w-[70%] mx-auto pl-[10px] rounded-[10px] my-[10px]" type="number" placeholder="Prix Unit (TTC)" id="ttclinefactform" />
                    <div onClick={linefactform} className="h-[40px] w-[100px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] mx-auto flex items-center justify-center">Ajouter</div>
                </div>
                <div className="h-[400px] w-full overflow-y-auto flex flex-col mt-[10px]">
                    {
                        linesfact.map((line,index)=>{
                            return (
                                <div className="flex-shrink-0 flex-grow-0 basis-auto h-[200px] w-[90%] my-[20px] mx-auto bg-white rounded-[10px] border-[1px] border-[#999] shadow-md flex flex-col" key={index}>
                                    <div className="flex flex-col justify-evenly h-[150px] pl-[10px]">
                                        <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Designation:</span> {line.describelinefactform}</div>
                                        <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">QTE:</span> {line.qtnlinefactform}</div>
                                        <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Prix Unitaire:</span> {line.ttclinefactform}</div>
                                    </div>
                                    <div className="h-[50px] w-full flex justify-center items-center">
                                        <div className="h-[45px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px] cursor-pointer" onClick={()=>handleDeletelinefact(index)}>Supprimer</div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <button className="h-[50px] w-[170px] text-white bg-[#5E94FF] my-[10px] rounded-[10px] flex items-center justify-center mx-auto">Generate Document</button>
            </form>
            <form id="addreg" onSubmit={handleRegSubmit} className="hidden">
                <div className="flex flex-row-reverse h-[70px] items-center">
                    <div onClick={handleCloseReg} id="hamb" className="hamb" htmlFor="side-menu"><span id="hambline" className="hamb-line rotbef rotaft"></span></div>
                    <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF] w-full ml-[17%]">Reglement</h1>
                </div>
                <div className="flex flex-row justify-evenly h-[50px]">
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="especeaddreg" name="regtyperadio" /> Espece</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="creditaddreg" name="regtyperadio" /> Credit</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="repriseaddreg" name="regtyperadio" /> Reprise</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="vireaddreg" name="regtyperadio" /> Virement</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="banqaddreg" name="regtyperadio" /> Banque</label>
                </div>
                <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[20px] flex" type="date" required value={datechange2} onChange={handleChange2} />
                <input className="h-[40px] w-[75%] mx-auto pl-[10px] rounded-[10px] my-[20px] flex" type="number" placeholder="Prix Unit (TTC)" required id="ttcaddreg" />
                <input type="text" className="h-[40px] w-[80%] my-[10px] flex pl-[10px] border-[1px] border-[#999] rounded-[10px] bg-white mx-auto" id="refaddreg" placeholder="Reference" />
                <button className="h-[40px] w-[100px] text-white bg-[#5E94FF] my-[20px] rounded-[10px] mx-auto flex items-center justify-center">Valider</button>
            </form>
        </main>
    );
}

export default Factureaddpage;