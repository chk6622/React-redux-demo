export class Es7FetchData{
    async get(url,access_token){
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + access_token
            },
        });
        
        let body = await res.json();
        let pagination = await res.headers.get('x-pagination');
        let location = await res.headers.get('location');
        return { pagination,body,location};
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

