$(document).ready(function(){

	$('#CreateAcct').click(function() {
		HideAll();
		$('.CreateAccount').show();
	});
	
	$('#ModifyAcct').click(function() {
		HideAll();
		$('.ModifyAccount').show();
	});
	
	$('#Offboard').click(function() {
		HideAll();
		$('.Offboard').show();
	});
	
	$('#Application').click(function() {
		HideCreate();
		$('.Applications').show();
	});
	
	$('#Application2').click(function() {
		HideCreate();
		$('.ModApp').show();
	});
	
	$('#Weblogic').click(function() {
		HideCreate();
		$('.Weblogic').show();
	});
	
	$('#Weblogic2').click(function() {
		HideCreate();
		$('.ModifyWeblogic').show();
	});
	
	$('#Server').click(function() {
		HideCreate();
		$('.Server').show();
	});
	
	$('#Server2').click(function() {
		HideCreate();
		$('.ModServer').show();
	});
	
	$('#SVN').click(function() {
		HideCreate();
		$('.SVN').show();
	});
	
	$('#SVN2').click(function() {
		HideCreate();
		$('.ModSVN').show();
	});
	
	$('#AppENV').change(function() {
		SelectApp();
	});
	
	$('#AppENVMod').change(function() {
		SelectAppMod();
	});
	
	$('#RemoveAcct').click(function() {
		HideMods();
		$('.RemAcctDiv').show();
	});
	
	$('#ModifyPerm').click(function() {
		HideMods();
		$('.ModAcctDiv').show();
	});
	
	$('#Other').click(function() {
		HideMods();
		$('.OtherDiv').show();
	});
	
	$('#RemoveAcctWL').click(function() {
		HideWLMod();
		$('#Hidethis1').hide();
	});
	
	$('#ModifyPermWL').click(function() {
		HideWLMod();
		$('.ModPermWL').show();
		$('#Hidethis1').show();
	});
	
	$('#ModOtherWL').click(function() {
		HideWLMod();
		$('.ModOtherWL').show();
		$('#Hidethis1').show();
	});
	
	$('#RemoveAcctServer').click(function() {
		HideWLMod();
		$('#Hidethis2').hide();
	});
	
	$('#ModifyPermServer').click(function() {
		HideWLMod();
		$('.ModPermServ').show()
		$('#Hidethis2').show();
	});
	
	$('#ModOtherServer').click(function() {
		HideWLMod();
		$('.ModPermOther').show()
		$('#Hidethis2').show();
	});
	
	$('#RemoveAcctSVN').click(function() {
		HideWLMod();
		$('#Hidethis3').hide();
	});
	
	$('#ModifyPermSVN').click(function() {
		HideWLMod();
		$('.ModSVNPerm').show();
		$('#Hidethis3').show();
	});
	
	$('#ModOtherSVN').click(function() {
		HideWLMod();
		$('.ModSVNOther').show();
		$('#Hidethis3').show();
	});
	
	$('#ConCheck').change(function() {
		if ($(this).prop('checked') == true)
			$('.Contractor').show();
		else
			$('.Contractor').hide();
	});
	
	$('#AddPerm').change(function() {
		if ($(this).prop('checked') == true)
			$('.AddPerm').show();
		else
			$('.AddPerm').hide();
	});
	
	$('#RemovePerm').change(function() {
		if ($(this).prop('checked') == true)
			$('.RemPerm').show();
		else
			$('.RemPerm').hide();
	});
	
	$('#AppChk').change(function() {
		if ($(this).prop('checked') == true)
			$('#AppChkDiv').show();
		else
			$('#AppChkDiv').hide();
	});
	
	$('#WLChk').change(function() {
		if ($(this).prop('checked') == true)
			$('#WLChkDiv').show();
		else
			$('#WLChkDiv').hide();
	});
	
	$('#ServerChk').change(function() {
		if ($(this).prop('checked') == true)
			$('#ServerChkDiv').show();
		else
			$('#ServerChkDiv').hide();
	});
	
	$('#AppDateStart').datepicker({});
	$('#AppDateEnd').datepicker({});
	$('#WLDate').datepicker({});
	$('#ServerDate').datepicker({});
	$('#OtherEffDate').datepicker({});
	$('#AddPermEffDate').datepicker({});
	$('#SVNDate').datepicker({});
	$('#RemEffDate').datepicker({});
	$('#ServerModDate').datepicker({});
	$('#SVNModDate').datepicker({});
	$('#WLEndDate').datepicker({});
	$('#ServerEndDate').datepicker({});
	$('#SVNEndDate').datepicker({});
	$('#RemEffDateEnd').datepicker({});
	$('#AddPermEffDateEnd').datepicker({});
	$('#RemPermEffDateEnd').datepicker({});
	$('#OtherEffDateEnd').datepicker({});
	$('#WLModDateEnd').datepicker({});
	$('#ServerModDateEnd').datepicker({});
	$('#SVNModDateEnd').datepicker({});
});

function HideWLMod(){
	$('.ModPermWL').hide();
	$('.ModOtherWL').hide();
	$('.ModPermServ').hide();
	$('.ModPermOther').hide();
	$('.ModSVNPerm').hide();
	$('.ModSVNOther').hide();
}

function HideAll(){
	$('.CreateAccount').hide();
	$('.ModifyAccount').hide();
	$('.Applications').hide();
	$('.Weblogic').hide();
	$('.Server').hide();
	$('.ModApp').hide();
	$('.ModifyWeblogic').hide()
	$('.Offboard').hide();
}

function HideCreate(){
	$('.Applications').hide();
	$('.Weblogic').hide();
	$('.Server').hide();
	$('.SVN').hide();
	$('.ModApp').hide();
	$('.ModifyWeblogic').hide();
	$('.ModServer').hide();
	$('.ModSVN').hide();
}

function HideCheck(){
	$('.SelectCCB').hide();
	$('.SelectMWM').hide();
	$('.SelectMDM').hide();
	$('.SelectBCA').hide();
}

function HideCheckMod(){
	$('.SelectCCBMod').hide();
	$('.SelectMWMMod').hide();
	$('.SelectMDMMod').hide();
	$('.SelectBCAMod').hide();
}

function HideMods(){
	$('.RemAcctDiv').hide();
	$('.ModAcctDiv').hide();
	$('.OtherDiv').hide();	
}

function SelectApp(){
	if ($('#AppENV').val() == '1'){
		HideCheck();
		$('.SelectCCB').show();
	}
	else if ($('#AppENV').val() == '2'){
		HideCheck();
		$('.SelectMWM').show();
	}
	else if ($('#AppENV').val() == '3'){
		HideCheck();
		$('.SelectMDM').show();
	}
	else if ($('#AppENV').val() == '4'){
		HideCheck();
		$('.SelectBCA').show();
	}
	else if ($('#AppENV').val() == '0'){
		HideCheck();
	}
}

function SelectAppMod(){
	if ($('#AppENVMod').val() == '1'){
		HideCheckMod();
		$('.SelectCCBMod').show();
	}
	else if ($('#AppENVMod').val() == '2'){
		HideCheckMod();
		$('.SelectMWMMod').show();
	}
	else if ($('#AppENVMod').val() == '3'){
		HideCheckMod();
		$('.SelectMDMMod').show();
	}
	else if ($('#AppENVMod').val() == '4'){
		HideCheckMod();
		$('.SelectBCAMod').show();
	}
	else if ($('#AppENVMod').val() == '0'){
		HideCheckMod();
	}
}