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
  return Controller.extend("WEBAP.RFID.view.Expense", {
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
    },

    onLoadAllData: async function(){
      this.userCode = jQuery.sap.storage.Storage.get("IDNo");
      this.oModel.getData().DataRecord={};
      this.oModel.getData().DataRecords=[];
      var dateparam = APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.CreatedDate);
      this.oModel.getData().DataRecords = await APPui5.ExecQuery("getExpense","Array",  dateparam,"","","",false);
      this.oModel.refresh();
    },

    onChangeDate: async function(){
      var dateparam = APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.CreatedDate);
      this.oModel.getData().DataRecords = await APPui5.ExecQuery("getExpense","Array",  dateparam,"","","",false);
      this.oModel.refresh();
    },

    onPostLoan: async function(){
      if(this.getView().byId("ExpnseType").getSelectedKey() === "" || this.getView().byId("ExpnseType").getSelectedKey() === null || this.getView().byId("ExpnseType").getSelectedKey() === undefined){
        this.getView().byId("ExpnseType").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inpExpnsAmount").getValue() === "" || this.getView().byId("inpExpnsAmount").getValue() === null || this.getView().byId("inpExpnsAmount").getValue() === undefined){
        this.getView().byId("inpExpnsAmount").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inpExpnsReceipt").getValue() === "" || this.getView().byId("inpExpnsReceipt").getValue() === null || this.getView().byId("inpExpnsReceipt").getValue() === undefined){
        this.getView().byId("inpExpnsReceipt").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("DateId").getValue() === "" || this.getView().byId("DateId").getValue() === null || this.getView().byId("DateId").getValue() === undefined){
        this.getView().byId("DateId").setValueState(sap.ui.core.ValueState.Error);
        return;
      }
      
      var dateparam = APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.CreatedDate);
      var oData = {};
      var oHeader = {};
      oData.OEXP = [];
      oHeader.O = "I";
      oHeader.IDNo = this.userCode;
      oHeader.ExpenseType = this.getView().byId("ExpnseType").getSelectedKey();
      oHeader.Amount =  this.getView().byId("inpExpnsAmount").getValue();
      oHeader.ReceiptNo =  this.getView().byId("inpExpnsReceipt").getValue();
      oHeader.Remarks =  this.getView().byId("RemarksId").getValue();
      oHeader.ExpDte =  this.getView().byId("DateId").getValue();
      // oHeader.Status = 'Pending';
      console.log(oHeader)
      oData.OEXP.push(oHeader);
      var message = await APPui5.postQuery(oData);
      if(message === 0){
        MessageBox.success("Data Save successfully,\nThank you.");
        this.oModel.getData().DataRecord={};
        this.oModel.getData().DataRecords=[];
      
        this.oModel.getData().DataRecords = await APPui5.ExecQuery("getExpense","Array",  dateparam,"","","",false);
        this.oModel.refresh();
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
