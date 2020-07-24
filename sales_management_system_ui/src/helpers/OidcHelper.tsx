import { GetUser, StoreUser } from './UserHelper';
import environment from '../environment/environment';
import Oidc from 'oidc-client';


class OidcHelper {

    private static instance:OidcHelper|null=null;
    private userManager:any=null;

    private constructor() {
        this.userManager = new Oidc.UserManager(environment.openIdConnectSettings);
    }

    public static getInstance(){
        if(OidcHelper.instance===null){
            OidcHelper.instance=new OidcHelper();
        }
        return OidcHelper.instance;
    }

    login(redirectUrl = '/Home/Welcome') {
        try {
            /*let user = GetUser();
            if (!user) {
                if (this.userManager) {
                    this.userManager.signinRedirect();
                }
            }
            else {
                window.location.href = redirectUrl;
            }*/
            window.location.href = redirectUrl;
            console.log(`Login Success!`);
        }
        catch (Exception) {
            console.log(`Login Failed!`);
        }
    }

    redirectCallback(redirectUrl = '/Home/Welcome') {
        this.userManager.signinRedirectCallback().then((user:any) => {
            StoreUser(user);
            window.location.href = redirectUrl;
        }).catch(function (e:any) {
            console.log(e);
        });
    }

    renew() {
        if (this.userManager) {
            this.userManager.signinSilentCallback().then((user:any) => {
                StoreUser(user);
            });
        }
    }

    logout(redirectUrl = '/') {
        /*let user = GetUser();
        if (user) {

            if (this.userManager) {
                this.userManager.signoutRedirect().then((res:any) => {
                    sessionStorage.clear();
                });
            }
        }
        else {
            window.location.href = redirectUrl;
        }*/

        window.location.href = redirectUrl;
    }
}

// var GetOidcHelper = (function () {
//     var instance;

//     function createInstance() {
//         var object = new OidcHelper();
//         return object;
//     }

//     return {
//         getInstance: function () {
//             if (!instance) {
//                 instance = createInstance();
//             }
//             return instance;
//         }
//     };
// })();

export default OidcHelper;