class Es7FetchData{
    async get(url){
        const res=await fetch(url);
        
        let body = await res.json();
        let header=await res.headers.get('Content-Type');
        return {header,body};
    }

    async post(url,newData){

        const res=await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(newData)
        });
        return await res.json();
    }

    async put(url,updateData){
        const res=await fetch(url,{
            method:'PUT',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(updateData)
        });
        return await res.json();
    }

    async patch(url,updateData){
        const res=await fetch(url,{
            method:'PATCH',
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify(updateData)
        });
        return await res.json();
    }

    async delete(url){
        const res=await fetch(url,{method:'DELETE'});

        return await res.status===200?'Delete success!':'Delete failed!';
    }
}

