import { AuthenticationContext, adalFetch, withAdalLogin } from 'react-adal';

export const adalConfig = {
    tenant: '72f988bf-86f1-41af-91ab-2d7cd011db47',
    clientId: '140b4e02-5a76-4c4f-aecd-5b7562f93e62',
    endpoints: {
        api: '140b4e02-5a76-4c4f-aecd-5b7562f93e62',
    },
    cacheLocation: 'localStorage',
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (fetch, url, options) =>
    adalFetch(authContext, adalConfig.endpoints.api, fetch, url, options);

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);