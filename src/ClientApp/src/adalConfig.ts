﻿import { AuthenticationContext, adalFetch, withAdalLogin, AdalConfig } from 'react-adal';

export const adalConfig: AdalConfig  = {
  tenant: '72f988bf-86f1-41af-91ab-2d7cd011db47',
  clientId: '140b4e02-5a76-4c4f-aecd-5b7562f93e62',
  endpoints: {
    api: '140b4e02-5a76-4c4f-aecd-5b7562f93e62',
  },
  postLogoutRedirectUri: window.location.origin,
  cacheLocation: "localStorage",
};

export const authContext = new AuthenticationContext(adalConfig);

export const adalApiFetch = (url: string, options: any = {}): Promise<Response> => adalFetch(
  authContext,
  adalConfig.endpoints.api,
  fetch,
  url,
  options,
);

export const withAdalLoginApi = withAdalLogin(authContext, adalConfig.endpoints.api);
