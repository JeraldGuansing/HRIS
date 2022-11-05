sap.ui.define([
    "sap/ui/core/mvc/Controller",
    "sap/ui/model/json/JSONModel",
    "sap/m/MessageToast",
    "sap/ui/core/Fragment",
    "sap/m/Popover",
    "sap/m/Button",
    "sap/m/library",
    "sap/ui/model/Filter",
    "sap/ui/model/FilterOperator",
    "WEBAP/RFID/controller/APPui5",
    "sap/m/MessageBox"
], function(Controller, JSONModel, MessageToast,Fragment,Popover,Button,library,Filter,FilterOperator,APPui5,MessageBox) {
  "use strict";
  return Controller.extend("WEBAP.RFID.view.Attendance", {
    onInit: function(oEvent){
        var that = this;
        this.userCode = jQuery.sap.storage.Storage.get("IDNo");
        that.oModel=new JSONModel("model/data.json");
        that.getView().setModel(this.oModel,"oModel");
       
        var oView = that.getView();
        oView.addEventDelegate({
              onAfterHide: function(evt) {
                },
              onAfterShow: function(evt) {
                // oView.getController().onLoadForAdmin();
                },
              onBeforeFirstShow: function(evt) {
                },
              onBeforeHide: function(evt) {
                },
              onBeforeShow: function(evt) {
                  that.initialize();
                }
        });
    },
      
    initialize: function(){
        this._formFragments = {};
        this.oModel.getData().DataRecord={};
        this.oModel.refresh();
    },

    onLoadData: async function(){
        var fromDate = this.getView().byId("datefrom").getValue();
        var toDate = this.getView().byId("dateto").getValue();
        fromDate = APPui5.getDatePostingFormat(fromDate);
        toDate = APPui5.getDatePostingFormat(toDate);
        this.oModel.getData().DataRecord = await APPui5.ExecQuery("getMyDTR","Array",this.userCode,fromDate,toDate,"",false);
        this.oModel.refresh();
    }
 
  });
});
