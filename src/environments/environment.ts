// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { _projectId, _appId, _storageBucket, _locationId, _apiKey, _authDomain, _messagingSenderId } from "./environment.local";

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
  production: false
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
