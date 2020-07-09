export const idpBase = 'http://localhost:5001';
export const apiBase = 'http://3.25.118.30:8080';
export const appBase = 'http://3.25.118.30:3000';

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
