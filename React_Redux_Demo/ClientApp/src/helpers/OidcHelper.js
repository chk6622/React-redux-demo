import { GetUser, StoreUser } from './UserHelper';
import { environment } from '../environments/environment';
import Oidc from 'oidc-client';

class OidcHelper {

    constructor() {
        this.userManager = new Oidc.UserManager(environment.openIdConnectSettings);
    }

    login(redirectUrl = '/Home/Index') {
        try {
            /*let user = GetUser();
            if (!user) {
                if (this.userManager) {
                    this.userManager.signinRedirect();
                }
            }
            else {
                window.location = redirectUrl;
            }*/
            window.location = redirectUrl;
            console.log(`Login Success!`);
        }
        catch (Exception) {
            console.log(`Login Failed!`);
        }
    }

    redirectCallback(redirectUrl = '/Home/Index') {
        this.userManager.signinRedirectCallback().then(user => {
            StoreUser(user);
            window.location = redirectUrl;
        }).catch(function (e) {
            console.log(e);
        });
    }

    renew() {
        if (this.userManager) {
            this.userManager.signinSilentCallback().then(user => {
                StoreUser(user);
            });
        }
    }

    logout(redirectUrl = '/') {
        let user = GetUser();
        if (user) {

            if (this.userManager) {
                this.userManager.signoutRedirect().then(res => {
                    sessionStorage.clear();
                });
            }
        }
        else {
            window.location = redirectUrl;
        }
    }
}

var GetOidcHelper = (function () {
    var instance;

    function createInstance() {
        var object = new OidcHelper();
        return object;
    }

    return {
        getInstance: function () {
            if (!instance) {
                instance = createInstance();
            }
            return instance;
        }
    };
})();

export default GetOidcHelper;