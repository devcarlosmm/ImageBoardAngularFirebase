import { _apiKey, _appId, _authDomain, _locationId, _messagingSenderId, _projectId, _storageBucket } from "./environment.local";

export const environment = {
  firebase: {
    projectId: _projectId,
    appId: _appId,
    storageBucket: _storageBucket,
    locationId: _locationId,
    apiKey: _apiKey,
    authDomain: _authDomain,
    messagingSenderId: _messagingSenderId,
  },
  production: true
};
