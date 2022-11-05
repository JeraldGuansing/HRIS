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
  
  return Controller.extend("WEBAP.RFID.view.Users", {
        // onBeforeRendering: async function () {
        
        // },
        onInit: function(oEvent){
            var that = this;
            that.oModel=new JSONModel("model/data.json");
            that.getView().setModel(this.oModel,"oModel");
         
            var oView = that.getView();
              oView.addEventDelegate({
                  onAfterHide: function(evt) {
                    },
                  onAfterShow: async function(evt) {
                    oView.getController().loadAllData();
                      // await that.loadAllData();
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
      this.loadAllData();
    },


    loadAllData: function(){
      // this.onClearFields();
      this.oModel.getData().AllEmpRecord = APPui5.ExecQuery("getAllEmployee","Array","","","","",false);
      var allRecord =  this.oModel.getData().AllEmpRecord.length;
      allRecord = parseInt(allRecord) + 1;
      this.oModel.getData().DataRecord.IDNo = "CGT" + APPui5.zeroPad(allRecord,6);   
      this.oModel.refresh(); 
    },

    onAddnew: function(){
      this.oModel.getData().DataRecord={};
      this.oModel.getData().AllEmpRecord = APPui5.ExecQuery("getAllEmployee","Array","","","","",false);
      var allRecord =  this.oModel.getData().AllEmpRecord.length;
      allRecord = parseInt(allRecord) + 1;
      this.oModel.getData().DataRecord.IDNo = "CGT" + APPui5.zeroPad(allRecord,6);
      this.resetSchedule();
      this.oModel.getData().Addbutton.Name= "Add";
      this.oModel.getData().Addbutton.Icon= "sap-icon://add-contact";
      this.oModel.refresh();
    },

    _getFormFragment: function (sFragmentName) {
        console.log(sFragmentName)
        var pFormFragment = this._formFragments[sFragmentName],
            oView = this.getView();

        if (!pFormFragment) {
            pFormFragment = Fragment.load({
                id: oView.getId(),
                name: "WEBAP.RFID.view.fragments." + sFragmentName
            });
            this._formFragments[sFragmentName] = pFormFragment;
        }

        return pFormFragment;
    },

    _showFormFragment : function (sFragmentName) {
        var oPage = this.byId("Empidform");
        oPage.removeAllContent();
        this._getFormFragment(sFragmentName).then(function(oVBox){
            oPage.insertContent(oVBox);
        });
    },

    handleValueFindEmployee: function (oEvent) {
      Fragment.load({
        name: "WEBAP.RFID.view.fragments.FindAllEmp",
        controller: this
      }).then(function (oValueHelpDialogEmp) {
        this._oValueHelpDialogEmp = oValueHelpDialogEmp;
        this.getView().addDependent(this._oValueHelpDialogEmp);
        this.oModel.getData().AllEmpRecord = APPui5.ExecQuery("getAllEmployee","Array","","","","",false);
        this._oValueHelpDialogEmp.open();
      }.bind(this));
    },

    handleSearchEmployee: function (oEvent) {
      var sValue = oEvent.getParameter("value");

      var oFilter = new Filter([
        new Filter("IDNo", FilterOperator.Contains, sValue),
        new Filter("SurName", FilterOperator.Contains, sValue),
        new Filter("FirstName", FilterOperator.Contains, sValue)
      ], false);

      var oBinding = oEvent.getSource().getBinding("items");
      oBinding.filter(oFilter);
    },

    handleValueCloseEmployee: function (oEvent) {
      var aContexts = oEvent.getParameter("selectedContexts");
      var CardDetails = {};
      if (aContexts && aContexts.length) {
        CardDetails = aContexts.map(function (oContext) {
          var oCard = {};
          oCard.Id = oContext.getObject().Id;
          oCard.IDNo = oContext.getObject().IDNo;
          oCard.FirstName = oContext.getObject().FirstName;
          oCard.Surname = oContext.getObject().Surname;
          oCard.BirthDte = oContext.getObject().BirthDte;
          oCard.CivilStatus = oContext.getObject().CivilStatus;
          oCard.Gender = oContext.getObject().Gender;
          oCard.ContactNo = oContext.getObject().ContactNo;
          oCard.ContactEmergencyName = oContext.getObject().ContactEmergencyName;
          oCard.ContactEmergencyNo = oContext.getObject().ContactEmergencyNo;
          oCard.HiringDte = oContext.getObject().HiringDte;
          oCard.Position = oContext.getObject().Position;
          oCard.WorkHours = oContext.getObject().WorkHours;
          oCard.BasicPay = oContext.getObject().BasicPay;
          oCard.SSS = oContext.getObject().SSS;
          oCard.Philhealth = oContext.getObject().Philhealth;
          oCard.Pagibig = oContext.getObject().Pagibig;
          oCard.LoanBalance = oContext.getObject().LoanBalance;
          oCard.Approver = oContext.getObject().Approver;
          oCard.UserType = oContext.getObject().UserType;
          oCard.EmailAdd = oContext.getObject().EmailAdd;
          return oCard;
        });
      }
        oEvent.getSource().getBinding("items").filter([]);
        this.oModel.getData().DataRecord.Id =  CardDetails[0].Id
        this.oModel.getData().DataRecord.IDNo = CardDetails[0].IDNo;
        this.oModel.getData().DataRecord.FirstName = CardDetails[0].FirstName;
        this.oModel.getData().DataRecord.Surname = CardDetails[0].Surname;
        this.oModel.getData().DataRecord.BirthDte = CardDetails[0].BirthDte;
        this.oModel.getData().DataRecord.CivilStatus = CardDetails[0].CivilStatus;
        this.oModel.getData().DataRecord.Gender = CardDetails[0].Gender;
        this.oModel.getData().DataRecord.ContactNo = CardDetails[0].ContactNo;
        this.oModel.getData().DataRecord.ContactEmergencyName = CardDetails[0].ContactEmergencyName;
        this.oModel.getData().DataRecord.ContactEmergencyNo = CardDetails[0].ContactEmergencyNo;
        this.oModel.getData().DataRecord.HiringDte = CardDetails[0].HiringDte;
        this.oModel.getData().DataRecord.Position = CardDetails[0].Position;
        this.oModel.getData().DataRecord.WorkHours = CardDetails[0].WorkHours;
        this.oModel.getData().DataRecord.SSS = CardDetails[0].SSS;
        this.oModel.getData().DataRecord.Philhealth = CardDetails[0].Philhealth;
        this.oModel.getData().DataRecord.Pagibig = CardDetails[0].Pagibig;
        this.oModel.getData().DataRecord.LoanBalance = CardDetails[0].LoanBalance;
        this.oModel.getData().DataRecord.Approver = CardDetails[0].Approver;
        this.oModel.getData().DataRecord.UserType = CardDetails[0].UserType;
        this.oModel.getData().DataRecord.EmailAdd = CardDetails[0].EmailAdd;
        this.oModel.getData().DataRecord.BasicPay = CardDetails[0].BasicPay;
        
        var today = APPui5.getDatePostingFormat(new Date());
        var hiredDate =  APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.HiringDte);
        this.oModel.getData().DataRecord.Tenure = APPui5.days_between(today,hiredDate);
        
        this.oModel.getData().ManDays = [];
        this.oModel.getData().ManDays = APPui5.ExecQuery("getAllSched","Array", CardDetails[0].IDNo,"","","",false);
        
        this.oModel.getData().Addbutton.Name= "Update";
        this.oModel.getData().Addbutton.Icon= "sap-icon://save";

        this.oModel.refresh();
    },


    handleValueFindApprover: function (oEvent) {
      var Postion = this.oModel.getData().DataRecord.UserType;
      var selectecPos = "Supervisor";
      if(Postion === "Employee"){
        selectecPos = "Supervisor";
      }else if(Postion === "Supervisor"){
        selectecPos = "Manager";
      }

      Fragment.load({
        name: "WEBAP.RFID.view.fragments.Approver",
        controller: this
      }).then(function (oValueHelpDialogAPR) {
        this._oValueHelpDialogAPR = oValueHelpDialogAPR;
        this.getView().addDependent(this._oValueHelpDialogAPR);
        this.oModel.getData().AllApprover = APPui5.ExecQuery("Approvers","Array",selectecPos,"","","",false);
        this.oModel.refresh();
        this._oValueHelpDialogAPR.open();
      }.bind(this));
    },

    handleSearchApprover: function (oEvent) {
      var sValue = oEvent.getParameter("value");

      var oFilter = new Filter([
        new Filter("IDNo", FilterOperator.Contains, sValue),
        new Filter("SurName", FilterOperator.Contains, sValue),
        new Filter("FirstName", FilterOperator.Contains, sValue)
      ], false);

      var oBinding = oEvent.getSource().getBinding("items");
      oBinding.filter(oFilter);
    },

    handleValueCloseApprover: function (oEvent) {
      var aContexts = oEvent.getParameter("selectedContexts");
      var CardDetails = {};
      if (aContexts && aContexts.length) {
        CardDetails = aContexts.map(function (oContext) {
          var oCard = {};
          oCard.IDNo = oContext.getObject().IDNo;
          return oCard;
        });
      }
        oEvent.getSource().getBinding("items").filter([]);
        this.oModel.getData().DataRecord.Approver = CardDetails[0].IDNo;
        this.getView().byId("inptPIN").setValueState(sap.ui.core.ValueState.None);
        this.oModel.refresh();
    },

    onPostBefore: function(){
      if(this.getView().byId("inptCivilStatus").getSelectedKey() === ""){
        this.getView().byId("inptCivilStatus").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptFirstName").getValue() === ""){
        this.getView().byId("inptFirstName").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptBirthDte").getValue() === ""){
        this.getView().byId("inptBirthDte").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptSurname").getValue() === ""){
        this.getView().byId("inptSurname").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptGender").getSelectedKey() === ""){
        this.getView().byId("inptGender").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptContactNo").getValue() === ""){
        this.getView().byId("inptContactNo").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptContactEmergencyName").getValue() === ""){
        this.getView().byId("inptContactEmergencyName").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptContactEmergencyNo").getValue() === ""){
        this.getView().byId("inptContactEmergencyNo").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptHiredDte").getValue() === ""){
        this.getView().byId("inptHiredDte").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.oModel.getData().DataRecord.Tenure < 0){
        this.getView().byId("inptHiredDte").setValueState(sap.ui.core.ValueState.Error);
        MessageBox.error("Date hired should be today or less then today");
        return;
      }

      if(this.getView().byId("inptPosition").getValue() === ""){
        this.getView().byId("inptPosition").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptWorkHours").getValue() === ""){
        this.getView().byId("inptWorkHours").setValueState(sap.ui.core.ValueState.Error);
        return;
      }
      

      if(this.getView().byId("inptTenure").getValue() === ""){
        this.getView().byId("inptTenure").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptBasicPay").getValue() === "" || this.getView().byId("inptBasicPay").getValue() === 0){
        this.getView().byId("inptBasicPay").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptSSS").getValue() === ""){
        this.getView().byId("inptSSS").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptPhilhealth").getValue() === ""){
        this.getView().byId("inptPhilhealth").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptPagibig").getValue() === ""){
        this.getView().byId("inptPagibig").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptLoanBalance").getValue() === ""){
        this.getView().byId("inptLoanBalance").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptPIN").getValue() === "" && this.oModel.getData().DataRecord.UserType !=="Manager"){
        this.getView().byId("inptPIN").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptUserType").getSelectedKey() === ""){
        this.getView().byId("inptUserType").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

      if(this.getView().byId("inptEmail").getValue() === ""){
        this.getView().byId("inptEmail").setValueState(sap.ui.core.ValueState.Error);
        return;
      }

        var email = this.getView().byId("inptEmail").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (!mailregex.test(email)) {
            MessageBox.error(email + " is not a valid email address");
            this.getView().byId("inptEmail").setValueState(sap.ui.core.ValueState.Error);
            return;
        } 



      var osched = 0;
      var isWrongDuration = 0;
      var isGreaterThan = 0;
      for(var x = 0; x < this.oModel.getData().ManDays.length;x++){
        if(this.oModel.getData().ManDays[x].totalHour !== 0){
          osched = parseInt(osched) + 1;
        }

        if(this.oModel.getData().ManDays[x].totalHour < 0){
          isWrongDuration = parseInt(isWrongDuration) + 1;
        }
        
        if(parseInt(this.oModel.getData().ManDays[x].totalHour) < 4 && parseInt(this.oModel.getData().ManDays[x].totalHour) !== 0){
          isGreaterThan = parseInt(isGreaterThan) + 1;
        }

      }
      
      if(osched === 0){
        MessageBox.error("Please set schedule for atleast 1 day");
        return;
      }

      if(isWrongDuration !== 0){
        MessageBox.error("Time start should be greater than time end");
        return;
      }

      if(isGreaterThan !== 0){
        MessageBox.error("Please set the schedule with equivalent to half day");
        return;
      }
    

      //Final
      if(this.oModel.getData().Addbutton.Name === "Add"){
        this.onPostData();
      }else{
        this.onUpdateData();
      }
     

    },

    onClearFields: function(){
      this.oModel.getData().DataRecord.Surname = "";
      this.oModel.getData().DataRecord.FirstName = "";
      this.oModel.getData().DataRecord.BirthDte = "";
      this.oModel.getData().DataRecord.CivilStatus = "";
      this.oModel.getData().DataRecord.Name = "";
      this.oModel.getData().DataRecord.ContactNo = "";
      this.oModel.getData().DataRecord.ContactEmergencyName = "";
      this.oModel.getData().DataRecord.ContactEmergencyNo = "";
      this.oModel.getData().DataRecord.HiringDte = new Date();
      this.oModel.getData().DataRecord.Position = "";
      this.oModel.getData().DataRecord.WorkHours = 0;
      this.oModel.getData().DataRecord.Tenure = "";
      this.oModel.getData().DataRecord.BasicPay = "";
      this.oModel.getData().DataRecord.SSS = "";
      this.oModel.getData().DataRecord.Philhealth = "";
      this.oModel.getData().DataRecord.Pagibig = "";
      this.oModel.getData().DataRecord.LoanBalance = "";
      this.oModel.getData().DataRecord.PIN = "";
      this.oModel.getData().DataRecord.UserType = "";
      this.oModel.getData().DataRecord.EmailAdd = "";
      
    
      this.loadAllData();
    },

    onPostData: async function(){
      var perH = parseInt(this.oModel.getData().DataRecord.BasicPay) / 30;
      perH = APPui5.onRound(perH) / parseInt(this.oModel.getData().DataRecord.WorkHours);
      var oData = {};
      var oHeader = {};
      oData.OEMP= [];
      oHeader.O = "I";
      oHeader.IDNo = this.oModel.getData().DataRecord.IDNo;
      oHeader.Surname = this.oModel.getData().DataRecord.Surname;
      oHeader.FirstName = this.oModel.getData().DataRecord.FirstName;
      oHeader.BirthDte = APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.BirthDte);
      oHeader.CivilStatus = this.oModel.getData().DataRecord.CivilStatus;
      oHeader.Gender = this.oModel.getData().DataRecord.Gender;
      oHeader.ContactNo = this.oModel.getData().DataRecord.ContactNo;
      oHeader.ContactEmergencyName = this.oModel.getData().DataRecord.ContactEmergencyName;
      oHeader.ContactEmergencyNo = this.oModel.getData().DataRecord.ContactEmergencyNo;
      oHeader.HiringDte = APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.HiringDte);
      oHeader.Position = this.oModel.getData().DataRecord.Position;
      oHeader.WorkHours = this.oModel.getData().DataRecord.WorkHours;
      oHeader.Tenure = this.oModel.getData().DataRecord.Tenure;
      oHeader.BasicPay = this.oModel.getData().DataRecord.BasicPay;
      oHeader.SSS = this.oModel.getData().DataRecord.SSS;
      oHeader.Philhealth = this.oModel.getData().DataRecord.Philhealth;
      oHeader.Pagibig = this.oModel.getData().DataRecord.Pagibig;
      oHeader.LoanBalance = this.oModel.getData().DataRecord.LoanBalance;
      oHeader.PIN = "1234";
      if(this.oModel.getData().DataRecord.UserType !== "Manager"){
        oHeader.Approver = this.oModel.getData().DataRecord.Approver;
      }else{
        oHeader.Approver = this.oModel.getData().DataRecord.IDNo;
      }
      oHeader.UserType = this.oModel.getData().DataRecord.UserType;
      oHeader.EmailAdd = this.oModel.getData().DataRecord.EmailAdd;
      oHeader.perHour = perH;
      oData.OEMP.push(oHeader);
      var message = await APPui5.postQuery(oData);
      if(message === 0){
        for(let i = 0; i < this.oModel.getData().ManDays.length; i++){
          var oStatus = "Inactive";
          if(parseInt(this.oModel.getData().ManDays[i].totalHour) !== 0){
            oStatus = "Active";
          }
            oData = {};
            oHeader = {};
            oData.SCHD= [];
            oHeader.O = "I";
            oHeader.IDNo = this.oModel.getData().DataRecord.IDNo;
            oHeader.DayString = this.oModel.getData().ManDays[i].DayString;
            oHeader.Timein = this.oModel.getData().ManDays[i].Timein;
            oHeader.Timeout = this.oModel.getData().ManDays[i].Timeout;
            oHeader.totalHour = this.oModel.getData().ManDays[i].totalHour;
            oHeader.Status = oStatus;
            oData.SCHD.push(oHeader);
            message = await APPui5.postQuery(oData);
        }
      
        if(message === 0){
          MessageBox.success("Data added successfully.");
          this.onClearFields();
        }else{
          MessageBox.error(`${message}. Data not add.`);
        }
      }else{
        MessageBox.error(`${message}. Data not add.`);
      }
    },
    onUpdateData: async function(){
      var perH = parseInt(this.oModel.getData().DataRecord.BasicPay) / 30;
      perH = APPui5.onRound(perH) / parseInt(this.oModel.getData().DataRecord.WorkHours);
      var oData = {};
      var oHeader = {};
      oData.OEMP= [];
      oHeader.O = "U";
      oHeader.Id = this.oModel.getData().DataRecord.Id;
      oHeader.IDNo = this.oModel.getData().DataRecord.IDNo;
      oHeader.Surname = this.oModel.getData().DataRecord.Surname;
      oHeader.FirstName = this.oModel.getData().DataRecord.FirstName;
      oHeader.BirthDte = APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.BirthDte);
      oHeader.CivilStatus = this.oModel.getData().DataRecord.CivilStatus;
      oHeader.Gender = this.oModel.getData().DataRecord.Gender;
      oHeader.ContactNo = this.oModel.getData().DataRecord.ContactNo;
      oHeader.ContactEmergencyName = this.oModel.getData().DataRecord.ContactEmergencyName;
      oHeader.ContactEmergencyNo = this.oModel.getData().DataRecord.ContactEmergencyNo;
      oHeader.HiringDte = APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.HiringDte);
      oHeader.Position = this.oModel.getData().DataRecord.Position;
      oHeader.WorkHours = this.oModel.getData().DataRecord.WorkHours;
      oHeader.Tenure = this.oModel.getData().DataRecord.Tenure;
      oHeader.BasicPay = this.oModel.getData().DataRecord.BasicPay;
      oHeader.SSS = this.oModel.getData().DataRecord.SSS;
      oHeader.Philhealth = this.oModel.getData().DataRecord.Philhealth;
      oHeader.Pagibig = this.oModel.getData().DataRecord.Pagibig;
      oHeader.LoanBalance = this.oModel.getData().DataRecord.LoanBalance;
      oHeader.PIN = "1234";
      if(this.oModel.getData().DataRecord.UserType !== "Manager"){
        oHeader.Approver = this.oModel.getData().DataRecord.Approver;
      }else{
        oHeader.Approver = this.oModel.getData().DataRecord.IDNo;
      }
      oHeader.UserType = this.oModel.getData().DataRecord.UserType;
      oHeader.EmailAdd = this.oModel.getData().DataRecord.EmailAdd;
      oHeader.perHour = perH;

      oData.OEMP.push(oHeader);
      var message = await APPui5.postQuery(oData);
      if(message === 0){
        for(let i = 0; i < this.oModel.getData().ManDays.length; i++){
          var oStatus = "Inactive";
          if(parseInt(this.oModel.getData().ManDays[i].totalHour) !== 0){
            oStatus = "Active";
          }
            oData = {};
            oHeader = {};
            oData.SCHD= [];
            oHeader.O = "U";
            oHeader.Id = this.oModel.getData().ManDays[i].Id;
            oHeader.IDNo = this.oModel.getData().DataRecord.IDNo;
            oHeader.DayString = this.oModel.getData().ManDays[i].DayString;
            oHeader.Timein = this.oModel.getData().ManDays[i].Timein;
            oHeader.Timeout = this.oModel.getData().ManDays[i].Timeout;
            oHeader.totalHour = this.oModel.getData().ManDays[i].totalHour;
            oHeader.Status = oStatus;
            oData.SCHD.push(oHeader);
            message = await APPui5.postQuery(oData);
        }
      
        if(message === 0){
          MessageBox.success("Data saved successfully.");
        }else{
          MessageBox.error(`${message}. Data not saved.`);
        }
      }else{
        MessageBox.error(`${message}. Data not saved.`);
      }
    },

    onChangeState: function(oEvent){
      var sourceControl = (oEvent.getSource()).sId;
      var result = sourceControl.replace("__xmlview1--", "");
      this.getView().byId(result).setValueState(sap.ui.core.ValueState.None);

      if(result === "inptWorkHours"){
        if(this.oModel.getData().DataRecord.WorkHours < 5) {
          this.getView().byId("inptWorkHours").setValueState(sap.ui.core.ValueState.Error);
          MessageBox.error("Please set the schedule with equivalent to half day");
        }

        if(this.oModel.getData().DataRecord.WorkHours > 24) {
          this.getView().byId("inptWorkHours").setValueState(sap.ui.core.ValueState.Error);
          MessageBox.error("Working Hours i 24 hours per day only");
        }
      }

      if(result === "inptHiredDte"){
        var today = APPui5.getDatePostingFormat(new Date());
        var hiredDate =  APPui5.getDatePostingFormat(this.oModel.getData().DataRecord.HiringDte);
        this.oModel.getData().DataRecord.Tenure = APPui5.days_between(today,hiredDate);
        if(this.oModel.getData().DataRecord.Tenure < 0){
          this.getView().byId("inptHiredDte").setValueState(sap.ui.core.ValueState.Error);
          MessageBox.error("Date hired should be today or less then today");
        }
        this.oModel.refresh();
      }

      if(result === "inptEmail"){
        var email = this.getView().byId("inptEmail").getValue();
        var mailregex = /^\w+[\w-+\.]*\@\w+([-\.]\w+)*\.[a-zA-Z]{2,}$/;
        if (!mailregex.test(email)) {
            MessageBox.error(email + " is not a valid email address");
            this.getView().byId("inptEmail").setValueState(sap.ui.core.ValueState.Error);
            return;
        } 
     }

     if(result === "inptWorkHours"){
      this.oModel.getData().DataRecord.WorkHours = APPui5.onRound(this.oModel.getData().DataRecord.WorkHours);
     }

    },

    onComputeTimeSched: function(oEvent){
      if(this.oModel.getData().DataRecord.WorkHours !== 0){
          this.iSelectedRow = oEvent.getSource().getParent().getIndex();
          var start = this.oModel.getData().ManDays[this.iSelectedRow].Timein;
          var end = this.oModel.getData().ManDays[this.iSelectedRow].Timeout;
          
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
        
          // if(parseInt(this.oModel.getData().DataRecord.WorkHours) !== parseInt(duration)){
          //   MessageBox.error("Working Hours declare is not match for this schedule,\n you've entered " + duration + " number of hours");
          //   this.oModel.getData().ManDays[this.iSelectedRow].totalHour = 0;
          //   this.oModel.getData().ManDays[this.iSelectedRow].Timein = "07:00 AM";
          //   this.oModel.getData().ManDays[this.iSelectedRow].Timeout = "07:00 AM";
          // }else{
            this.oModel.getData().ManDays[this.iSelectedRow].totalHour = duration;
          // }
      }else{
        MessageBox.error("Kindly enter working hourse above first");
        this.getView().byId("inptWorkHours").setValueState(sap.ui.core.ValueState.Error);
        this.oModel.getData().ManDays[this.iSelectedRow].totalHour = 0;
        this.oModel.getData().ManDays[this.iSelectedRow].Timein = "07:00 AM";
        this.oModel.getData().ManDays[this.iSelectedRow].Timeout = "07:00 AM";
      }
      this.oModel.refresh();
    },

    resetSchedule: function(){
      this.oModel.getData().ManDays = [];
      this.oModel.getData().ManDays.push(
        {
          "DayString": "Monday",
          "Timein": "07:00 AM",
          "Timeout": "07:00 AM",
          "totalHour": 0
        },
        {
          "DayString": "TuesDay",
          "Timein": "07:00 AM",
          "Timeout": "07:00 AM",
          "totalHour": 0
        },
        {
          "DayString": "Wednesday",
          "Timein": "07:00 AM",
          "Timeout": "07:00 AM",
          "totalHour": 0
        },
        {
          "DayString": "Thursday",
          "Timein": "07:00 AM",
          "Timeout": "07:00 AM",
          "totalHour": 0
        },
        {
          "DayString": "Friday",
          "Timein": "07:00 AM",
          "Timeout": "07:00 AM",
          "totalHour": 0
        },
        {
          "DayString": "Saturday",
          "Timein": "07:00 AM",
          "Timeout": "07:00 AM",
          "totalHour": 0
        },
        {
          "DayString": "Sunday",
          "Timein": "07:00 AM",
          "Timeout": "07:00 AM",
          "totalHour": 0
        }
      )
    },
    

  });
});
