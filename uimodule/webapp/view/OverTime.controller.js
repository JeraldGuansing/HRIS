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
  var totalHr = 0.00;
  return Controller.extend("WEBAP.RFID.view.Overtime", {
    onBeforeRendering:async function () {
      await this.onLoadData();
    },
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

    onLoadData: function(){
      this.userCode = jQuery.sap.storage.Storage.get("IDNo");
      this.oModel.getData().DataRecord={};
      this.oModel.getData().DataRecords=[];
      this.getView().byId("DateId").setValue(APPui5.getDatePostingFormat(new Date()));
      this.oModel.getData().DataRecord.TimeIn = "07:00 AM";
      this.oModel.getData().DataRecord.Timeout = "07:00 AM"; 
      this.oModel.getData().DataRecord.totalHour = "0"; 
      this.oModel.getData().DataRecords = APPui5.ExecQuery("getMyOverTime","Array",this.userCode,"","","",false);
      this.oModel.refresh(); 
    },

    onComputeTimeSched: function(oEvent){
          var start = this.oModel.getData().DataRecord.TimeIn;
          var end = this.oModel.getData().DataRecord.Timeout;
          
          start = APPui5.convertTo24Hour(start);
          start = start.replace(":", "");
          start = start.replace(" ", "");
        
          if(start.length === 5){
            start = start.slice(1);
          }

          end = APPui5.convertTo24Hour(end);
          end = end.replace(":", "");
          end = end.replace(" ", "");
        
          if(end.length === 5){
            end = end.slice(1);
          }
        
          var time = end - start;
          var duration = 0;
          var digit1,digit2,digit3 = 0;

          if(time.toString().length === 3){
            digit1 = time.toString().substring(0, 1);
            digit2 = time.toString().substring(1, 2);
            digit3 = time.toString().substring(2, 3)

            var mm = 0;

            if(digit2 === "0" && digit3 === "0"){
              var mm = "";
            }else{
              var mm = "." + digit2 + digit3;
            }

            duration = digit1 + mm;
          }

          if(time.toString().length === 4){
            digit1 = time.toString().substring(0, 2);
            digit2 = time.toString().substring(2, 3);
            digit3 = time.toString().substring(3, 4)

            var mm = 0;
            
            if(digit2 === "0" && digit3 === "0"){
              mm = "";
            }else{
              var mm = "." + digit2 + digit3;
            }

            duration = digit1 + mm;
          }
          
          this.oModel.getData().DataRecord.totalhrs = duration;


          this.oModel.refresh();
    },

    onChangeState: function(oEvent){
      var sourceControl = (oEvent.getSource()).sId;
      var result = sourceControl.replace("__xmlview1--", "");
      this.getView().byId(result).setValueState(sap.ui.core.ValueState.None);
    },


    onPostOvertime: async function(){
      if(this.getView().byId("DateId").getValue() === "" || this.getView().byId("DateId").getValue() === null || this.getView().byId("DateId").getValue() === undefined){
        this.getView().byId("DateId").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.oModel.getData().DataRecord.totalhrs === 0 || this.oModel.getData().DataRecord.totalhrs === "" || this.oModel.getData().DataRecord.totalhrs === null || this.oModel.getData().DataRecord.totalhrs === undefined){
        MessageBox.error("Please Select Time");
        return;
      }

  
      var oData = {};
      var oHeader = {};
      oData.OVTM = [];
      oHeader.O = "I";
      oHeader.IDNo = this.userCode;
      oHeader.OverTimeDte = this.getView().byId("DateId").getValue();
      oHeader.Timein = this.oModel.getData().DataRecord.TimeIn;
      oHeader.Timeout = this.oModel.getData().DataRecord.Timeout;
      oHeader.totalHour =  this.oModel.getData().DataRecord.totalhrs;
      oHeader.Remarks =  this.oModel.getData().DataRecord.Remarks;
      oHeader.Status = 'Pending';


      console.log(oHeader)
      oData.OVTM.push(oHeader);
      var message = await APPui5.postQuery(oData);
      if(message === 0){
        MessageBox.success("Filing overtime successfully,\nThank you.");
        this.onLoadData();
        this.oModel.refresh();
      }else{
        MessageBox.error(`${message}. filing failed\nPlease contact your admin.`);
      }
    },

    
  });
});
