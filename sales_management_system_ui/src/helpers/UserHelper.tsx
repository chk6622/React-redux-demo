const USER = 'user';

export function StoreUser(user:any) {
    if (user) {
        sessionStorage.setItem(USER, JSON.stringify(user));
    }
}

export function GetUser():any {
    
    let user = sessionStorage.getItem(USER);
    if (user) {
        user = JSON.parse(user);
    }
    return user;
}

export function GetAccessToken():any {
    let access_token = '';
    let user = GetUser();
    if (user) {
        access_token = user.access_token;
    }
    return access_token;
}
