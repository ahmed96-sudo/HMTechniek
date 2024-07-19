'use client'

import Link from "next/link";
import { useEffect, useState } from "react";

const Chargepage = () => {
    const [datechange1, setDatechange1] = useState(new Date().toISOString().slice(0, 10));
    const handleChange1 = (event) => {
        setDatechange1(event.target.value);
    }
    const [datechange2, setDatechange2] = useState(new Date().toISOString().slice(0, 10));
    const handleChange2 = (event) => {
        setDatechange2(event.target.value);
    }
    const [datafetched, setDatafetched] = useState([]);
    const [loadcharges, setLoadcharges] = useState([]);
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const chargeclick = document.getElementById("chargeclick");
        tableboard.style.backgroundColor = "#5E94FF";
        chargeclick.style.backgroundColor = "#436AB8";
    },[]);
    useEffect(() => {
        document.getElementById("loadingcheckcharge").classList.remove("-translate-y-full");
        fetch("/api/getchargetype")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                setLoadcharges(data.result);
            } else {
                document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(() => {
        document.getElementById("loadingcheckcharge").classList.remove("-translate-y-full");
        fetch("/api/getchargelines")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                setDatafetched(data.result);
            } else {
                document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    const handleSubmit = (event)=>{
        event.preventDefault();
        const date1 = datechange1;
        const date2 = datechange2;
        const selectcharge = document.getElementById("selectcharge").value;
        const dataobj = {
            date1: date1,
            date2: date2,
            selectcharge: selectcharge
        };
        document.getElementById("loadingcheckcharge").classList.remove("-translate-y-full");
        fetch("/api/searchcharge", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({dataobj: dataobj})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                setDatafetched(data.result);
            } else {
                document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    const handleDelCharge = (id)=>{
        if (confirm("Are you sure you want to Delete that Line Charge?")) {
            document.getElementById("loadingcheckcharge").classList.remove("-translate-y-full");
            fetch(`/api/delchargeline?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                    alert("Line Charge Deleted");
                    window.location.reload();
                } else {
                    document.getElementById("loadingcheckcharge").classList.add("-translate-y-full");
                    alert(data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <div id="loadingcheckcharge" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <section className="h-[310px] w-full flex flex-col items-center">
                <Link href={"/charge/add"} className="h-[30px] w-[140px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px] my-[15px]">Ajouter Charge</Link>
                <form onSubmit={handleSubmit} className="flex flex-col items-center w-[80%]">
                    <label className="h-[50px] mx-auto my-[10px]">Debut<input className="h-[40px] w-[150px] ml-[5px] pl-[10px] rounded-[10px]" type="date" value={datechange1} onChange={handleChange1} /></label>
                    <label className="h-[50px]">Fin<input className="h-[40px] w-[150px] ml-[30px] pl-[10px] rounded-[10px]" type="date" value={datechange2} onChange={handleChange2} /></label>
                    <label>Charges</label>
                    <select id="selectcharge" className="h-[40px] w-[200px] rounded-[10px] pl-[15px] mx-auto my-[10px]">
                        <option value="all" key="">All</option>
                        {
                            loadcharges.map((charge,index)=>{
                                return (
                                    <option value={charge.title} key={index}>{(charge.title).slice(0,1).toUpperCase() + (charge.title).slice(1,(charge.title).length)}</option>
                                );
                            })
                        }
                    </select>
                    <button className="h-[40px] w-[100px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px]">Chercher</button>
                </form>
            </section>
            <section className="h-[600px] w-full overflow-y-auto flex flex-col mt-[10px]">
                {
                    datafetched.map((data,index)=>{
                        return (
                            <div className="flex-shrink-0 flex-grow-0 basis-auto h-[200px] w-[90%] my-[20px] mx-auto bg-white rounded-[10px] border-[1px] border-[#999] shadow-md flex flex-col" key={index}>
                                <div className="flex flex-col justify-evenly h-[150px] pl-[10px]">
                                    <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Charge:</span> {data.title}</div>
                                    <div className="overflow-x-auto whitespace-nowrap"><Link href={data.attachement} className="text-[#5E94FF]" target="_blank">Attachement</Link></div>
                                    <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Date:</span> {String(data.dt).slice(0,10)}</div>
                                    <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Designation:</span> {data.designation}</div>
                                    <div className="overflow-x-auto whitespace-nowrap"><span className="text-[#5E94FF]">Montant:</span> {data.montant}</div>
                                </div>
                                <div className="h-[50px] w-full flex flex-row justify-evenly">
                                    <Link href={`/charge/edit?chargeid=${data.id_line_charge}`} className="h-[45px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px]">Modifier</Link>
                                    <Link href={data.attachement} className="h-[45px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px]" target="_blank">Afficher</Link>
                                    <div onClick={()=>handleDelCharge(data.id_line_charge)} className="h-[45px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px]">Supprimer</div>
                                </div>
                            </div>
                        );
                    })
                }
            </section>
        </main>
    );
}

export default Chargepage;