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
        let status = await res.status;
        //window.alert(status);
        let body = null;
        let pagination = null;
        let location = null;
        let msg = '';
        if (status === 200) {
            body = await res.json();
            pagination = await res.headers.get('x-pagination');
            location = await res.headers.get('location');
        }
        else {
            msg = `Query Failed!(Code:${status})`;
        }
        return { pagination,body,location};
    }

    /**
     * add
     * @param {string} url
     * @param {string} access_token
     * @param {object} newData
     */
    async post(url, access_token, newData){

        const res=await fetch(url,{
            method:'POST',
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + access_token
            },
            body:JSON.stringify(newData)
        });
        let status = await res.status;
        alert(status);
        let body = status=='201'?await res.json():null;
        let location = status == '201' ? await res.headers.get('location') : null;
        let msg = status == '201' ? 'Add success!' : 'Add fail!';
        return { msg, body, location };
    }

    /**
     * update
     * @param {string} url
     * @param {string} access_token
     * @param {object} updateData
     */
    async put(url,access_token,updateData){
        const res=await fetch(url,{
            method:'PUT',
            headers:{
                'Content-Type': 'application/json',
                "Authorization": "Bearer " + access_token
            },
            body:JSON.stringify(updateData)
        });
        let status = await res.status;
        let body = status == '201' ? await res.json() : null;
        let location = status == '201' ? await res.headers.get('location') : null;
        let msg = status == '201' ? 'Update success!' : status=='404'?'The data is not exist in the database!':'Updata fail!';
        return { msg, body, location };
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

