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
  return Controller.extend("WEBAP.RFID.view.LoanApproval", {
    onBeforeRendering:async function () {
      await this.onLoadAllData();
    },
    onInit: function(oEvent){
        var that = this;
        that.oModel=new JSONModel("model/data.json");
        that.getView().setModel(this.oModel,"oModel");
        that.userCode = jQuery.sap.storage.Storage.get("IDNo");
        var oView = that.getView();
        this.iSelectedRow = 0;
        oView.addEventDelegate({
              onAfterHide: function(evt) {
                },
              onAfterShow: function(evt) {
                oView.getController().onLoadAllData();
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
        this.oModel.getData().DataRecord={};
        this.onLoadAllData();
    },

    onLoadAllData: async function(){
      this.userCode = jQuery.sap.storage.Storage.get("IDNo");
      this.oModel.getData().DataRecord={};
      this.oModel.getData().DataRecords=[];
      this.oModel.getData().DataRecords = await APPui5.ExecQuery("getAllLoan","Array",  jQuery.sap.storage.Storage.get("IDNo"),"","","",false);
      this.oModel.refresh();
    },


    onUpdate: async function(){
      var busyDialog = new sap.m.BusyDialog();
      busyDialog.open();

      var oData = {};
      var oHeader = {};
      var message = 0;
      for(let a = 0; a < this.oModel.getData().DataRecords.length; a++){
        if(this.oModel.getData().DataRecords[a].Status !== "" || this.oModel.getData().DataRecords[a].Status !== null || this.oModel.getData().DataRecords[a].Status !== undefined){
          oData.LOAN= [];
          oHeader.O = "U";
          oHeader.Id = this.oModel.getData().DataRecords[a].Id;
          oHeader.Status = this.oModel.getData().DataRecords[a].Status;
          oData.LOAN.push(oHeader);
          message = await APPui5.postQuery(oData);

          if(this.oModel.getData().DataRecords[a].Status === "Approved"){
            var empBalance = await APPui5.ExecQuery("getLoanBalance","Array",  this.oModel.getData().DataRecords[a].IDNo,"","","",false);
            var totalBalance  = APPui5.onRound(this.oModel.getData().DataRecords[a].LoanAmount,2) + APPui5.onRound(empBalance[0].LoanBalance,2);
            
            oData = {};
            oHeader = {};
            
            oData.OEMP= [];
            oHeader.O = "U";
            oHeader.Id = empBalance[0].Id;
            oHeader.LoanBalance = totalBalance;
            oData.OEMP.push(oHeader);
            message = await APPui5.postQuery(oData);
            message = parseInt(message) + parseInt(message);
          }
          message = parseInt(message) + parseInt(message);
        }
      }

      if(message === 0){
        MessageBox.success("Data saved successfully.");
      }else{
        MessageBox.error(`${message}. Data not saved.`);
      }
      
      busyDialog.close();
      this.onLoadAllData();
    },


    onChangeStatus: function(oEvent){
      this.iSelectedRow = oEvent.getSource().getParent().getIndex();
      var myInputControl = oEvent.getSource(); // e.g. the first item
      var boundData = myInputControl.getBindingContext('oModel').getObject();
      console.log(boundData)

      if(boundData.isStatus === "Approved"){
        MessageBox.error("Unable to change due to already Approved");
        this.oModel.getData().DataRecords[this.iSelectedRow].Status = boundData.isStatus;
        this.oModel.refresh();
        return;
      }

      if(boundData.isStatus === "Reject"){
        MessageBox.error("Unable to change due to already Reject");
        this.oModel.getData().DataRecords[this.iSelectedRow].Status = boundData.isStatus;
        this.oModel.refresh();
        return;
      }

     
    } 
  

   
  });
});
