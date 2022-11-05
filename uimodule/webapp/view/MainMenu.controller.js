sap.ui.define([
    "sap/ui/core/mvc/Controller",
      "sap/m/MessageToast",
      "sap/ui/model/json/JSONModel",
      "sap/ui/model/Filter",
      "sap/ui/model/FilterOperator",
      "sap/m/Token",
      "sap/m/MessageBox",
      "sap/ui/core/Fragment",
      "sap/ui/core/Core",
    "WEBAP/RFID/controller/APPui5",
  ], function(Controller,MessageToast, JSONModel, Filter, FilterOperator, Token, MessageBox,Fragment,Core,APPui5) {
    "use strict";
    return Controller.extend("WEBAP.RFID.view.MainMenu", {
      onInit: function(){
        var that = this;
        that.oModel=new JSONModel("model/data.json");
        that.getView().setModel(this.oModel,"oModel");
        this.sUserId = jQuery.sap.storage.Storage.get("IDNo");
        this.sUserName = jQuery.sap.storage.Storage.get("UserName");
        this.sUserPosition = jQuery.sap.storage.Storage.get("Position");

        this.getView().byId("UserName").setText(`${this.sUserName}(${this.sUserPosition})`);
        this.getView().byId("ShelluserName").setText(`${this.sUserId}`);

        this.oModel.refresh();
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
          this.onDashBaord();
        },

        onLoadAllData: function(){
         
        },

        onRootItemSelect: function(oEvent) {
            var oMenuGroup = oEvent.getSource();
            if (oMenuGroup.getExpanded()) {
            oMenuGroup.collapse();
            } else {
            oMenuGroup.expand();
            }
          },

          onMenuButtonPress: function () {
            var toolPage = this.byId("toolPage");
            toolPage.setSideExpanded(!toolPage.getSideExpanded());
          },

          onLogin: function(){
            sap.m.MessageToast.show("thank you " + this.sUserName);
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("RouteLogin");
          },

          onGotoEmployee: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Users");
          },

          onGotomyAttendance: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Attendance");
          },

          onOverTime: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("OverTime");
          },

          onLeave: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Leave");
          },

          onLoan: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Loan");
          },

          onPayslip: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Payslip");
          },

          onExpense: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Expense");
          },

          onApproval: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Approval");
          },
          
          onDashBaord: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("DashBoard");
          },

          onLeaveApproval: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("LeaveApproval");
          },

          onBudget: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("Budget");
          },

          onLoanApproval: function(){
            this.router = this.getOwnerComponent().getRouter();
            this.router.navTo("LoanApproval");
          },

    });
  });
  