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
  return Controller.extend("WEBAP.RFID.view.Budget", {
    onBeforeRendering:async function () {
      await this.onLoadAllData();
    },
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
      var isYear = APPui5.getCurrentYear();
      this.oModel.getData().AllWeeks = await APPui5.ExecQuery("getWeeks","Array",  isYear,"","","",false);
      this.oModel.refresh();
    },

    onPostLoan: async function(){
      if(this.getView().byId("BudgetTypeid").getSelectedKey() === "" || this.getView().byId("BudgetTypeid").getSelectedKey() === null || this.getView().byId("BudgetTypeid").getSelectedKey() === undefined){
        this.getView().byId("BudgetTypeid").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("BdgetAmount").getValue() === "" || this.getView().byId("BdgetAmount").getValue() === null || this.getView().byId("BdgetAmount").getValue() === undefined){
        this.getView().byId("BdgetAmount").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("PaticularId").getValue() === "" || this.getView().byId("PaticularId").getValue() === null || this.getView().byId("PaticularId").getValue() === undefined){
        this.getView().byId("PaticularId").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("WeekNumber").getValue() === "" || this.getView().byId("WeekNumber").getValue() === null || this.getView().byId("WeekNumber").getValue() === undefined){
        this.getView().byId("WeekNumber").setValueState(sap.ui.core.ValueState.Error);
        return;
      }
      
      var oData = {};
      var oHeader = {};
      oData.OBDG = [];
      oHeader.O = "I";
      oHeader.IDNo = this.userCode;
      oHeader.BudgetType = this.getView().byId("BudgetTypeid").getSelectedKey();
      oHeader.Weekly =  this.getView().byId("WeekNumber").getValue();
      oHeader.Amount =  this.getView().byId("BdgetAmount").getValue();
      oHeader.Particular =  this.getView().byId("PaticularId").getValue();
      oHeader.Status =  'Open'
      console.log(oHeader)
      oData.OBDG.push(oHeader);
      var message = await APPui5.postQuery(oData);
      if(message === 0){
        MessageBox.success("Data save successfully,\nThank you.");
        this.oModel.getData().DataRecord={};
        this.oModel.getData().DataRecords=[];
        this.getView().byId("BudgetTypeid").setSelectedKey("");
        this.getView().byId("WeekNumber").setValue("");
        this.getView().byId("BdgetAmount").setValue("");
        this.getView().byId("PaticularId").setValue("");
      }else{
        MessageBox.error(`${message}. filing failed\nPlease contact your admin.`);
      }
    },

    onChangeState: function(oEvent){
      var sourceControl = (oEvent.getSource()).sId;
      var result = sourceControl.replace("__xmlview1--", "");
      this.getView().byId(result).setValueState(sap.ui.core.ValueState.None);
    },

   
  });
});
