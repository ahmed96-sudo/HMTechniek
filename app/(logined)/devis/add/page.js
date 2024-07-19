'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Devisaddpage = () => {
    const [datechange1, setDatechange1] = useState(new Date().toISOString().slice(0, 10));
    const handleChange1 = (event) => {
        setDatechange1(event.target.value);
    }
    const [loadclient, setLoadclient] = useState([]);
    const [ttc, setTtc] = useState(0);
    const [tva, setTva] = useState(0);
    const [ht, setHt] = useState(0);
    const [linesdevis, setLinesdevis] = useState([]);
    const [devisnum, setDevisnum] = useState("");
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const devisclick = document.getElementById("devisclick");
        tableboard.style.backgroundColor = "#5E94FF";
        devisclick.style.backgroundColor = "#436AB8";
    },[]);
    useEffect(() => {
        document.getElementById("loadingcheckdevisadd").classList.remove("-translate-y-full");
        fetch("/api/getsource?type=client")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                setLoadclient(data.result);
            } else {
                document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(() => {
        document.getElementById("loadingcheckdevisadd").classList.remove("-translate-y-full");
        fetch("/api/loadlastdevisnum")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                setDevisnum(data.result);
            } else {
                document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    const linedevisform = ()=>{
        var describelinedevisform = document.getElementById("describelinedevisform").value;
        var qtnlinedevisform = document.getElementById("qtnlinedevisform").value;
        var ttclinedevisform = document.getElementById("ttclinedevisform").value;
        if (describelinedevisform == "" || qtnlinedevisform == "" || ttclinedevisform == "") {
            alert("All Fields Required");
            return;
        } else {
            var totalttc = qtnlinedevisform * ttclinedevisform;
            var newttc = ttc + totalttc;
            var newtva = newttc*0.21;
            var newht = newttc-newtva;
            setTtc(parseFloat(newttc.toFixed(1)));
            setTva(parseFloat(newtva.toFixed(1)));
            setHt(parseFloat(newht.toFixed(1)));
            var line = {
                describelinedevisform: describelinedevisform,
                qtnlinedevisform: qtnlinedevisform,
                ttclinedevisform: ttclinedevisform
            };
            setLinesdevis([...linesdevis, line]);
            describelinedevisform = "";
            qtnlinedevisform = "";
            ttclinedevisform = "";
        }
    }
    const handleDeletelinedevis = (index) => {
        var newlinesdevis = [...linesdevis];
        if (linesdevis.length == 0) {
            alert("Add some Items");
            return;
        } else {
            var lastlinedevis = linesdevis[index];
            var lastttc = lastlinedevis.ttclinedevisform;
            var lastqtn = lastlinedevis.qtnlinedevisform;
            var lasttotalttc = lastttc*lastqtn;
            var newttc = ttc - lasttotalttc;
            var newtva = newttc*0.21;
            var newht = newttc-newtva;
            setTtc(parseFloat(newttc.toFixed(1)));
            setTva(parseFloat(newtva.toFixed(1)));
            setHt(parseFloat(newht.toFixed(1)));
            newlinesdevis.splice(index, 1);
            setLinesdevis(newlinesdevis);
        }
    }
    const handleSubmit = (e)=>{
        e.preventDefault();
        const numadddevisformall = document.getElementById("numadddevisformall").value;
        const dateadddevisformall = datechange1;
        const selectadddevisformall = document.getElementById("selectadddevisformall").value;
        const infoadddevisformall = document.getElementById("infoadddevisformall").value;
        const tvacheckadddevisformall = document.getElementById("tvacheckadddevisformall").checked;
        if (linesdevis.length == 0) {
            alert("Add some Items");
            return;
        } else {
            if (tvacheckadddevisformall == true) {
                const devis = {
                    numadddevisformall: numadddevisformall,
                    dateadddevisformall: dateadddevisformall,
                    selectadddevisformall: selectadddevisformall,
                    infoadddevisformall: infoadddevisformall,
                    tvacheckadddevisformall: tvacheckadddevisformall,
                    ttc: ttc,
                    tva: tva,
                    ht: ht,
                    linesdevis: linesdevis
                };
                console.log(devis);
                document.getElementById("loadingcheckdevisadd").classList.remove("-translate-y-full");
                fetch("/api/adddevis", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({devis:devis})
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                        alert("Devis added");
                        window.location.href = "/devis";
                    } else {
                        document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                        alert(data.error);
                    }
                })
                .catch(error => console.error("Error:", error));
            } else {
                const devis = {
                    numadddevisformall: numadddevisformall,
                    dateadddevisformall: dateadddevisformall,
                    selectadddevisformall: selectadddevisformall,
                    infoadddevisformall: infoadddevisformall,
                    tvacheckadddevisformall: tvacheckadddevisformall,
                    ttc: ttc,
                    tva: tva,
                    ht: ttc,
                    linesdevis: linesdevis
                };
                console.log(devis);
                document.getElementById("loadingcheckdevisadd").classList.remove("-translate-y-full");
                fetch("/api/adddevis", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify({devis:devis})
                })
                .then(response => response.json())
                .then(data => {
                    if (data.success) {
                        document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                        alert("Devis added");
                        window.location.href = "/devis";
                    } else {
                        document.getElementById("loadingcheckdevisadd").classList.add("-translate-y-full");
                        alert(data.error);
                    }
                })
                .catch(error => console.error("Error:", error));
            }
        }
    }
    return (
        <form className="flex-[1] overflow-y-auto" onSubmit={handleSubmit}>
            <div id="loadingcheckdevisadd" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Ajouter Devis</h1>
            <input type="text" required value={devisnum.toString()} className="h-[40px] w-[90%] my-[10px] mx-auto flex pl-[10px] border-[1px] border-[#999] rounded-[10px] bg-white" id="numadddevisformall" disabled />
            <input className="h-[40px] w-[150px] pl-[10px] rounded-[10px] mx-auto my-[10px] flex" type="date" required value={datechange1} onChange={handleChange1} />
            <div className="flex flex-col items-center">
                <label>Client</label>
                <select id="selectadddevisformall" required className="h-[40px] w-[80%] rounded-[10px] pl-[15px] mx-auto my-[10px]">
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
                <input className="h-[70px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" id="infoadddevisformall" />
            </div>
            <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                HT: {ht.toString()}
            </div>
            <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                <div>TVA: {tva.toString()}</div>
                <div className="ml-[20px]">
                    <input type="checkbox" defaultChecked id="tvacheckadddevisformall" />
                </div>
            </div>
            <div className="h-[60px] w-[60%] mx-auto flex items-center shadow-md rounded-[20px] justify-center bg-white my-[10px]">
                TTC: {ttc.toString()}
            </div>
            <div className="flex flex-col">
                <input className="h-[80px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px] my-[10px]" type="text" id="describelinedevisform" placeholder="Designation" />
                <input className="h-[40px] w-[70%] mx-auto pl-[10px] rounded-[10px] my-[10px]" type="number" placeholder="Quantite" id="qtnlinedevisform" />
                <input className="h-[40px] w-[70%] mx-auto pl-[10px] rounded-[10px] my-[10px]" type="number" placeholder="Prix Unit (TTC)" id="ttclinedevisform" />
                <div onClick={linedevisform} className="h-[40px] w-[100px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] mx-auto flex items-center justify-center">Ajouter</div>
            </div>
            <div className="h-[400px] w-full overflow-y-auto flex flex-col mt-[10px]">
                {
                    linesdevis.map((line,index)=>{
                        return (
                            <div className="flex-shrink-0 flex-grow-0 basis-auto h-[200px] w-[90%] my-[20px] mx-auto bg-white rounded-[10px] border-[1px] border-[#999] shadow-md flex flex-col" key={index}>
                                <div className="flex flex-col justify-evenly h-[150px] pl-[10px]">
                                    <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Designation:</span> {line.describelinedevisform}</div>
                                    <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">QTE:</span> {line.qtnlinedevisform}</div>
                                    <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Prix Unitaire:</span> {line.ttclinedevisform}</div>
                                </div>
                                <div className="h-[50px] w-full flex justify-center items-center">
                                    <div className="h-[45px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px] cursor-pointer" onClick={()=>handleDeletelinedevis(index)}>Supprimer</div>
                                </div>
                            </div>
                        );
                    })
                }
            </div>
            <button className="h-[50px] w-[170px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px] flex items-center justify-center mx-auto">Generate Document</button>
        </form>
    );
}

export default Devisaddpage;