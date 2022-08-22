document.addEventListener("DOMContentLoaded", (e)=>{
    const includeHtml = async (el, url)=>{
        try{
        let res = await fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "text/html"
            }
        })
        if (!res.ok) throw {status: res.status, statusText: res.statusText};
        let html = await res.text()
        el.outerHTML = html;
    }catch(err){
        let message = err.statusText || "Error al carcar al archivo, verifica la url";
        el.outerHTML = message
    }
    }

    document.querySelectorAll("[data-include]")
    .forEach(el=>{
        includeHtml(el, el.getAttribute("data-include"))
    });

})