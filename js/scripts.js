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
	
	$('#ConCheck').change(function() {
		if ($(this).prop('checked') == true)
			$('.Contractor').show();
		else
			$('.Contractor').hide();
	});
	
	$('#AppDateStart').datepicker({});
	$('#AppDateEnd').datepicker({});
	$('#WLDate').datepicker({});
});

function HideAll(){
	$('.CreateAccount').hide();
	$('.ModifyAccount').hide();
	$('.CreateReport').hide();
	$('.ModifyReport').hide();
	$('.Applications').hide();
	$('.Weblogic').hide();
	$('.Server').hide();
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