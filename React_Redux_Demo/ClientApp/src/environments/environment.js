export const idpBase = 'http://localhost:5000';
export const apiBase = 'http://localhost:5001';
export const angularBase = 'http://localhost:3000';

export const environment = {
    production: false,
    apiBase,
    openIdConnectSettings: {
        authority: `${idpBase}`,
        client_id: 'react-client',
        redirect_uri: `${angularBase}`,
        post_logout_redirec_uri: `${angularBase}/`,
        silent_redirect_uri: `${angularBase}/redirect-silentrenew`,
        scope: 'api1 openid profile address email phone roles',
        response_type: 'id_token token',
        automaticSilentRenew: true
    }
};
