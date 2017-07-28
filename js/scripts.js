$(document).ready(function(){

	$('#CreateAcct').click(function() {
		HideAll();
		$('.CreateAccount').show();
	});
	
	$('#ModifyAcct').click(function() {
		HideAll();
		$('.ModifyAccount').show();
	});
	
	$('#CreateRpt').click(function() {
		HideAll();
		$('.CreateReport').show();
	});
	
	$('#ModifyRpt').click(function() {
		HideAll();
		$('.ModifyReport').show();
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
	
	$('#Server').click(function() {
		HideCreate();
		$('.Server').show();
	});
	
	$('#AppENV').change(function() {
		SelectApp();
	});
	
	$('#AppENVMod').change(function() {
		SelectAppMod();
	});
	
	$('#RemoveAcct').click(function() {
		HideMods();
		$('#RemAcctDiv').show();
	});
	
	$('#ModifyPerm').click(function() {
		HideMods();
		$('#ModAcctDiv').show();
	});
	
	$('#Other').click(function() {
		HideMods();
		$('#OtherDiv').show();
	});
	
	$('#ModifyPerm').click(function() {
	});
	
	$('#Other').click(function() {
	});
	
	$('#ConCheck').change(function() {
		if ($(this).prop('checked') == true)
			$('.Contractor').show();
		else
			$('.Contractor').hide();
	});
	
	$('#AppDateStart').datepicker({});
	$('#AppDateEnd').datepicker({});
	$('#WLDate').datepicker({});
	$('#RemEffDate').datepicker({});
});

function HideAll(){
	$('.CreateAccount').hide();
	$('.ModifyAccount').hide();
	$('.CreateReport').hide();
	$('.ModifyReport').hide();
	$('.Applications').hide();
	$('.Weblogic').hide();
	$('.Server').hide();
	$('.ModApp').hide();
}

function HideCreate(){
	$('.Applications').hide();
	$('.Weblogic').hide();
	$('.Server').hide();
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
	$('.RemAcctDiv').show();
	$('.ModAcctDiv').show();
	$('.OtherDiv').show();	
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