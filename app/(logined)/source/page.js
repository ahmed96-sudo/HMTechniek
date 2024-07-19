'use client'

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";

const Sourcepage = () => {
    const [datafetched, setDatafetched] = useState([]);
    useEffect(() => {
        const tableboard = document.getElementById("tableboard");
        const sourceclick = document.getElementById("sourceclick");
        tableboard.style.backgroundColor = "#5E94FF";
        sourceclick.style.backgroundColor = "#436AB8";
    }, []);
    const handleClick = (t)=>{
        const clientsourceclick = document.getElementById("clientsourceclick");
        const foursourceclick = document.getElementById("foursourceclick");
        if(t == "client"){
            clientsourceclick.style.backgroundColor = "#5E94FF";
            foursourceclick.style.backgroundColor = "white";
        } else {
            clientsourceclick.style.backgroundColor = "white";
            foursourceclick.style.backgroundColor = "#5E94FF";
        }
        setDatafetched([]);
        document.getElementById("loadingcheck").classList.remove("hidden");
        fetch(`/api/getsource?type=${t}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheck").classList.add("hidden");
                setDatafetched(data.result);
            } else {
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    }
    return (
        <main className="flex-[1] overflow-y-auto">
            <section className="h-[150px] w-full flex flex-col items-center justify-evenly">
                <Link href={"/source/add"} className="h-[30px] w-[130px] flex items-center justify-center bg-[#5E94FF] text-white rounded-[10px] my-[15px]">Ajouter Source</Link>
                <div className="flex flex-row h-[50px] w-full items-center justify-evenly">
                    <div className="flex h-full w-[100px] items-center justify-center bg-white shadow-md border-[1px] border-[#999]" onClick={()=>handleClick("client")} id="clientsourceclick">Client</div>
                    <div className="flex h-full w-[100px] items-center justify-center bg-white shadow-md border-[1px] border-[#999]" onClick={()=>handleClick("frs")} id="foursourceclick">Fournisseur</div>
                </div>
            </section>
            <section className="h-[600px] w-full overflow-y-auto flex flex-col mt-[10px]">
                <div id="loadingcheck" className="text-[20px] text-[#5E94FF] hidden">LOADING...</div>
                {
                    datafetched.map((data,index)=>{
                        return (
                            <div className="flex flex-col h-[230px] w-[80%] my-[10px] mx-auto bg-white border-[1px] border-[#999] rounded-[10px]" key={index}>
                                <div className="flex flex-col h-[180px] w-full items-center justify-evenly">
                                    <div className="flex flex-row">
                                        <Image
                                            src={data.pathPic ? data.pathPic : "/user.png"}
                                            alt="user photo"
                                            className='w-[50px] h-[50px]'
                                            width={50}
                                            height={50}
                                        />
                                        <div className="ml-[20px]">Raison Social:<br/><span id="socialname" className="overflow-x-auto whitespace-nowrap w-[150px] block">{data.raison_social}</span></div>
                                    </div>
                                    <div>
                                        <div className="h-[50px] w-full">Responsable: <span id="responsablename" className="overflow-x-auto whitespace-nowrap w-[150px] block">{data.responsable}</span></div>
                                        <div className="h-[40px] w-full">N TLF: <span id="ntlf">{data.tlf}</span></div>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center w-full h-[45px]">
                                    <Suspense>
                                        <Link href={`/source/edit?sourceid=${data.id_client}`} className="h-[80%] w-[130px] flex items-center justify-center rounded-[10px] bg-[#5E94FF] text-white">Edit</Link>
                                    </Suspense>
                                </div>
                            </div>
                        );
                    })
                }
            </section>
        </main>
    );
}

export default Sourcepage;