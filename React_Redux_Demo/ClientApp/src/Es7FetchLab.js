import { Header } from "semantic-ui-react";

export class Es7FetchData{

    /**
     * query
     * @param {string} url
     * @param {string} access_token
     */
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

    async delete(url, access_token){
        const res = await fetch(url,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    "Authorization": "Bearer " + access_token
                }
            });
        let status = await res.status;
        switch (status) {
            case 204:
                return 'Delete success!';
            case 403:
                return 'The data is referred by a sale data, so cannot be deleted! ';
            case 404:
                return 'The data is not exist!';
            default:
                return 'Delete failed!'
        }
    }
}

