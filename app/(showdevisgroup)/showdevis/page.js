'use client'
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Suspensedata = ()=>{
    const searchparams = useSearchParams();
    const id = searchparams.get("devisid") || null;
    const [linesdevis, setLinesdevis] = useState([]);
    useEffect(()=>{
        document.getElementById("loadingcheckdevisshow").classList.remove("-translate-y-full");
        fetch(`/api/getshowdevis?devisid=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckdevisshow").classList.add("-translate-y-full");
                document.getElementById("devisnum").textContent = String(data.result.devisobj.numeroDevis);
                document.getElementById("clientnamedevis").textContent = String(data.result.devisobj.raison_social);
                document.getElementById("clientaddressdevis").textContent = String(data.result.devisobj.adresse);
                document.getElementById("clienttlfdevis").textContent = String(data.result.devisobj.tlf);
                document.getElementById("devisdate").textContent = String(String(data.result.devisobj.date_devis).slice(0,10));
                setLinesdevis(data.result.lines);
                var newttc = data.result.devisobj.total_ttc;
                var newtva = newttc*0.21;
                var newht = newttc-newtva;
                document.getElementById("devisttc").textContent = String(parseFloat(newttc.toFixed(1)));
                document.getElementById("devistva").textContent = String(parseFloat(newtva.toFixed(1)));
                document.getElementById("devisht").textContent = String(parseFloat(newht.toFixed(1)));
            } else {
                document.getElementById("loadingcheckdevisshow").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    },[id]);
    return (
        <main className="h-[800px] w-[800px]">
            <div id="loadingcheckdevisshow" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <div className="p-6 bg-white text-black">
                <div className="flex justify-between mb-4">
                    <div>
                        <Image src="/logoforapp.jpg" alt="H.M TECHNIEK Logo" className="mb-2 w-[100px] h-[50px]" width={100} height={50} />
                        <p>Z. 3 Doornveld 140-149 8AO<br />1731 Zellik<br />Telephone: 0466148597</p>
                    </div>
                    <div>
                        <p className="font-bold" id="clientnamedevis"></p>
                        <p>Adresse: <span id="clientaddressdevis"></span><br />Téléphone: <span id="clienttlfdevis"></span></p>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="font-bold">Numero Devis: <span id="devisnum"></span></p>
                    <p>Date Devis: <span id="devisdate"></span></p>
                </div>
                <table className="w-full mb-4 border-collapse">
                    <thead>
                    <tr className="bg-blue-200">
                        <th className="border border-zinc-300 p-2">Produit</th>
                        <th className="border border-zinc-300 p-2">QTE</th>
                        <th className="border border-zinc-300 p-2">Montant</th>
                        <th className="border border-zinc-300 p-2">Total</th>
                    </tr>
                    </thead>
                    <tbody>
                        {
                            linesdevis.map((line,index)=>{
                                return (
                                    <tr key={index}>
                                        <td className="border border-zinc-300 p-2">{String(line.designation)}</td>
                                        <td className="border border-zinc-300 p-2 text-center">{String(parseFloat((line.qte).toFixed(1)))}</td>
                                        <td className="border border-zinc-300 p-2 text-right">{String(parseFloat((line.prix).toFixed(1)))}</td>
                                        <td className="border border-zinc-300 p-2 text-right">{String(parseFloat(((line.prix) * (line.qte)).toFixed(1)))}</td>
                                    </tr>
                                );
                            })
                        }
                    </tbody>
                </table>
                <div className="border p-4">
                    <p>Total HT: <span id="devisht"></span> €</p>
                    <p>Total TVA: <span id="devistva"></span> €</p>
                    <p className="font-bold">Total TTC: <span id="devisttc"></span> €</p>
                </div>
                <div className="mt-4 text-xs text-zinc-600">
                    <p>H.M TECHNIEK | Z 3 Doornveld 140-149 8AO | 1713 Zellik | belgique T, +32466418576 | info@hmtechniek.be | N° TVA: 0805792955 IBAN: BE34 0689 5069 3690 BIC: GKCCBEBB</p>
                </div>
            </div>
        </main>
    );
}

const ShowDevisPage = () => {
    return (
        <Suspense fallback={<div className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in">Loading...</div>}>
            <Suspensedata />
        </Suspense>
    );
}

export default ShowDevisPage;