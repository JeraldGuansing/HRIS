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
  return Controller.extend("WEBAP.RFID.view.Leave", {
    onBeforeRendering:async function () {
      this.userCode = jQuery.sap.storage.Storage.get("IDNo");
      this.oModel.getData().DataRecord={};
      this.oModel.getData().DataRecords=[];
      this.oModel.getData().DataRecords = await APPui5.ExecQuery("getMyLeave","Array", jQuery.sap.storage.Storage.get("IDNo"),"","","",false);
      this.oModel.refresh();
    },
    onInit: function(oEvent){
        var that = this;
        that.oModel=new JSONModel("model/data.json");
        that.getView().setModel(this.oModel,"oModel");
        this.userCode = jQuery.sap.storage.Storage.get("IDNo");
        var oView = that.getView();
        oView.addEventDelegate({
              onAfterHside: function(evt) {
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
     
    },

    onPostLeave: async function(){
      if(this.getView().byId("DateId").getValue() === "" || this.getView().byId("DateId").getValue() === null || this.getView().byId("DateId").getValue() === undefined){
        this.getView().byId("DateId").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("Reasonid").getValue() === "" || this.getView().byId("Reasonid").getValue() === null || this.getView().byId("Reasonid").getValue() === undefined){
        this.getView().byId("Reasonid").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("Natureid").getSelectedKey() === "" || this.getView().byId("Natureid").getSelectedKey() === null || this.getView().byId("Natureid").getSelectedKey() === undefined){
        this.getView().byId("Natureid").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      var oData = {};
      var oHeader = {};
      oData.OLVE = [];
      oHeader.O = "I";
      oHeader.IDNo = this.userCode;
      oHeader.LeaveDte = this.getView().byId("DateId").getValue();
      oHeader.Reason = this.oModel.getData().DataRecord.Reason;
      oHeader.LeaveType =  this.oModel.getData().DataRecord.LeaveType;
      oHeader.Status = 'Pending';
      console.log(oHeader)
      oData.OLVE.push(oHeader);
      var message = await APPui5.postQuery(oData);
      if(message === 0){
        MessageBox.success("Filing overtime successfully,\nThank you.");
        this.oModel.getData().DataRecord={};
        this.oModel.getData().DataRecords=[];
        this.oModel.getData().DataRecords = APPui5.ExecQuery("getMyLeave","Array",this.userCode,"","","",false);
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
