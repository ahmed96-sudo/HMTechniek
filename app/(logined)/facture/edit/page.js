'use client'

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Suspensedata = ()=>{
    const searchparam = useSearchParams();
    const factureid = searchparam.get("factureid");
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
    const [datafetched, setDatafetched] = useState({});
    const [fact, setFact] = useState({});
    
    useEffect(() => {
        document.getElementById("loadingcheckfactedit").classList.remove("-translate-y-full");
        fetch("/api/getsource?type=client")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactedit").classList.add("-translate-y-full");
                setLoadclient(data.result);
            } else {
                document.getElementById("loadingcheckfactedit").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(() => {
        document.getElementById("loadingcheckfactedit").classList.remove("-translate-y-full");
        fetch(`/api/geteditfact?factureid=${factureid}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactedit").classList.add("-translate-y-full");
                document.getElementById("selecteditfactformall").value = String(data.result.factobj.id_client);
                setDatafetched(data.result.factobj);
                setTtc(parseFloat(data.result.factobj.total_ttc.toFixed(1)));
                var newttc = data.result.factobj.total_ttc;
                var newtva = newttc*0.21;
                var newht = newttc-newtva;
                setTva(parseFloat(newtva.toFixed(1)));
                setHt(parseFloat(newht.toFixed(1)));
                setLinesfact(data.result.lines);
                setFactnum(data.result.factobj.numeroFacture);
                const dateFromBackend = new Date(String(data.result.factobj.date_facture));
                const formattedDate = dateFromBackend.toISOString().slice(0, 10);
                setDatechange1(formattedDate);
                if (data.result.factobj.tva == 1) {
                    document.getElementById("tvacheckeditfactformall").checked = true;
                } else {
                    document.getElementById("tvacheckeditfactformall").checked = false;
                }
            } else {
                document.getElementById("loadingcheckfactedit").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, [factureid]);
    const linefactform = ()=>{
        var editdescribelinefactform = document.getElementById("editdescribelinefactform").value;
        var editqtnlinefactform = document.getElementById("editqtnlinefactform").value;
        var editttclinefactform = document.getElementById("editttclinefactform").value;
        if (editdescribelinefactform == "" || editqtnlinefactform == "" || editttclinefactform == "") {
            alert("All Fields Required");
            return;
        } else {
            var totalttc = editqtnlinefactform * editttclinefactform;
            var newttc = ttc + totalttc;
            var newtva = newttc*0.21;
            var newht = newttc-newtva;
            setTtc(parseFloat(newttc.toFixed(1)));
            setTva(parseFloat(newtva.toFixed(1)));
            setHt(parseFloat(newht.toFixed(1)));
            var line = {
                designation: editdescribelinefactform,
                qte: editqtnlinefactform,
                prix: editttclinefactform
            };
            setLinesfact([...linesfact, line]);
            editdescribelinefactform = "";
            editqtnlinefactform = "";
            editttclinefactform = "";
        }
    }
    const handleDeletelinefact = (index) => {
        var newlinesfact = [...linesfact];
        if (linesfact.length == 0) {
            alert("Add some Items");
            return;
        } else {
            var lastlinefact = linesfact[index];
            var lastttc = lastlinefact.prix;
            var lastqtn = lastlinefact.qte;
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
        const numeditfactformall = document.getElementById("numeditfactformall").value;
        const dateeditfactformall = datechange1;
        var editfactpickingattachment;
        if (document.getElementById("editfactpickingattachment").files.length == 0) {
            editfactpickingattachment = "";
        } else {
            editfactpickingattachment = document.getElementById("editfactpickingattachment").files[0];
        }
        const selecteditfactformall = document.getElementById("selecteditfactformall").value;
        const infoeditfactformall = document.getElementById("infoeditfactformall").value;
        const tvacheckeditfactformall = document.getElementById("tvacheckeditfactformall").checked;
        if (linesfact.length == 0) {
            alert("Add some Items");
            return;
        } else {
            if (tvacheckeditfactformall == true) {
                const factobj = {
                    numeditfactformall: numeditfactformall,
                    dateeditfactformall: dateeditfactformall,
                    editfactpickingattachment: editfactpickingattachment,
                    selecteditfactformall: selecteditfactformall,
                    infoeditfactformall: infoeditfactformall,
                    tvacheckeditfactformall: tvacheckeditfactformall,
                    ttc: ttc,
                    tva: tva,
                    ht: ht,
                    linesfact: linesfact
                };
                console.log(factobj);
                const editreg = document.getElementById("editreg");
                editreg.classList.remove("hidden");
                const ttceditreg = document.getElementById("ttceditreg");
                ttceditreg.value = ttc;
                setFact(factobj);
            } else {
                const factobj = {
                    numeditfactformall: numeditfactformall,
                    dateeditfactformall: dateeditfactformall,
                    editfactpickingattachment: editfactpickingattachment,
                    selecteditfactformall: selecteditfactformall,
                    infoeditfactformall: infoeditfactformall,
                    tvacheckeditfactformall: tvacheckeditfactformall,
                    ttc: ttc,
                    tva: tva,
                    ht: ttc,
                    linesfact: linesfact
                };
                console.log(factobj);
                const editreg = document.getElementById("editreg");
                editreg.classList.remove("hidden");
                const ttceditreg = document.getElementById("ttceditreg");
                ttceditreg.value = ttc;
                setFact(factobj);
            }
        }
    }
    const handlenumcheck = ()=> {
        const numeditfactformall = document.getElementById("numeditfactformall");
        const numcheckeditfactformall = document.getElementById("numcheckeditfactformall");
        if (numcheckeditfactformall.checked == true) {
            numeditfactformall.disabled = false;
            numeditfactformall.value = "";
        } else {
            numeditfactformall.disabled = true;
            numeditfactformall.value = factnum;
        }
    }
    const handleCloseReg = ()=>{
        const editreg = document.getElementById("editreg");
        editreg.classList.add("hidden");
    }
    const handleRegSubmit = (e)=> {
        e.preventDefault();
        var regType;
        const radio1 = document.getElementById("especeeditreg");
        const radio2 = document.getElementById("crediteditreg");
        const radio3 = document.getElementById("repriseeditreg");
        const radio4 = document.getElementById("vireeditreg");
        const radio5 = document.getElementById("banqeditreg");
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
        const ttceditreg = document.getElementById("ttceditreg").value;
        const refeditreg = document.getElementById("refeditreg").value;
        const regobj = {
            regtype: regType,
            date: date2,
            ttceditreg: ttceditreg,
            refeditreg: refeditreg
        }
        const form = new FormData();
        form.append("numeditfactformall", fact.numeditfactformall);
        form.append("dateeditfactformall", JSON.stringify(fact.dateeditfactformall));
        form.append("editfactpickingattachment", fact.editfactpickingattachment);
        form.append("selecteditfactformall", fact.selecteditfactformall);
        form.append("infoeditfactformall", fact.infoeditfactformall);
        form.append("tvacheckeditfactformall", fact.tvacheckeditfactformall);
        form.append("ttc", fact.ttc);
        form.append("tva", fact.tva);
        form.append("ht", fact.ht);
        form.append("linesfact", JSON.stringify(fact.linesfact));
        form.append("regtype", regobj.regtype);
        form.append("date", JSON.stringify(date2));
        form.append("ttceditreg", ttceditreg);
        form.append("refeditreg", refeditreg);
        form.append("factureid", factureid);
        document.getElementById("loadingcheckfactedit").classList.remove("-translate-y-full");
        fetch("/api/editfact", {
            method: "POST",
            body: form
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactedit").classList.add("-translate-y-full");
                alert("Facture Edited");
                window.location.href = "/facture";
            } else {
                document.getElementById("loadingcheckfactedit").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <div id="loadingcheckfactedit" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <form onSubmit={handleSubmit}>
                <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Modifier Facture</h1>
                <div className="flex flex-row justify-evenly">
                    <input type="text" required defaultValue={factnum} className="h-[40px] w-[80%] my-[10px] flex pl-[10px] border-[1px] border-[#999] rounded-[10px] bg-white" id="numeditfactformall" disabled />
                    <input type="checkbox" onClick={handlenumcheck} id="numcheckeditfactformall" />
                </div>
                <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[10px] flex" type="date" required value={datechange1} onChange={handleChange1} />
                <input type="file" className="text-[#5E94FF] mx-auto my-[10px] flex" id="editfactpickingattachment" />
                <div className="flex flex-col items-center">
                    <label>Client</label>
                    <select id="selecteditfactformall" required className="h-[40px] w-[80%] rounded-[10px] pl-[15px] mx-auto my-[10px]">
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
                    <input className="h-[70px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" defaultValue={datafetched.info} id="infoeditfactformall" />
                </div>
                <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                    HT: {ht.toString()}
                </div>
                <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                    <div>TVA: {tva.toString()}</div>
                    <div className="ml-[20px]">
                        <input type="checkbox" id="tvacheckeditfactformall" />
                    </div>
                </div>
                <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                    TTC: {ttc.toString()}
                </div>
                <div className="flex flex-col">
                    <input className="h-[80px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" id="editdescribelinefactform" placeholder="Designation" />
                    <input className="h-[40px] w-[70%] mx-auto pl-[10px] rounded-[10px] my-[10px]" type="number" placeholder="Quantite" id="editqtnlinefactform" />
                    <input className="h-[40px] w-[70%] mx-auto pl-[10px] rounded-[10px] my-[10px]" type="number" placeholder="Prix Unit (TTC)" id="editttclinefactform" />
                    <div onClick={linefactform} className="h-[40px] w-[100px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] mx-auto flex items-center justify-center">Ajouter</div>
                </div>
                <div className="h-[400px] w-full overflow-y-auto flex flex-col mt-[10px]">
                    {
                        linesfact.map((line,index)=>{
                            return (
                                <div className="flex-shrink-0 flex-grow-0 basis-auto h-[200px] w-[90%] my-[20px] mx-auto bg-white rounded-[10px] border-[1px] border-[#999] shadow-md flex flex-col" key={index}>
                                    <div className="flex flex-col justify-evenly h-[150px] pl-[10px]">
                                        <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Designation:</span> {line.designation}</div>
                                        <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">QTE:</span> {line.qte}</div>
                                        <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Prix Unitaire:</span> {line.prix}</div>
                                    </div>
                                    <div className="h-[50px] w-full flex justify-center items-center">
                                        <div className="h-[45px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px] cursor-pointer" onClick={()=>handleDeletelinefact(index)}>Supprimer</div>
                                    </div>
                                </div>
                            );
                        })
                    }
                </div>
                <button className="h-[50px] w-[170px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] flex items-center justify-center mx-auto">Generate Document</button>
            </form>
            <form id="editreg" onSubmit={handleRegSubmit} className="hidden">
                <div className="flex flex-row-reverse h-[70px] items-center">
                    <div onClick={handleCloseReg} id="hambedit" className="hamb" htmlFor="side-menu"><span id="hamblineedit" className="hamb-line rotbef rotaft"></span></div>
                    <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF] w-full ml-[17%]">Reglement</h1>
                </div>
                <div className="flex flex-row justify-evenly h-[50px]">
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="especeeditreg" name="regtyperadio" /> Espece</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="crediteditreg" name="regtyperadio" /> Credit</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="repriseeditreg" name="regtyperadio" /> Reprise</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="vireeditreg" name="regtyperadio" /> Virement</label>
                    <label className="w-[70px] flex flex-col items-center"><input type="radio" required id="banqeditreg" name="regtyperadio" /> Banque</label>
                </div>
                <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[20px] flex" type="date" required value={datechange2} onChange={handleChange2} />
                <input className="h-[40px] w-[75%] mx-auto pl-[10px] rounded-[10px] my-[20px] flex" type="number" placeholder="Prix Unit (TTC)" required id="ttceditreg" />
                <input type="text" className="h-[40px] w-[80%] my-[10px] flex pl-[10px] border-[1px] border-[#999] rounded-[10px] bg-white mx-auto" id="refeditreg" placeholder="Reference" />
                <button className="h-[40px] w-[100px] text-white bg-[#5E94FF] my-[20px] rounded-[10px] mx-auto flex items-center justify-center">Valider</button>
            </form>
        </main>
    );
}

const Factureeditpage = () => {
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const factureclick = document.getElementById("factureclick");
        tableboard.style.backgroundColor = "#5E94FF";
        factureclick.style.backgroundColor = "#436AB8";
    },[]);
    return (
        <Suspense fallback={<div className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in">Loading...</div>}>
            <Suspensedata />
        </Suspense>
    );
}

export default Factureeditpage;