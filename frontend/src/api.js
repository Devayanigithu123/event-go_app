export const fetchHomeData = async () => {
    const response = await fetch("http://127.0.0.1:8000/api/home/");
    const data = await response.json();
    return data;
};
