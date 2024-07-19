'use client'
import Image from "next/image";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";

const Suspensedata = ()=>{
    const searchparams = useSearchParams();
    const id = searchparams.get("factureid") || null;
    const [linesfact, setLinesfact] = useState([]);
    useEffect(()=>{
        document.getElementById("loadingcheckfactshow").classList.remove("-translate-y-full");
        fetch(`/api/getshowfact?factureid=${id}`)
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                document.getElementById("loadingcheckfactshow").classList.add("-translate-y-full");
                document.getElementById("factnum").textContent = String(data.result.factobj.numeroFacture);
                document.getElementById("clientname").textContent = String(data.result.factobj.raison_social);
                document.getElementById("clientaddress").textContent = String(data.result.factobj.adresse);
                document.getElementById("clienttlf").textContent = String(data.result.factobj.tlf);
                document.getElementById("factdate").textContent = String(String(data.result.factobj.date_facture).slice(0,10));
                document.getElementById("regtype").textContent = String(data.result.factobj.type_regelement);
                document.getElementById("factinfo").textContent = String(data.result.factobj.info);
                setLinesfact(data.result.lines);
                if (data.result.factobj.tva == 1) {
                    var newttc = data.result.factobj.total_ttc;
                    var newtva = newttc*0.21;
                    var newht = newttc-newtva;
                    document.getElementById("factttc").textContent = String(parseFloat(newttc.toFixed(1)));
                    document.getElementById("facttva").textContent = String(parseFloat(newtva.toFixed(1)));
                    document.getElementById("factht").textContent = String(parseFloat(newht.toFixed(1)));
                } else {
                    var newttc = data.result.factobj.total_ttc;
                    var newtva = newttc*0.21;
                    var newht = newttc;
                    document.getElementById("factttc").textContent = String(parseFloat(newttc.toFixed(1)));
                    document.getElementById("facttva").textContent = String(parseFloat(newtva.toFixed(1)));
                    document.getElementById("factht").textContent = String(parseFloat(newht.toFixed(1)));
                }
            } else {
                document.getElementById("loadingcheckfactshow").classList.add("-translate-y-full");
                alert(data.error);
            }
        })
        .catch(error => console.error("Error:", error));
    },[id]);
    return (
        <main className="h-[800px] w-[800px]">
            <div id="loadingcheckfactshow" className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in -translate-y-full">Loading...</div>
            <div className="p-6 bg-white text-black">
                <div className="flex justify-between mb-4">
                    <div>
                        <Image src="/logoforapp.jpg" alt="H.M TECHNIEK Logo" className="mb-2 w-[100px] h-[50px]" width={100} height={50} />
                        <p>Z. 3 Doornveld 140-149 8AO<br />1731 Zellik<br />Telephone: 0466148597</p>
                    </div>
                    <div>
                        <p className="font-bold" id="clientname"></p>
                        <p>Adresse: <span id="clientaddress"></span><br />Téléphone: <span id="clienttlf"></span></p>
                    </div>
                </div>
                <div className="mb-4">
                    <p className="font-bold">Numero Facture: <span id="factnum"></span></p>
                    <p>Date Facture: <span id="factdate"></span></p>
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
                            linesfact.map((line,index)=>{
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
                <div className="mb-4">
                    <p className="font-bold">Mode Reg: <span id="regtype"></span></p>
                    <p>Information additionnels: <span id="factinfo"></span></p>
                </div>
                <div className="border p-4">
                    <p>Total HT: <span id="factht"></span> €</p>
                    <p>Total TVA: <span id="facttva"></span> €</p>
                    <p className="font-bold">Total TTC: <span id="factttc"></span> €</p>
                </div>
                <div className="mt-4 text-xs text-zinc-600">
                    <p>H.M TECHNIEK | Z 3 Doornveld 140-149 8AO | 1713 Zellik | belgique T, +32466418576 | info@hmtechniek.be | N° TVA: 0805792955 IBAN: BE34 0689 5069 3690 BIC: GKCCBEBB</p>
                </div>
            </div>
        </main>
    );
}

const ShowFacturePage = () => {
    return (
        <Suspense fallback={<div className="absolute w-full h-full z-10 bg-gray-400 opacity-80 text-[blue] text-[35px] flex items-center justify-center transition-all duration-300 ease-in">Loading...</div>}>
            <Suspensedata />
        </Suspense>
    );
}

export default ShowFacturePage;