'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";

const ParaPage = () => {
    const [imageUrl, setImageUrl] = useState('');
    const [datafetched, setDatafetched] = useState({});
    const [chargetype, setChargetype] = useState([]);
    const handleImageChange = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();
        reader.onload = () => {
            setImageUrl(reader.result);
        };
        reader.readAsDataURL(file);
    };
    useEffect(()=>{
        const tableboard = document.getElementById("tableboard");
        const paraclick = document.getElementById("paraclick");
        tableboard.style.backgroundColor = "#5E94FF";
        paraclick.style.backgroundColor = "#436AB8";
    },[]);
    useEffect(() => {
        document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
        fetch("/api/getpara")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                setDatafetched(data.result);
            } else {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    useEffect(() => {
        document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
        fetch("/api/getchargetype")
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                setChargetype(data.result);
            } else {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }, []);
    const handleParaSubmit = (e)=>{
        e.preventDefault();
        const showimage = imageUrl ? imageUrl : datafetched.pathLogo ? datafetched.pathLogo : "/logoforapp.jpg";
        const socialpara = document.getElementById("socialpara").value;
        const idfpara = document.getElementById("idfpara").value;
        const rcpara = document.getElementById("rcpara").value;
        const cnsspara = document.getElementById("cnsspara").value;
        const icepara = document.getElementById("icepara").value;
        const addrespara = document.getElementById("addrespara").value;
        const para = {
            RaisonSocial: socialpara,
            idf: idfpara,
            RC: rcpara,
            cnss: cnsspara,
            ice: icepara,
            adresse: addrespara,
            pathLogo : showimage
        };
        document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
        fetch("/api/editpara", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({para:para})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert("Parameters Updated");
                window.location.reload();
            } else {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    const handleNumSubmit = (e)=>{
        e.preventDefault();
        const hexFpara = document.getElementById("hexFpara").value;
        const nFpara = document.getElementById("nFpara").value;
        const hexDpara = document.getElementById("hexDpara").value;
        const nDpara = document.getElementById("nDpara").value;
        const hexApara = document.getElementById("hexApara").value;
        const nApara = document.getElementById("nApara").value;
        const num = {
            hexF: hexFpara,
            nF: nFpara,
            hexD: hexDpara,
            nD: nDpara,
            hexA: hexApara,
            nA: nApara
        };
        document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
        fetch("/api/editndoc", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({num:num})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert("Numerotation Updated");
                window.location.reload();
            } else {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    const handleChargeAdd = (e)=>{
        e.preventDefault();
        const chargetitleadd = document.getElementById("chargetitleadd").value;
        const charge = {
            title: chargetitleadd
        };
        document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
        fetch("/api/addchargetitle", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({charge:charge})
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
                alert("Charge Added");
                window.location.reload();
            } else {
                document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    const handledelchargetype = (id)=>{
        if (confirm("Are You sure to Delete the Charge?")) {
            document.getElementById("loadingcheckpara").classList.remove("-translate-y-full");
            fetch(`/api/delchargetype?id=${id}`)
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                    alert("Charge Deleted");
                    window.location.reload();
                } else {
                    document.getElementById("loadingcheckpara").classList.add("-translate-y-full");
                alert(data.error);
                }
            })
            .catch(error => console.error("Error:", error));
        }
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <div id="loadingcheckpara" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <form onSubmit={handleParaSubmit}>
                <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Information De Societe</h1>
                <div className="flex flex-row">
                    {imageUrl? (
                        <Image
                            src={imageUrl}
                            alt="logo photo"
                            className='w-[100px] h-[100px] border-[1px] border-[#999] m-[10px] p-[10px]'
                            id="parashowimage"
                            width={100}
                            height={100}
                        />
                        ) : (
                        <Image
                            src={datafetched.pathLogo ? datafetched.pathLogo : "/logoforapp.jpg"}
                            alt="logo photo"
                            className='w-[100px] h-[100px] border-[1px] border-[#999] m-[10px] p-[10px]'
                            id="parashowimage"
                            width={100}
                            height={100}
                        />
                    )}
                    <div className="flex flex-col justify-center w-[60%]">
                        <input
                            type="file"
                            className="text-[#5E94FF]"
                            id="parapickingimage"
                            onChange={handleImageChange}
                            accept="image/*"
                        />
                        <label className="h-[30px] w-[100px] flex items-center justify-center bg-[#5E94FF] text-white my-[10px] rounded-[10px]" htmlFor="parapickingimage">Reverse</label>
                    </div>
                </div>
                <div className="flex flex-col h-[70px] w-full">
                    <div className="pl-[20px]">Raison Social</div>
                    <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" defaultValue={datafetched.RaisonSocial} required id="socialpara" />
                </div>
                <div className="flex flex-col h-[70px] w-full">
                    <div className="pl-[20px]">Identifiant Fiscal</div>
                    <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" defaultValue={datafetched.idf} placeholder="0" required id="idfpara" />
                </div>
                <div className="flex flex-col h-[70px] w-full">
                    <div className="pl-[20px]">RC</div>
                    <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" defaultValue={datafetched.RC} placeholder="0" required id="rcpara" />
                </div>
                <div className="flex flex-col h-[70px] w-full">
                    <div className="pl-[20px]">CNSS</div>
                    <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" defaultValue={datafetched.cnss} placeholder="0" required id="cnsspara" />
                </div>
                <div className="flex flex-col h-[70px] w-full">
                    <div className="pl-[20px]">ICE</div>
                    <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" defaultValue={datafetched.ice} placeholder="0" required id="icepara" />
                </div>
                <div className="flex flex-col h-[70px] w-full">
                    <div className="pl-[20px]">Addresse</div>
                    <input className="h-[35px] w-[90%] mx-auto pl-[10px] border-[1px] border-[#999] rounded-[10px]" type="text" defaultValue={datafetched.adresse} required id="addrespara" />
                </div>
                <div className="w-full h-[65px]">
                    <button className="w-[70%] h-[85%] flex items-center justify-center mx-auto bg-[#5E94FF] text-white rounded-[10px]">Modifier</button>
                </div>
            </form>
            <form onSubmit={handleNumSubmit}>
                <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Numerotation Des Documents</h1>
                <div className="flex flex-col items-center h-[80px] justify-evenly">
                    <div>N Facture</div>
                    <div className="flex justify-evenly">
                        <input type="text" className="h-[35px] w-[40%] pl-[10px] border-[1px] border-[#999] rounded-[10px]" defaultValue={datafetched.hexF} required id="hexFpara" />
                        <input type="number" className="h-[35px] w-[40%] pl-[10px] border-[1px] border-[#999] rounded-[10px]" defaultValue={datafetched.nF} required id="nFpara" />
                    </div>
                </div>
                <div className="flex flex-col items-center h-[80px] justify-evenly">
                    <div>N Devis</div>
                    <div className="flex justify-evenly">
                        <input type="text" className="h-[35px] w-[40%] pl-[10px] border-[1px] border-[#999] rounded-[10px]" defaultValue={datafetched.hexD} required id="hexDpara" />
                        <input type="number" className="h-[35px] w-[40%] pl-[10px] border-[1px] border-[#999] rounded-[10px]" defaultValue={datafetched.nD} required id="nDpara" />
                    </div>
                </div>
                <div className="flex flex-col items-center h-[80px] justify-evenly">
                    <div>N Avoire</div>
                    <div className="flex justify-evenly">
                        <input type="text" className="h-[35px] w-[40%] pl-[10px] border-[1px] border-[#999] rounded-[10px]" defaultValue={datafetched.hexA} required id="hexApara" />
                        <input type="number" className="h-[35px] w-[40%] pl-[10px] border-[1px] border-[#999] rounded-[10px]" defaultValue={datafetched.nA} required id="nApara" />
                    </div>
                </div>
                <div className="w-full h-[65px] flex items-center">
                    <button className="w-[70%] h-[85%] flex items-center justify-center mx-auto bg-[#5E94FF] text-white rounded-[10px]">Modifier</button>
                </div>
            </form>
            <form className="flex flex-col" onSubmit={handleChargeAdd}>
                <h1 className="h-[50px] text-[25px] flex items-center justify-center text-[#5E94FF]">Ajouter Charge</h1>
                <input className="h-[40px] w-[70%] pl-[10px] my-[10px] rounded-[10px] mx-auto flex" id="chargetitleadd" type="text" placeholder="Charge" required />
                <button className="h-[40px] w-[50%] bg-[#5E94FF] text-white rounded-[10px] mx-auto my-[10px] flex items-center justify-center">Ajouter</button>
            </form>
            <div className="h-[300px] w-full overflow-y-auto flex flex-col mt-[10px]">
                {
                    chargetype.map((item, index) => (
                        <div key={index} className="flex-shrink-0 flex-grow-0 basis-auto h-[140px] w-[90%] my-[20px] mx-auto bg-white rounded-[10px] border-[1px] border-[#999] shadow-md flex flex-col justify-evenly">
                            <div className="flex flex-col justify-center items-center h-[90px] w-full">
                                <h1>Charge</h1>
                                <div className="overflow-x-auto whitespace-nowrap w-[200px] h-[40px] flex items-center justify-center">{item.title}</div>
                            </div>
                            <div className="h-[45px] w-full">
                                <div className="w-[50%] h-[35px] bg-[#5E94FF] text-white rounded-[10px] mx-auto flex items-center justify-center" onClick={()=>handledelchargetype(item.id_charge)}>Supprimer</div>
                            </div>
                        </div>
                    ))
                }
            </div>
        </main>
    );
}

export default ParaPage;