import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { Center, Heading } from "@chakra-ui/react";

const CallbackPage = () => {
    const navigate = useNavigate();
    const [cookie, setCookie] = useCookies(["commune_bot_marketplace"]);
    const getInfo = async(code: any)=> {
        try {
            const options = new URLSearchParams({
                client_id: import.meta.env.VITE_DISCORD_CLIENT_ID,
                client_secret: import.meta.env.VITE_DISCORD_CLIENT_SECRET,
                code,
                grant_type: 'authorization_code',
                redirect_uri: import.meta.env.VITE_DISCORD_REDIRECT_URL,
                scope: 'identify email'
            });
            const result = await axios.post('https://discord.com/api/oauth2/token', options);
            if (result) {
                console.log(result)
                const response = await axios.get('https://discord.com/api/users/@me', {
                    headers: {
                        authorization: `${result.data.token_type} ${result.data.access_token}`
                    }
                });
                
                if (response.data) {
                    setCookie('commune_bot_marketplace', response.data)
                    setTimeout(() => {
                        navigate('/home');
                    }, 100);
                }
            }
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        const urlSearchParams = new URLSearchParams(window.location.search);
        const params = Object.fromEntries(urlSearchParams.entries());
        if (!params.code) {
            // navigate('/home');
        } else {
            getInfo(params.code);
        }
    }, []);

    return (
        <Center><Heading>Discord Login!</Heading></Center>
    )
}

export default CallbackPage;