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

  return Controller.extend("WEBAP.RFID.view.Login", {
    onInit: function(){
      var that = this;
      that.oModel=new JSONModel("model/data.json");
      that.getView().setModel(this.oModel,"oModel");
      that.timeService();
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
        this.getView().byId("Username").setValue("");
        this.getView().byId("Password").setValue("");
        this.timeService();
      },

      onLoadAllData: function(){
        this.oModel.getData().Creadentials = {};
        this.oModel.getData().Login = [];
        this.oModel.getData().Creadentials.NewPassword = "";
        this.oModel.getData().Creadentials.ConfPassword = "";
       
      },
      Timer: function(){
        if (this.DTR) {
          var today = new Date();
          var oTime = APPui5.Timeformater(today);
          sap.ui.getCore().byId("inTimeid").setText(oTime);
          sap.ui.getCore().byId("onTimeid").setText(oTime);
        }
      },
      timeService: function() {
        var self = this;
        this.intervalHandle = setInterval(function() {
            self.Timer();
         }, 1000);
      },
      onMain: function(){
        this.router = this.getOwnerComponent().getRouter();
        this.router.navTo("MainMenu");
      },

      onChangeUID: async function(){
        var uid = this.getView().byId("Username").getValue();
        this.oModel.getData().Login =  await APPui5.ExecQuery("getUserBy","Array",uid,"","","",false);
        if(this.oModel.getData().Login.length !== 0){
          if(this.oModel.getData().Login[0].Status === "New"){
            this.onShowSetPassword();
          }
        }
      },

      onShowSetPassword: function(oEvent){
        if (!this.oPass) {
          this.oPass = sap.ui.xmlfragment("WEBAP.RFID.view.fragments.Password", this);
          this.getView().addDependent(this.oPass);
        }
        this.oPass.open();

        sap.ui.getCore().byId("NewPassword").setValue("");
        sap.ui.getCore().byId("ConPassword").setValue("");
        sap.ui.getCore().byId("NewPassword").setType("Password");
        sap.ui.getCore().byId("ConPassword").setType("Password");
        sap.ui.getCore().byId("bttn1").setIcon("sap-icon://hide");
        sap.ui.getCore().byId("bttn2").setIcon("sap-icon://hide");
      },
  
      closePassword: function(){
        if(this.oPass){
          this.oPass.close();
        }
      },
      onUpdatePassword: async function(){
        var newPassword =  sap.ui.getCore().byId("NewPassword").getValue();
        var confPassword = sap.ui.getCore().byId("ConPassword").getValue();

        // if(newPassword === ""){
        //   MessageBox.error("Please Enter Password");
        //   return;
        // }

        // if(confPassword === ""){
        //   MessageBox.error("Please Enter confirm Password");
        //   return;
        // }

        // if(APPui5.containsSpecialChars(newPassword) === false){
        //   MessageBox.error("Password should contains alteast 1 special character.");
        //   return;
        // }

        // if(newPassword !== confPassword){
        //   MessageBox.error("Password does not match confirm password");
        //   return;
        // }

  
        // if(newPassword.length < 8){
        //   MessageBox.error("Password should have 8 characters");
        //   return;
        // }
  
        // var regExp = /[a-zA-Z]/g;             
        // if(regExp.test(newPassword)){
        // } else {
        //   MessageBox.error("Password must include numbers and letters");
        //   return;
        // }
    
        // if(APPui5.ContainsNumber(newPassword) == false){
        //   MessageBox.error("Password must include numbers and letters");
        //   return;
        // }
        
        // if(APPui5.checkUppercase(newPassword) == false){
        //   MessageBox.error("Password must include atleast 1 uppercase letter");
        //   return;
        // }
        
        // if(APPui5.checkLowercase(newPassword) == false){
        //   MessageBox.error("Password must include atleast 1 lowercase letter");
        //   return;
        // }

        var path = "GeneratePassword?password=" + newPassword + "&idNo=" + this.getView().byId("Username").getValue();
        var message = await APPui5.Login(path);

        if(message === "Success"){
          MessageBox.success("Password saved successfully.");
        }else{
          MessageBox.error(`${message}. Password not saved.`);
        }
        this.closePassword();
      },
      onviewPassword: function(){
        var inputType = sap.ui.getCore().byId("NewPassword").getType();
        if(inputType !== "Password"){
          sap.ui.getCore().byId("NewPassword").setType("Password");
          sap.ui.getCore().byId("bttn1").setIcon("sap-icon://hide");
        }else{
          sap.ui.getCore().byId("NewPassword").setType("Text");
          sap.ui.getCore().byId("bttn1").setIcon("sap-icon://show");
        }
      },
      onviewCPassword: function(){
          var inputType = sap.ui.getCore().byId("ConPassword").getType();
          if(inputType !== "Password"){
            sap.ui.getCore().byId("ConPassword").setType("Password");
            sap.ui.getCore().byId("bttn2").setIcon("sap-icon://hide");
          }else{
            sap.ui.getCore().byId("ConPassword").setType("Text");
            sap.ui.getCore().byId("bttn2").setIcon("sap-icon://show");
          }
      },
      onPressLogin: async function(){
        if(this.getView().byId("Username").getValue() === ""){
          MessageBox.success("Please Enter ID Number");
          return;
        }

        if(this.getView().byId("Password").getValue() === ""){
          MessageBox.success("Please Enter Password");
          return;
        }
        var path = "login?&idNo=" + this.getView().byId("Username").getValue() + "&password=" + this.getView().byId("Password").getValue();
        var message = await APPui5.Login(path);

        if(message === "Success"){
          var firstName = this.oModel.getData().Login[0].FirstName;
          var surName =  this.oModel.getData().Login[0].Surname; 
          var fname =  firstName + " " + surName;
          jQuery.sap.storage.Storage.put("IDNo",this.getView().byId("Username").getValue());
          jQuery.sap.storage.Storage.put("UserName",fname);
          jQuery.sap.storage.Storage.put("Position", this.oModel.getData().Login[0].Position);
          sap.m.MessageToast.show("Welcome " + firstName);
          this.onMain();
        }else{
          MessageBox.error(`Invalid ID Number/Password`);
        }

      },

      // ****DTR****

      onShowTimer: function(){
        if (!this.DTR) {
          this.DTR = sap.ui.xmlfragment("WEBAP.RFID.view.fragments.Timer", this);
          this.getView().addDependent(this.DTR);
        }
        // this.timeService();
        sap.ui.getCore().byId("iIDNo").setValue("");
        sap.ui.getCore().byId("iPINNo").setValue("");
        this.DTR.open();
      }, 
      onCloseTimer: function(){
        if(this.DTR){
            this.DTR.close();
        }
      },

      onTimeIn: async function(){
        var UID =  sap.ui.getCore().byId("iIDNo").getValue(); 
        var UPN =  sap.ui.getCore().byId("iPINNo").getValue(); 
        var isDay = APPui5.getDayName();

        var isDayNow = new Date();
        
        var isDayNow = APPui5.getCurrentDay();    
        var isMonth = APPui5.getMonth();
        var isYear = APPui5.getCurrentYear();
        var cutoff = "";
        if(parseInt(isDayNow) < 15){
          cutoff = "1 to 15";
        }else{
          cutoff = "16 to 30";
        }

        var dateToday = APPui5.getDatePostingFormat(new Date());
        
        var oTimer = APPui5.PostDTRformat(new Date());
        if(UID === ""){
          MessageBox.error("Please Enter ID Number");
          return;
        }
        if(UPN === ""){
          MessageBox.error("Please Enter ID Number");
          return;
        }
        //Check Credentials;
        // var isCredited =  await APPui5.ExecQuery("TimeInPin","Array",UID,UPN,"","",false);
        var path = "login?&idNo=" + UID + "&password=" + UPN;
        var message = await APPui5.Login(path);

        if(message === "Success"){
          var isCredited =  await APPui5.ExecQuery("TimeInPin","Array",UID,"","",false);
          var oStatus = isCredited[0].Status;
          if(oStatus !== "Inactive"){
            //Check Schedule;
            var sched = await APPui5.ExecQuery("getSchedule","Array",UID,isDay,"","",false);
            if(sched.length !== 0){
              //check if time in already;
              var oTimeIn = await APPui5.ExecQuery("getDTR","Array",UID,dateToday,"","",false);
              if(oTimeIn.length !== 0){
                MessageBox.warning("You have already timed-in");
              }else{
                //Posting Here
                var Tardihours = APPui5.computeTimeDif(sched[0].Timein,oTimer);
                var oData = {};
                var oHeader = {};
                oData.ODTR = [];
                oHeader.O = "I";
                oHeader.IDNo = UID;
                oHeader.DayString = isDay;
                oHeader.Timein = oTimer;
                oHeader.Tardi = Tardihours;
                oHeader.MM = isMonth;
                oHeader.YYYY = isYear;
                oHeader.DD = cutoff;
                oHeader.Earning = 0;
                oData.ODTR.push(oHeader);
                var message = await APPui5.postQuery(oData);
                if(message === 0){
                  MessageBox.success("Time-in successfully,\nMake sure to time-out later.");
                }else{
                  MessageBox.error(`${message}. Time-in failed\nPlease contact your admin.`);
                }
                sap.ui.getCore().byId("iPINNo").setValue(""); 
                sap.ui.getCore().byId("iIDNo").setValue(""); 
              }
            }else{
              MessageBox.error("You have no schedule today for work.\nFile an overtime if you will work today");
            }
          }else{
            MessageBox.error("Access Denied");
          }
        }else{
          MessageBox.error("Invalid time in due to invalid ID Number or PIN");
        }
      },
      onTimeOut: async function(){
        var UID =  sap.ui.getCore().byId("oIDNo").getValue(); 
        var UPN =  sap.ui.getCore().byId("oPINNo").getValue(); 
        var oTimer = APPui5.PostDTRformat(new Date());
        var isDay = APPui5.getDayName();
        var dateToday = APPui5.getDatePostingFormat(new Date());
          //Check Credentials;
          // var isCredited =  await APPui5.ExecQuery("TimeInPin","Array",UID,UPN,"","",false);
          // if(isCredited.length !==0){
           
           var path = "login?&idNo=" + UID + "&password=" + UPN;
           var message = await APPui5.Login(path);
            if(message === "Success"){
                //check if have time in;
                var isCredited =  await APPui5.ExecQuery("TimeInPin","Array",UID,UPN,"","",false);
                var oTimeIn = await APPui5.ExecQuery("getDTR","Array",UID,dateToday,"","",false);
                if(oTimeIn.length !== 0){
                  //Posting Here
                var sched = await APPui5.ExecQuery("getSchedule","Array",UID,isDay,"","",false);
                var time1 = APPui5.convertJavaTime(oTimeIn[0].Timein);
                  
                var timeInSched = new Date(time1); 
                var timeOutSched = new Date(); 
                
                var diffMs = (timeOutSched - timeInSched); // milliseconds between now & Christmas
                var diffHrs = Math.floor((diffMs % 86400000) / 3600000); // hours
                var diffMins = Math.round(((diffMs % 86400000) % 3600000) / 60000); // minutes
                 
                var tardi = 0;
                var totalHr = sched[0].totalHour;
                // if(parseInt(diffHrs) < 0){
                  // tardi = Math.abs(diffHrs) + "." + Math.abs(diffMins);
                  // totalHr = APPui5.onRound(totalHr - tardi);
                // }

                var empDetails = await APPui5.ExecQuery("EmpDetails","Array",UID,"","","",false);
                var oEarning = APPui5.onRound(empDetails[0].perHour);

                var totalEarning = oEarning * totalHr;
                var totalTardi =0;
                // totalTardi = totalEarning * tardi;

                  var oData = {};
                  var oHeader = {};
                  oData.ODTR = [];
                  oHeader.O = "U";
                  oHeader.Id = oTimeIn[0].Id;
                  oHeader.Timeout = oTimer;
                  oHeader.Earning =  APPui5.onRound(totalEarning);
                  oHeader.Tardi = totalTardi;
                  oHeader.totalHour = totalHr;
                  oHeader.Status = 'Pending';
                  oData.ODTR.push(oHeader);
                  var message = await APPui5.postQuery(oData);
                  if(message === 0){
                    MessageBox.success("Time-out successfully,\nThank you.");
                  }else{
                    MessageBox.error(`${message}. Time-out failed\nPlease contact your admin.`);
                  }
                  sap.ui.getCore().byId("oIDNo").setValue(""); 
                  sap.ui.getCore().byId("oPINNo").setValue(""); 
                }else{
                  MessageBox.warning("Kindly time-in first before you time-out.");
                }
          }else{
            MessageBox.error("Invalid time out due to invailid ID Number or PIN");
          }
    },

  });
});
