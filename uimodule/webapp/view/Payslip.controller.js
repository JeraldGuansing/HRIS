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
    "sap/m/MessageBox",
    "sap/m/PDFViewer"
], function(Controller, JSONModel, MessageToast,Fragment,Popover,Button,library,Filter,FilterOperator,APPui5,MessageBox,PDFViewer) {
  "use strict";
  return Controller.extend("WEBAP.RFID.view.Payslip", {
    onInit: function(oEvent){
        var that = this;
        that.oModel=new JSONModel("model/data.json");
        that.getView().setModel(this.oModel,"oModel");
        this.sUserId = jQuery.sap.storage.Storage.get("IDNo");
        this.sUserName = jQuery.sap.storage.Storage.get("UserName");
        this.sUserPosition = jQuery.sap.storage.Storage.get("Position");
        this.Cutoff = "September 16 - 30, 2022";
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
        this.oModel.getData().DataRecords=[];
    },

    onGeneratePaySlip: function(){
   this.oModel.getData().DataRecords = APPui5.ExecQuery("getPayslip","Array",jQuery.sap.storage.Storage.get("IDNo"),this.oModel.getData().DataRecord.CutoffDay,this.oModel.getData().DataRecord.CutoffMonth,this.oModel.getData().DataRecord.CutoffYear,false)
      console.log(this.oModel.getData().DataRecords)
      this.Cutoff = this.oModel.getData().DataRecord.CutoffMonth + " " + this.oModel.getData().DataRecord.CutoffDay  + ", " + this.oModel.getData().DataRecord.CutoffYear;
      
    },
      // When you click on 'Print' button then this method will call....
    handlePrint: async function (oEvent) {
      await this.onGeneratePaySlip();
      if(this.oModel.getData().DataRecords[0].totalPay === null || this.oModel.getData().DataRecords[0].totalHr === null){
        MessageBox.error("No record found, generation of payslip denied.");
        return;
      }
      var fullHtml = "";
      //Calling method....
      var header = this.getHeaderForm();
      fullHtml += header;
      //Making student table....
      var headertable1 = "<table  border='0' style='margin-top:150px;width: 700px;' align='center'>" +
       "<caption style='color:black;font-weight: bold;font-size: large;'>Payslip</caption>" +
       "<tr><th style='text-align:left'>Description</th>" +
       "<th style='text-align:right'>Amount</th>";
      //Adding row Payslip table....
      // for (var i = 0; i < 1; i++) {
       headertable1 += "<tr>" +
        "<td style='text-align:left'> " +  "Attendance" + "</td>" +
        "<td style='text-align:right'>₱ " + this.oModel.getData().DataRecords[0].totalPay + ".00  </td>" +
        "</tr><tr>" +

        "<td style='text-align:left'> " +  "Total Hours" + "</td>" +
        "<td style='text-align:right'>" + this.oModel.getData().DataRecords[0].totalHr + " Hours  </td>" +
        "</tr>";
      // }
      headertable1 += "</table>";
      fullHtml += headertable1;
      // Making Deduction table....
      var headertable2 = "<table  border='0' style='margin-top:50px;width: 700px;' align='center'>" +
       "<caption style='color:black;font-weight: bold;font-size: large;'>Deduction's</caption>" +
       "<tr><th style='text-align:left'>Description</th>" +
       "<th style='text-align:right'>Amount</th>";
                //Adding row dynamically to Deduction table....
        // for (var j = 0; j < this.oModel.getData().DeductRecords.length; j++) {
         headertable2 +="<tr>" +
          "<td style='text-align:left'> " + "Tax" + "</td>" +
          "<td style='text-align:right'> ₱ " + "0.00" + "  </td>" +

          "</tr><tr>" +
          "<td style='text-align:left'> " + "SSS" + "</td>" +
          "<td style='text-align:right'> ₱ " + "0.00" + "  </td>" +

          "</tr><tr>" +
          "<td style='text-align:left'> " + "Pagibig" + "</td>" +
          "<td style='text-align:right'> ₱ " + "0.00" + "  </td>" +

          "</tr><tr>" +
          "<td style='text-align:left'> " + "Tardiness" + "</td>" +
          "<td style='text-align:right'> ₱ " + "0.00" + "  </td>" +

          "</tr>";
        // }
        
        headertable2 += "</table>";
        fullHtml += headertable2;

      // Making Loan table....
        var headertable3 = "<table  border='0' style='margin-top:50px;width: 700px;' align='center'>" +
        "<caption style='color:black;font-weight: bold;font-size: large;'>Loan's</caption>" +
        "<tr><th style='text-align:left'>Description</th>" +
        "<th style='text-align:right'>Amount</th>";
                 //Adding row dynamically to Deduction table....
         // for (var j = 0; j < this.oModel.getData().DeductRecords.length; j++) {
          headertable3 +="<tr>" +
          "<td style='text-align:left'> " + "SSS" + "</td>" +
          "<td style='text-align:right'> ₱ " + "0.00" + "  </td>" + 

          "</tr><tr>" +
          "<td style='text-align:left'> " + "Company Loan" + "</td>" +
          "<td style='text-align:right'> ₱ " + "0.00" + "  </td>" +

           "</tr>";
         // }
         
         headertable3 += "</table>";
         fullHtml += headertable3;


        // window.open(URL, name, specs, replace)
        var wind = window.open("", "Payslip");
        wind.document.write(fullHtml);
        setTimeout(function () {
         wind.print();
         wind.close();
        }, 1000);
       },
       
       //Returing header data(Called method).... 
       getHeaderForm: function () {
        var modulePath = $.sap.getModulePath("print", "/image/");
        modulePath = modulePath + "CargoGo.PNG";
           return "<Img src='./resources/img/CargoGo.PNG'  style='align='center' width='100px' height='100px'/>" +
          "<hr/><div>" +
         "<div style=float:left>" +
         "<p style='text-decoration: underline'>ID Number        : " + this.sUserId + "</p>" +
         "<p style='text-decoration: underline'>Employee Name         : " + this.sUserName + "</p>" +
         "</div><div style=float:right>" +
         "<p style='text-decoration: underline'>Position    : " + this.sUserPosition + "</p>" +
         "<p style='text-decoration: underline'>Cutoff       : " + this.Cutoff + "</p>" +
         "</div></div>";
       }

    

   
  });
});

   