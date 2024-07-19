'use client'

import { useEffect } from "react";

const Loginpage = () => {
    const handleSubmit = async (e)=>{
        e.preventDefault();
        const usern = document.getElementById("usern").value;
        const userps = document.getElementById("userps").value;
        try {
            const response = await fetch('/api/loginform', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username: usern, password: userps }),
            });
            const data = await response.json();
            if (data.success == true) {
                // Assuming the response contains a redirect URL or success message
                window.location.href = 'dashboard';
            } else {
                // Handle non-200 responses, e.g., show an error message
                alert(data.error);
                alert("Le pseudo ou mot de passe est incorect.");
            }
        } catch (error) {
            console.error('Error during fetch operation:', error);
            alert("Une erreur s'est produite lors de la tentative de connexion.");
        }
    }
    const handleClick = ()=>{
        const userps = document.getElementById("userps");
        if (userps.type == "password") {
            userps.type = "text";
        } else {
            userps.type = "password";
        }
    }
    return (
        <form onSubmit={handleSubmit} className="h-[250px] w-[80%] border-[1px] border-[#D5DADF]">
            <h2 className="text-[30px] h-[60px] w-full flex justify-center items-center bg-[#D5DADF]">Informations</h2>
            <div className="h-[190px] w-full flex flex-col bg-white items-center justify-evenly">
                <input type="text" id="usern" placeholder="Utilisateur" defaultValue={"HM Techniek"} className="h-[50px] w-[70%] border-[1px] border-[#999] pl-[10px]" required />
                <div className="flex flex-row w-full h-[50px] justify-center">
                    <input type="password" placeholder="Mot De Passe" className="h-full w-[70%] pl-[10px] border-[1px] border-[#999] mr-[10px] ml-[23px]" required id="userps" />
                    <input type="checkbox" onClick={handleClick} className="my-auto" />
                </div>
                <button className="h-[40px] w-1/2 rounded-[10px] text-white bg-[#008080]">Entrer</button>
            </div>
        </form>
    );
}

export default Loginpage;