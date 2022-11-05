sap.ui.define([
  "sap/ui/test/Opa5",
  "WEBAP/RFID/test/integration/arrangements/Startup",
  "WEBAP/RFID/test/integration/BasicJourney"
], function(Opa5, Startup) {
  "use strict";

  Opa5.extendConfig({
    arrangements: new Startup(),
    pollingInterval: 1
  });

});
