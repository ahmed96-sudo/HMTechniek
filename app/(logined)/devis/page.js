'use client'

import Link from "next/link";
import { useEffect, useState, Suspense } from "react";

const DevisPage = () => {
    const [datechange1, setDatechange1] = useState(new Date().toISOString().slice(0, 10));
    const handleChange1 = (event) => {
        setDatechange1(event.target.value);
    }
    const [datechange2, setDatechange2] = useState(new Date().toISOString().slice(0, 10));
    const handleChange2 = (event) => {
        setDatechange2(event.target.value);
    }
    const [datafetched, setDatafetched] = useState([]);
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const devisclick = document.getElementById("devisclick");
        tableboard.style.backgroundColor = "#5E94FF";
        devisclick.style.backgroundColor = "#436AB8";
    },[]);
    const handleClientSubmit = (e)=>{
        e.preventDefault();
        const clientdevisinput = document.getElementById("clientdevisinput").value;
        const dataobj = {
            input: clientdevisinput
        };
        document.getElementById("loadingcheckdevis").classList.remove("-translate-y-full");
        fetch("/api/searchdevisclient", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({dataobj: dataobj})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckdevis").classList.add("-translate-y-full");
                setDatafetched(data.result);
            } else {
                document.getElementById("loadingcheckdevis").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    const handleDateSubmit = (e)=>{
        const dates = {date1: datechange1, date2: datechange2};
        e.preventDefault();
        document.getElementById("loadingcheckdevis").classList.remove("-translate-y-full");
        fetch("/api/searchdevisdate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({dates:dates})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckdevis").classList.add("-translate-y-full");
                setDatafetched(data.result);
            } else {
                document.getElementById("loadingcheckdevis").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    const handleDelDevis = (id)=>{
        if (confirm("Are you Sure you want to Delete that Devis?")) {
            document.getElementById("loadingcheckdevis").classList.remove("-translate-y-full");
            fetch(`/api/deldevis?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("loadingcheckdevis").classList.add("-translate-y-full");
                    alert("Devis Deleted");
                    window.location.reload();
                } else {
                    document.getElementById("loadingcheckdevis").classList.add("-translate-y-full");
                    alert(data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <div id="loadingcheckdevis" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <section className="h-[200px] w-full flex flex-col items-center justify-evenly">
                <div className="flex flex-col items-center">
                    <Link href={"/devis/add"} className="h-[30px] w-[120px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px] my-[15px]">Ajouter Devis</Link>
                    <form className="flex flex-row" onSubmit={handleClientSubmit}>
                        <input className="h-[35px] w-[200px] pl-[10px] ml-[10px] mb-[10px] rounded-[10px]" id="clientdevisinput" type="text" placeholder="Nom Client" required />
                        <button className="h-[35px] w-[90px] bg-[#5E94FF] text-white rounded-[10px]">Chercher</button>
                    </form>
                </div>
                <form className="flex flex-col items-center w-full" onSubmit={handleDateSubmit}>
                    <div className="flex flex-row w-full justify-evenly">
                        <label>Debut<input className="h-[40px] w-[130px] ml-[5px] pl-[10px] rounded-[10px]" type="date" value={datechange1} onChange={handleChange1} /></label>
                        <label>Fin<input className="h-[40px] w-[130px] ml-[5px] pl-[10px] rounded-[10px]" type="date" value={datechange2} onChange={handleChange2} /></label>
                    </div>
                    <div>
                        <button className="h-[40px] w-[100px] text-white bg-[#5E94FF] mt-[10px] rounded-[10px]">Search</button>
                    </div>
                </form>
            </section>
            <section className="h-[600px] w-full overflow-y-auto flex flex-col mt-[10px]">
                {
                    datafetched.map((data,index)=>{
                        return (
                            <div key={index} className="flex-shrink-0 flex-grow-0 basis-auto h-[150px] w-[90%] my-[20px] mx-auto bg-white rounded-[10px] border-[1px] border-[#999] shadow-md flex flex-col justify-evenly">
                                <div className="flex flex-row justify-around h-[90px] w-full">
                                    <div className="flex flex-col justify-evenly">
                                        <div>N° Devis: {data.numeroDevis}</div>
                                        <div>Date: {String(data.date_devis).slice(0,10)}</div>
                                        <div className="overflow-x-auto whitespace-nowrap w-[150px]">Client: {data.raison_social}</div>
                                    </div>
                                    <div className="flex flex-col items-center justify-evenly w-[70px]">
                                        <Suspense>
                                            <Link className="h-[35px] w-full flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px]" href={`/showdevis?devisid=${data.idDevis}`}>Show</Link>
                                            <Link className="h-[35px] w-full flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px]" href={`/devis/edit?devisid=${data.idDevis}`}>Edit</Link>
                                        </Suspense>
                                    </div>
                                </div>
                                <div className="h-[45px] w-full">
                                    <div className="h-full w-1/2 flex items-center justify-center bg-[#5E94FF] text-white mx-auto rounded-[10px]" onClick={()=>handleDelDevis(data.idDevis)}>Supprimer</div>
                                </div>
                            </div>
                        );
                    })
                }
            </section>
        </main>
    );
}

export default DevisPage;