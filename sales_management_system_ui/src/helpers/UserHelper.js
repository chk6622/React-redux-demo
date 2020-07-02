const USER = 'user';

export function StoreUser(user) {
    if (user) {
        sessionStorage.setItem(USER, JSON.stringify(user));
    }
}

export function GetUser() {
    
    let user = sessionStorage.getItem(USER);
    if (user) {
        user = JSON.parse(sessionStorage.getItem('user'));
    }
    return user;
}

export function GetAccessToken() {
    let access_token = '';
    let user = GetUser();
    if (user) {
        access_token = user.access_token;
    }
    return access_token;
}
