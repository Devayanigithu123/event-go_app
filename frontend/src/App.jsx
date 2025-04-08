import { useEffect, useState } from "react";
import { fetchHomeData } from "./api";

function App() {
    const [message, setMessage] = useState("");

    useEffect(() => {
        fetchHomeData().then(data => setMessage(data.message));
    }, []);

    return <h1>{message || "Loading..."}</h1>;
}

export default App;

