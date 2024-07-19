'use client'
import { useState, useEffect } from "react";

const BoardTable = () => {
    const [datechange, setDatechange] = useState(new Date().toISOString().slice(0, 10));
    const handleChange = (event) => {
        setDatechange(event.target.value);
    }
    useEffect(() => {
        const totalfacture = document.getElementById("totalfacture");
        const totalfactfrs = document.getElementById("totalfactfrs");
        const totaldevis = document.getElementById("totaldevis");
        const totalclient = document.getElementById("totalclient");
        fetch("/api/total")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                totalfacture.textContent = parseFloat(data.result.totalfacture.toFixed(1)) + " DH";
                totalfactfrs.textContent = parseFloat(data.result.totalfactfrs.toFixed(1)) + " DH";
                totaldevis.textContent = parseFloat(data.result.totaldevis.toFixed(1)) + " DH";
                totalclient.textContent = data.result.totalclient;
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(()=>{
        const totaltva = document.getElementById("totaltva");
        const date = {
            date: datechange
        };
        fetch("/api/totalbydate", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({date:date})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                totaltva.textContent = parseFloat(data.result.toFixed(1));
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    },[datechange]);
    return (
        <section className="flex flex-col h-[600px] overflow-y-auto w-full justify-evenly">
            <form className="h-[70px] flex items-center justify-center mx-auto px-[20px] rounded-[15px] bg-white shadow-md"><input className="p-[10px] border-[1px] border-[#999] rounded-[10px]" type="date" value={datechange} onChange={handleChange} /></form>
            <div className="h-[60px] w-[60%] mx-auto flex flex-col items-center shadow-md rounded-[20px] justify-center bg-white">
                <div>Total Facture</div>
                <div id="totalfacture">0.00 DH</div>
            </div>
            <div className="h-[60px] w-[60%] mx-auto flex flex-col items-center shadow-md rounded-[20px] justify-center bg-white">
                <div>Total Fact Frs</div>
                <div id="totalfactfrs">0.00 DH</div>
            </div>
            <div className="h-[60px] w-[60%] mx-auto flex flex-col items-center shadow-md rounded-[20px] justify-center bg-white">
                <div>Total Devis</div>
                <div id="totaldevis">0.00 DH</div>
            </div>
            <div className="h-[60px] w-[60%] mx-auto flex flex-col items-center shadow-md rounded-[20px] justify-center bg-white">
                <div>Total Client</div>
                <div id="totalclient">0</div>
            </div>
            <div className="h-[60px] w-[60%] mx-auto flex flex-col items-center shadow-md rounded-[20px] justify-center bg-white">
                <div>Total TVA</div>
                <div id="totaltva">0</div>
            </div>
        </section>
    );
}

export default BoardTable;