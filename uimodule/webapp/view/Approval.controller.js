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
  return Controller.extend("WEBAP.RFID.view.Approval", {
    onInit: function(oEvent){
        var that = this;
        that.oModel=new JSONModel("model/data.json");
        that.getView().setModel(this.oModel,"oModel");
        that.userCode = jQuery.sap.storage.Storage.get("IDNo");
        var oView = that.getView();
        oView.addEventDelegate({
              onAfterHide: function(evt) {
                },
              onAfterShow: function(evt) {
                oView.getController().loadAllData();
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
      
    initialize:  function(){
      
    },

    onUpdate: async function(){
      var busyDialog = new sap.m.BusyDialog();
      busyDialog.open();

      var oData = {};
      var oHeader = {};
      var message = 0;
      for(let a = 0; a < this.oModel.getData().DataRecords.length; a++){
        if(this.oModel.getData().DataRecords[a].Status !== "" || this.oModel.getData().DataRecords[a].Status !== null || this.oModel.getData().DataRecords[a].Status !== undefined){
          oData.OVTM= [];
          oHeader.O = "U";
          oHeader.Id = this.oModel.getData().DataRecords[a].Id;
          oHeader.Status = this.oModel.getData().DataRecords[a].Status;
          oData.OVTM.push(oHeader);
          message = await APPui5.postQuery(oData);
          message = parseInt(message) + parseInt(message);
        }
      }
      if(message === 0){
        MessageBox.success("Data saved successfully.");
      }else{
        MessageBox.error(`${message}. Data not saved.`);
      }
      
      busyDialog.close();
      this.loadAllData();
    },

    loadAllData: function(){
      this.oModel.getData().DataRecords=[];
      this.oModel.getData().DataRecords = APPui5.ExecQuery("getAllOverTime","Array",jQuery.sap.storage.Storage.get("IDNo"),"","","",false);
      this.oModel.refresh(); 
    },

   
  });
});
