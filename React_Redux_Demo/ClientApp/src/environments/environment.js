export const idpBase = 'http://localhost:5000';
export const apiBase = 'http://localhost:8080';
export const appBase = 'http://localhost:3000';

export const environment = {
    production: false,
    apiBase,
    openIdConnectSettings: {
        authority: `${idpBase}`,
        client_id: 'react-client',
        redirect_uri: `${appBase}/callback`,
        post_logout_redirec_uri: `${appBase}`,
        silent_redirect_uri: `${appBase}/renew`,
        scope: 'SalesManagementApi openid profile address email phone roles',
        response_type: 'id_token token',
        automaticSilentRenew: true
    }
};
