var ajaxProjectUrl = "CFC/ProjectTracker.cfc?", oTable = '', aTable = '', bTable = '', cTable = '', dTable = '', userID, uID, pID, currDate =  new Date();
//var ajaxProjectUrl = "/ProjectTracker/CFC/ProjectTracker.cfc?";
//var oTable = '';
var gridPageLength = 10;
$(document).ready(function() {
	 $.ajaxSetup({ cache: false });	
	 if(readCookie('PTUserID')){
		 
		 //$('#welcome').html("<p>Welcome, " + readCookie('PTUserName') + "<br><a href='javascript:logOut()'>Sign out <span class='drop'></span></a></p>");	
		 //<button id='btnLogOut' class='btn btn-default' type='button' onClick='logOut();' style='float: right;'>Sign out</button>
		 renderProjects();
		 createUserDrawer();	
	 }
	 else {
		 //Send to login screen
		 $('.login').show();
		 $('#empID').focus();
	 }
	 //get division select list
			$.ajax({
				  url:  ajaxProjectUrl + "method=getDivision",
				  type:  "GET",
				  timeout: 100000, //timeout after 10 seconds
				  data:  { },
				  dataType:  'html',
				  success:  function (result){
					  	$("#division").html(result),
						$("#divisionAssigned").html(result) } ,
				  error: function (xhr, textStatus, thrownError){ 
						onAjaxError(xhr, textStatus, thrownError);
						}
				}); 
	//get project status list
			$.ajax({
				  url:  ajaxProjectUrl + "method=getStatus",
				  type:  "GET",
				  timeout: 100000, //timeout after 10 seconds
				  data:  { },
				  dataType:  'html',
				  success:  function (result){
					  	$("#status").html(result) } ,
				  error: function (xhr, textStatus, thrownError){ 
						onAjaxError(xhr, textStatus, thrownError);
						}
				}); 
	//get section assigned list
			/*$.ajax({
				  url:  ajaxProjectUrl + "method=getSection",
				  type:  "GET",
				  timeout: 100000, //timeout after 10 seconds
				  data:  { },
				  dataType:  'html',
				  success:  function (result){
					  	$("#sectionAssigned").html(result) } ,
				  error: function (xhr, textStatus, thrownError){ 
						onAjaxError(xhr, textStatus, thrownError);
						}
				});*/ 						
	//get staff assigned list
			/*$.ajax({
				  url:  ajaxProjectUrl + "method=getStaff",
				  type:  "GET",
				  timeout: 100000, //timeout after 10 seconds
				  data:  { },
				  dataType:  'html',
				  success:  function (result){
					  	$("#staffAssigned").html(result) } ,
				  error: function (xhr, textStatus, thrownError){ 
						onAjaxError(xhr, textStatus, thrownError);
						}
				});*/ 
				
	$("#adminTabs").tabs();	
	/*$('#adminTabs').on('click', 'li', function()
	{
		//$('.staff-detail').hide();
		//renderStaff();
		GenSection();
	});*/								
});

function openTallyPanel(){
	if( $("#TallyPanel").length < 1){
	  panel_tally = $.jsPanel({
		content: function(){
			$(this).load("tally.html");
		},
		id: "TallyPanel",
		position: {
				top: "1px", left: "5px"
			},
		size:     {width: 230, height: 175},
		overflow: {vertical: 'scroll'},
		theme:    "success",
		title:	"Project Status Tally"
	});	
	}
	else{
		panel_tally.normalize();
		}
}

function openAIPanel(){
	if( $("#AIPanel").length < 1){
		panel_AI = $.jsPanel({
		  content: function(){
			  $(this).load("actionItem.html");
		  },
		  id: "AIPanel",
		  position: {
				top:  "1px", left: "240px"
		  },
		  size:     {width: 410, height: 250},
		  overflow: {vertical: 'scroll'},
		  theme:    "success",
		  title:	"CompStat Action Items"
	  });			
	}
	else{
		panel_AI.normalize();
		}
}

function openPlanPanel(){
	if( $("#PlanPanel").length < 1){
		panel_Plan = $.jsPanel({
		  content: function(){
			  $(this).load("ClerkPlan.html");
		  },
		  id: "PlanPanel",
		  position: {
				top:  "1px", right: "385px"
		  },
		  size:     {width: 280, height: 250},
		  overflow: {vertical: 'scroll'},
		  theme:    "success",
		  title:	"City Clerk - 5 Yr. Strategic Plan"
	  });
	}
	else{
		panel_Plan.normalize();	
	}
	
}

function openMMPanel(){
	if( $("#MMPanel").length < 1){
		panel_MM = $.jsPanel({
		  content: function(){
			  $(this).load("MayorMetrics.html");
		  },
		  id: "MMPanel",
		  position: {
				top: "1px", right: "5px"  
		  },
		  size:     {width: 380, height: 250},
		  overflow: {vertical: 'scroll'},
		  theme:    "success",
		  title:	"Mayor Metrics - Priority OutComes"
	  });	
	}
	else{
		panel_MM.normalize();
	}	
}

function openAdmin(){
	$('.all-projects').hide();	
	$('.admin').show();	
	GenUserSection();	
	GenUserSecurity();
	renderUsers();	
	renderArchive();
	renderDeleted();
}

function adminExit(){
	$('.admin').hide();
	//$('.all-projects').show();
	renderProjects();	
		
}
function addProject(){
		$('.all-projects').hide();	
		$('.project-detail').show();
		$('#frmProjectEdit')[0].reset();
		$("#staffAssigned").html("<option value='0'>Unassigned</option>")
		$('#projectID').val('new');
	}

function projectDetailCancel(){
	$('.project-detail').hide();	
	$('.all-projects').show();		
}

$("#frmProjectEdit").submit(function(e){
	e.preventDefault();
	$.ajax({
		  url:  ajaxProjectUrl + "method=projectUpdate",
		  type:  "POST",
		  timeout: 50000, //timeout after 10 seconds
		  data: {
		  		    projectID: $('#projectID').val(),
					projectName: $('#projectName').val(),
					description: $('#description').val(),
					metric: $('#metric').val(),
					status: $('#status').val(),
					deptPriority: $('#deptPriority').val(),
					divPriority: $('#divPriority').val(),
					division: $('#division').val(),
					divisionAssigned: $('#divisionAssigned').val(),
					staffAssigned: $('#staffAssigned').val(),
					strategicArea: $('#strategicArea').val(),
					mayorPriority: $('#mayorPriority').val(),
					councilFile: $('#councilFile').val(),
					startDate: $('#startDate').val(),
					estimateEndDate: $('#estimateEndDate').val(),
					completedDate: $('#completedDate').val(),
					comments: $('#comments').val(),
					divCreator: readCookie('PTDivisionID')

				},
		  dataType:  'json',
		  success:  function (result){
				renderProjects();
				
				 } ,
		  error: function (xhr, textStatus, thrownError){ 
				onAjaxError(xhr, textStatus, thrownError);
				}
		});	
	return false;
});

$( "#frmLogin" ).submit(function( event ) {
  	event.preventDefault();
	//alert( "Handler for .submit() called." );	
	if ( $('#empID').val() == "" || $('#password').val() == ""){
		alert("Please enter a valid employee id and password.");
		return false;
	} 
	$.ajax({
		  url:  ajaxProjectUrl + "method=userLogin",
		  type:  "GET",
		  timeout: 50000, //timeout after 10 seconds
		  data: {
					userid:  $('#empID').val(),
					password:  $('#password').val()
				},
		  dataType:  'json',
		  success:  function (result){
			  if(!result){
				  alert('Invalid Login, Please Try Again.');
			  }
			  else {
				var q = result.DATA;
				if(q.EMPID[0]){
					//$('#welcome').html("Welcome, " + q.FULL_NAME[0] +"<br><button id='btnLogOut' class='btn btn-default' type='button' onClick='logOut();' style='float: right;'>Sign out</button>");
					createCookie('PTUserID', q.EMPID[0], 1);	
					createCookie('PTUserName', q.FULL_NAME[0], 1);
					createCookie('PTDivisionID', q.DIVISIONID, 1);
					createCookie('PTSecurityID', q.SECURITYID, 1);
					renderProjects();
					createUserDrawer();
					//onDataTable();
					}
				else{
					alert('You are not authorize to use this application.');
					}
				
				 }
		  },
		  error: function (xhr, textStatus, thrownError){ 
				onAjaxError(xhr, textStatus, thrownError);
				}
		});	
	return false;	
});

function createUserDrawer(){
	$('#welcome').html("<p>Welcome, " + readCookie('PTUserName') + "<br><a href='javascript:logOut()'>Sign out <span class='drop'></span></a></p>");
}

function renderProjects(){
	
	$.ajax({
				  url:  ajaxProjectUrl + "method=getProjects",
				  type:  "GET",
				  timeout: 100000, //timeout after 10 seconds
				  data:  { empID: readCookie('PTUserID'),
				  		   divisionID: readCookie('PTDivisionID'),
				  		   securityID: readCookie('PTSecurityID')},
				  dataType:  'json',
				  success:  function (result){
					  	
					  	$("table#projectList tbody").empty();
						var q = result.DATA;
						var htmlStr = "";
						var flag = 'none';
						var overDue = '';
		  				for (var i=0; i<result.ROWCOUNT; i++) {
								if (q.STATUS[i] != "Completed"){
									var today = new Date();
									var estimatedED = new Date(q.ESTIMATE_END_DATE[i]);
									var diff =  Math.floor(( Date.parse(estimatedED) - Date.parse(today)) / 86400000);
									if(diff < 1){ flag = 'redflag'; overDue = " <img src='/ProjectTracker/image/overdue.png' title='Project overdue'>"; }
									else if (diff <= 30 && diff >= 1) { flag = 'warningflag'; overDue = " <img src='/ProjectTracker/image/due30.png' title='Project due in " + diff +" days'>";}
									else { flag = 'none'+diff;}										
								}
								htmlStr = htmlStr + "<tr id='" + q.PROJECT_ID[i] + "' aid='"+ q.DIVISION_ASSIGNED[i] +"'>";
								if(q.FOLLOW[i] ==0){htmlStr = htmlStr +"<td class='star'></td>"} else {htmlStr = htmlStr +"<td class='follow'>1</td>"};
								htmlStr = htmlStr + "<td>"+ q.PRIORITY[i] + "</td><td>" + q.PROJECT_NAME[i] + "</td><td>"+ q.STATUS[i]  + "</td><td>"+ q.DIVISIONNAME[i]+ "</td><td>"+ q.ASSIGNED_TO[i] + "</td><td>"+ q.START_DATE[i] + "</td><td class='" + flag + "'>" + q.ESTIMATE_END_DATE[i] + overDue + "</td><td class='txtMore'>" + q.COMMENTS[i]+ "</td><td style='white-space: nowrap'><a class='btn btn-delete btn-danger'>Delete</a>&nbsp;<a class='btn btn-edit btn-primary'> Edit </a></td></tr>";	
								
								flag = 'none';
								overDue = '';
				  			}
							 if ($.fn.DataTable.isDataTable('#projectList')) {		
								oTable.destroy();
								$("table#projectList tbody").empty();
								$("table#projectList tbody").unbind();
							 }	   	
							// Append the new rows to the body								 
		  				     $("table#projectList tbody").append( htmlStr );	
							 $(".txtMore").shorten();							 
							 onDataTable();
							 if( $("#TallyPanel").length >= 1){
								  panel_tally.reloadContent();	
							  }			
						
						 } ,
				  error: function (xhr, textStatus, thrownError){ 
						onAjaxError(xhr, textStatus, thrownError);
						}
				});
				
	$('.all-projects').show();	
	$('.project-detail').hide();
	$('.login').hide();	
	$('.admin').hide();				

	//Delete button in table rows
	/*$('table').on('click','.btn-delete',function() {
		projectID = $(this).closest('tr').attr('id');
		r = confirm('Delete this project? ');
		if(r) {
			$.ajax({
			  url:  ajaxProjectUrl + "method=deleteProject",
			  type:  "GET",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { projectID: projectID	 },		
			  success: function (result){
				  oTable.row($(this).closest('tr'))
				  .remove()
				  .draw();
				  //dtReGen(); 	
				  },			
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
					}
				}); 						
			}
			
	});*/
	//Edit button in table rows
	/*$('table').on('click','.btn-edit',function() {
		projectID = $(this).closest('tr').attr('id');
		divisionAssignedID = $(this).closest('tr').attr('aid');
		if(projectID != null){	
			if($.isNumeric(divisionAssignedID)){populateStaff(divisionAssignedID);}		  
			  setProjectDetailDialog(projectID);
			 $('.all-projects').hide();	
			 $('.project-detail').show();				
		  }
	});	*/

	//remove project from user watch list
	/*$('table').on('click','.follow',function(e) {
		//e.preventDefault();
		projectID = $(this).closest('tr').attr('id');
		$(this).removeClass('follow');
		$(this).addClass('star');
		$(this)[0].innerHTML = '';
		$.ajax({
			  url:  ajaxProjectUrl + "method=removeWatch",
			  type:  "GET",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { empID: readCookie('PTUserID'),
			  		   projectID: projectID	 },					
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
					}
			}); 						
	});*/	
	
	//add project to user watch list
	/*$('table').on('click','.star',function(e) {
		//e.preventDefault();	
		projectID = $(this).closest('tr').attr('id');	
		$(this).removeClass('star');
		$(this).addClass('follow');
		$(this)[0].innerHTML = 1;	
		$.ajax({
			  url:  ajaxProjectUrl + "method=addWatch",
			  type:  "GET",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { empID: readCookie('PTUserID'),
			  		   projectID: projectID	 },
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
					}
			}); 						
	});	*/
$('#startDate').datepicker({});
$('#estimateEndDate').datepicker({});
$('#completedDate').datepicker({});
}

$('#divisionAssigned').change(function(){
	$.ajax({
			url:  ajaxProjectUrl + "method=getStaff",
			type:  "GET",
			timeout: 100000, //timeout after 10 seconds
			data:  { divisionID: $(this).val() },
			dataType:  'html',
			success:  function (result){
				  $("#staffAssigned").html(result) } ,
			error: function (xhr, textStatus, thrownError){ 
				  onAjaxError(xhr, textStatus, thrownError);
				  }
		  });
	
});

function populateStaff(divID){
	$.ajax({
			url:  ajaxProjectUrl + "method=getStaff",
			type:  "GET",
			timeout: 100000, //timeout after 10 seconds
			data:  { divisionID: divID },
			dataType:  'html',
			success:  function (result){
				  $("#staffAssigned").html(result) } ,
			error: function (xhr, textStatus, thrownError){ 
				  onAjaxError(xhr, textStatus, thrownError);
				  }
		  });	
}
	
function onDataTable()
{		 	
	  //oTable.destroy(); 	   	  							   
	  oTable = $('#projectList').DataTable({
		  	  stateSave: true,
			  "order": [1,'asc'],
			  "pageLength": gridPageLength,
			  "columnDefs": [ 
				  {"targets": 'no-sort', "orderable": false },
				  { "type": 'datetime-us-flex', "targets": [6,7] }
				  //,{"targets":7,"visible": false, "searchable": false} 
				  ],
				  language: {
						   "lengthMenu": "Display  _MENU_  projects per page",
						   "info": "Showing  _START_  to  _END_  of  _TOTAL_  projects",
						   "infoFiltered": " (filtered from _MAX_ total projects)"
						   }				
		  }); 
	
	  $('#projectList').dataTable().columnFilter({
			  sPlaceHolder: 'tfoot:before',
			  aoColumns: [ 
				  null,
				  { type: "text", cLabel:"Priority" },
				  { type: "text", cLabel:"Project"},
				  { type: "select", values: ['In Progress', 'In Queue', 'Pending', 'On Hold', 'On Going','Completed'],cLabel:"Status"},
				  { type: "select", values: ['ASD', 'CPS','ELE', 'EXEC', 'NBID', 'RMD', 'SYS'], cLabel:"Division"},
				  { type: "text", cLabel:"Assigned To" },
				  { type: "date-range-from", cLabel:"Start Date" },          
				  { type: "date-range-to", cLabel:"End Date" },
				  { type: "text", cLabel:"Comments" },
				  null]
		  });
	//Delete button in table rows
	$('#projectList tbody').on('click','.btn-delete',function() {		
		projectID = $(this).closest('tr').attr('id');
		r = confirm('Delete this project? ');
		if(r) {
			oTable
				  .row( $(this).parents('tr') )
				  .remove()
				  .draw();
				  
			$.ajax({
			  url:  ajaxProjectUrl + "method=deleteProject",
			  type:  "GET",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { projectID: projectID	 },		
			  success: function (result){
				 
				  },			
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
					}
				});						
			}
			
	});	
	//Edit button in table rows
	$('#projectList tbody').on('click','.btn-edit',function() {
		projectID = $(this).closest('tr').attr('id');
		divisionAssignedID = $(this).closest('tr').attr('aid');
		if(projectID != null){	
			if($.isNumeric(divisionAssignedID)){populateStaff(divisionAssignedID);}		  
			  setProjectDetailDialog(projectID);
			 $('.all-projects').hide();	
			 $('.project-detail').show();				
		  }
	});	
	
	//remove project from user watch list
	$('#projectList tbody').on('click','.follow',function(e) {
		//e.preventDefault();
		projectID = $(this).closest('tr').attr('id');
		$(this).removeClass('follow');
		$(this).addClass('star');
		$(this)[0].innerHTML = '';
		var dt =  new Date().getTime();
		$.ajax({
			  url:  ajaxProjectUrl + "method=removeWatch",
			  type:  "GET",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { empID: readCookie('PTUserID'),
			  		   projectID: projectID	 },					
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
					}
			}); 						
	});	
	
	//add project to user watch list
	$('#projectList tbody').on('click','.star',function(e) {
		//e.preventDefault();	
		projectID = $(this).closest('tr').attr('id');	
		$(this).removeClass('star');
		$(this).addClass('follow');
		$(this)[0].innerHTML = 1;	
		var dt =  new Date().getTime();
		$.ajax({
			  url:  ajaxProjectUrl + "method=addWatch",
			  type:  "GET",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { empID: readCookie('PTUserID'),
			  		   projectID: projectID	 },
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
					}
			}); 						
	});	
	
	$('#projectList tfoot').on('click','.btn-clear',function(e) {
		//renderProjects();	
		//$('.filter_text  input[type="text"]').val('');
		//$('.filter_select').val('');
		//$('.filter_date_range').val('');	

		$(':input').not(":button").val('');
		
		//oTable.destroy();
		//oTable.draw();
		//oTable.columns(1).search('').draw();
		//console.log('reset datatable filter');		
		// Trigger the search while the fields are blank
		$(':input').trigger('keyup'); 
		$('.select_filter').trigger('change'); // Trigger for select elements
	});	
		
	$('#projectList').on( 'length.dt', function ( e, settings, len ) {	
		  gridPageLength =  len;
	  } );		
}

function setProjectDetailDialog(projectID){
	$.ajax({
				url:  ajaxProjectUrl + "method=projectDetail",
				type:  "GET",
				timeout: 300000, //timeout after 30 seconds
				data:  {
					projectID:  projectID
				},
				dataType:  'json',
				success:  function (result){
					if(result.ROWCOUNT == 1){
					  var qProject = result.DATA;  
					  $("#projectName").val(qProject.PROJECT_NAME[0]);
					  $("#description").val(qProject.DESCRIPTION[0]);
					  $("#metric").val(qProject.METRICS[0]);
					  $("#status").val(qProject.STATUS[0]);
					  $("#deptPriority").val(qProject.DEPT_PRIORITY[0]);
					  $("#divPriority").val(qProject.DIVISION_PRIORITY[0]);
					  $("#division").val(qProject.DIVISION[0]);
					  $("#divisionAssigned").val(qProject.DIVISION_ASSIGNED[0]);					  
					  $("#strategicArea").val(qProject.STRATEGIC_AREA[0]);
					  $("#mayorPriority").val(qProject.MAYOR_PRIORITY[0]);
					  $("#councilFile").val(qProject.COUNCIL_FILE[0]);
					  $("#startDate").val(qProject.START_DATE[0]);
					  $("#estimateEndDate").val(qProject.ESTIMATE_END_DATE[0]);
					  $("#completedDate").val(qProject.COMPLETED_DATE[0]);
					  $("#comments").val(qProject.COMMENTS[0]);
					  $("#projectID").val(qProject.PROJECT_ID[0]);
					  window.setTimeout(function(){$("#staffAssigned").val(qProject.STAFF_ASSIGNED[0])},500);
					  
					  var compDate = new Date($('#completedDate').val());
					  
					  if ($('#completedDate').val() == null || $('#completedDate').val() == '')
					  	$('.btn-archive').hide();
					  else if(currDate <= compDate)
						$('.btn-archive').hide();
					  else
						$('.btn-archive').show();
						
					}
				},
				error: function (xhr, textStatus, thrownError){ 
					  onAjaxError(xhr, textStatus, thrownError);
					  }	
	  });	
}

function follow(projectID){alert('follow: '+ projectID);}
function unfollow(projectID){alert('unfollow: '+ projectID);}

/***Staff management start***/
function renderStaff()
{	
	$.ajax({
		url:  ajaxProjectUrl + "method=SMGetStaff",
		type:  "GET",
		timeout: 100000, //timeout after 10 seconds
		data:  {UserDivision: readCookie('PTDivisionID')},
		dataType:  'json',
		success:  function (result){
			$("table#StaffList tbody").empty();
			$("table#StaffList tbody").unbind();
			var staff = "";
			for (var i=0; i< result.ROWCOUNT; i++)
				staff = staff + "<tr id='"+ result.DATA.EMPID[i] +"' nid='" + result.DATA.NAME[i] + "'  sid='" + result.DATA.STAFFID[i] + "'><td>"+result.DATA.EMPID[i]+"</td><td>" + result.DATA.NAME[i] + "</td><td>"+result.DATA.SECTIONNAME[i]+"</td><td style='white-space: nowrap'><a class='btn btn-staffdelete btn-danger'>Delete</a>&nbsp;<a class='btn btn-staffedit btn-primary'> Edit </a></td></tr>";
		
			if ($.fn.DataTable.isDataTable('#StaffList'))
			{
				aTable.destroy();
				$("table#StaffList tbody").empty();
				$("table#StaffList tbody").unbind();
			}
			$('table#StaffList tbody').append(staff);
			onStaffTable();
	
		},
		error: function (xhr, textStatus, thrownError){ 
			var err = eval("(" + xhr.responseText + ")");
			console.log(err.Message);
		}
	});			
}

function setStaffDetails(sID)
{
	$.getJSON(ajaxProjectUrl, { method : 'getStaffDetails', StaffID: sID, returnformat : 'json', queryformat : 'column' },
	function(result) 
	{
		if (result.ROWCOUNT !=0 )
		{
			for (var i=0; i < result.ROWCOUNT; i++)
			{
				$("#StaffName").val(result.DATA.NAME[i]);
				$("#EmployeeID").val(result.DATA.EMPID[i]);	
				$("#SID").val(result.DATA.STAFFID[i])
					 .trigger('change');;
				$("#StaffSection").val(result.DATA.SECTIONID[i]);
			}
		}
	})
}

function onStaffTable()
{	
	aTable = $('#StaffList').DataTable({
		"order": [0,'asc'],	
		"columnDefs": [{"targets": 'no-sort', "orderable": false }],
		language:{
			"lengthMenu": "Display  _MENU_  staff members per page",
			"info": "Showing  _START_  to  _END_  of  _TOTAL_  staff members",
			"infoFiltered": " (filtered from _MAX_ total staff members)"
		}				
	}); 	
}

$(function()
{
	$('table#StaffList').on('click','.btn-staffdelete',function() {
		empID = $(this).closest('tr').attr('id');
		sName = $(this).closest('tr').attr('nid');
		r = confirm('Remove ' + sName + ' from your staff?');
		if(r) {
			aTable
				.row($(this).parents('tr'))
				.remove()
				.draw();
			$.ajax({
				url:  ajaxProjectUrl + "method=SMDelStaff",
				timeout: 100000, //timeout after 10 seconds
				data:  { EID: empID},
				error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
				}
			}); 						
		}
	});
	
	$('table#StaffList').on('click','.btn-staffedit',function() {
		empID = $(this).closest('tr').attr('id');
		sID = $(this).closest('tr').attr('sid');
		
		setStaffDetails(sID);
						
		$('html,body').animate({
        	scrollTop: $(".staff-detail").offset().top},
			'slow');					
	});
	
	$('form').on('click', '.btn-StaffSave', function()
	{
		$.ajax({
		url: ajaxProjectUrl + "method=StaffUpdate",
		type: "GET",
		data:{
			StaffID: $('#SID').val(),
			EmployeeName: $('#StaffName').val(),
			EID: $('#EmployeeID').val(),
			SectionID: $('#StaffSection').val(),
			DivisionID: readCookie('PTDivisionID')},
		datatype: 'json',
		success: function(result){
			$("#SID").val('')
			     .trigger('change');;
			$('#adminLookup').load(renderStaff());},
		});
	});
	
	$('form').on('click', '.btn-StaffCancel', function()
	{
		$("#SID").val('')
			 .trigger('change');
	});
	
	$('#btnAddStaff').on('click', function()
	{
		$("#StaffName").val('');
		$("#EmployeeID").val('');
		$("#SID").val('');
	});		
});

$('#SID').change(function(){
	if($("#SID").val()){
		$("#SMAddEdit").html("<p>Edit Staff Member</p>");
		$("#btnStaffSave").html('Update Staff');
	}
	else {
		$("#SMAddEdit").html("<p>Add Staff Member</p>");
		$("#StaffName").val('');
		$("#EmployeeID").val('');
		$("#btnStaffSave").html('Add Staff');
	}
})

function GenSection()
{	
	$.getJSON(ajaxProjectUrl, { method : 'SMGetSection', UserDivision: readCookie('PTDivisionID'), returnformat : 'json', queryformat : 'column' },
	function(result) 
	{
		if (result.ROWCOUNT !=0 )
		{
			$("#StaffSection").empty();
			for (var i=0; i < result.ROWCOUNT; i++)
				$("#StaffSection").append('<option value="' + result.DATA.SECTIONID[i] + '">' + result.DATA.SECTIONNAME[i] + '</option>');
		}
	})
}
/****Staff Management End***/

/****User Management Start****/
function GenUserSection()
{	
	$.getJSON(ajaxProjectUrl, { method : 'UAGetDivision', returnformat : 'json', queryformat : 'column' },
	function(result) 
	{
		if (result.ROWCOUNT !=0 )
		{
			$("#UserDivision").empty();
			if(readCookie('PTDivisionID') == 6)
			{
				$("#UserDivision").append('<option value="0"></option>');
				for (var i=0; i < result.ROWCOUNT; i++)
					$("#UserDivision").append('<option value="' + result.DATA.DIVISIONID[i] + '">' + result.DATA.DIVISIONNAME[i] + '</option>');
			}
			else
				$("#UserDivision").append('<option value="' + result.DATA.DIVISIONID[(readCookie('PTDivisionID') - 1)] + '">' + result.DATA.DIVISIONNAME[(readCookie('PTDivisionID') - 1)] + '</option>');
		}
	})
}

function GenUserSecurity()
{	
	$.getJSON(ajaxProjectUrl, { method : 'UAGetSecurity', SecurityID: readCookie('PTSecurityID'), returnformat : 'json', queryformat : 'column' },
	function(result) 
	{
		if (result.ROWCOUNT !=0 )
		{
			$("#UserSecurity").empty();
			$("#UserSecurity").append('<option value="0"></option>');
				for (var i=0; i < result.ROWCOUNT; i++)
					$("#UserSecurity").append('<option value="' + result.DATA.SECURITYID[i] + '">' + result.DATA.DESCRIPTION[i] + '</option>');
			
			/*if(readCookie('PTDivisionID') == 6)
			{
				$("#UserSecurity").append('<option value="0"></option>');
				for (var i=0; i < result.ROWCOUNT; i++)
					$("#UserSecurity").append('<option value="' + result.DATA.SECURITYID[i] + '">' + result.DATA.DESCRIPTION[i] + '</option>');
			}
			else
				$("#UserSecurity").append('<option value="' + result.DATA.SECURITYID[2] + '">' + result.DATA.DESCRIPTION[2] + '</option>');*/
		}
	})
}

function setUserDetails(UID)
{
	$.getJSON(ajaxProjectUrl, { method : 'getUserDetails', UID: UID, returnformat : 'json', queryformat : 'column' },
	function(result) 
	{
		if (result.ROWCOUNT !=0 )
		{
			for (var i=0; i < result.ROWCOUNT; i++)
			{
				$("#UserName").val(result.DATA.FULL_NAME[i]);
				$("#UserEID").val(result.DATA.EMPID[i]);	
				$("#UserDivision").val(result.DATA.DIVISIONID[i]);
				$("#UserSecurity").val(result.DATA.SECURITYID[i]);
				$("#UID").val(result.DATA.USERID[i]);
				
				if(result.DATA.STATUS[i])
					$("#UserActive").prop('checked', true);
				else
					$("#UserActive").prop('checked', false);
			}
		}
	})
}

function renderUsers()
{
	$.ajax({
		url:  ajaxProjectUrl + "method=UAGetUsers",
		type:  "GET",
		timeout: 100000, //timeout after 10 seconds
		data:  {UserDivision: readCookie('PTDivisionID'), SecurityID: readCookie('PTSecurityID')},
		dataType:  'json',
		success:  function (result){
			$("table#UserList tbody").empty();
			$("table#UserList tbody").unbind();
			var users = "";
			
			for (var i=0; i< result.ROWCOUNT; i++){
				users = users + "<tr id='"+ result.DATA.USERID[i] + "' eid='"+ result.DATA.EMPID[i] + "' uid='" + result.DATA.FULL_NAME[i] + "'><td>" + result.DATA.EMPID[i] + "</td><td>" + result.DATA.FULL_NAME[i] + "</td><td>" + result.DATA.DIVISIONNAME[i] + "</td><td>" + result.DATA.DESCRIPTION[i] + "</td><td>";





				
				if(result.DATA.STATUS[i])
					users += "Active</td><td style='white-space: nowrap'><a class='btn btn-userdelete btn-danger'>Delete</a>&nbsp;<a class='btn btn-useredit btn-primary'> Edit </a></td></tr>";
				else
					users += "Inactive</td><td style='white-space: nowrap'><a class='btn btn-userdelete btn-danger'>Delete</a>&nbsp;<a class='btn btn-useredit btn-primary'> Edit </a></td></tr>";


			}
			
			if ($.fn.DataTable.isDataTable('#UserList'))
			{
				bTable.destroy();
				$("table#UserList tbody").empty();
				$("table#UserList tbody").unbind();
			}
			
			$('table#UserList tbody').append(users);
			onUserTable();
		},
		error: function (xhr, textStatus, thrownError){ 
			var err = eval("(" + xhr.responseText + ")");
			console.log(err.Message);
		}
	});			
}


function onUserTable()
{		
	bTable = $('#UserList').DataTable({
		"order": [0,'asc'],	
		"columnDefs": [{"targets": 'no-sort', "orderable": false }],
		language:{
			"lengthMenu": "Display  _MENU_  Users per page",
			"info": "Showing  _START_  to  _END_  of  _TOTAL_  Users",
			"infoFiltered": " (filtered from _MAX_ total Users)"
		}				
	}); 	
}

$(function()
{	
	$('table#UserList').on('click','.btn-userdelete',function(){
		uID = $(this).closest('tr').attr('id');
		uName = $(this).closest('tr').attr('uid');
		r = confirm('Remove ' + uName + '?');
		if(r) {
			bTable
				  .row( $(this).parents('tr') )
				  .remove()
				  .draw();
			$.ajax({
			  url:  ajaxProjectUrl + "method=UADelStaff",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { UID: uID},
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
				}
			}); 						
		}
	});

	$('form').on('click', '.btn-UserSave', function()
	{
		$.ajax({
		url: ajaxProjectUrl + "method=UserUpdate",
		type: "GET",
		data:{
			UID: $('#UID').val(),
			Status: $('#UserActive').val(),
			Name: $('#UserName').val(),
			EID: $('#UserEID').val(),
			SecurityID: $('#UserSecurity').val(),
			DivisionID: $('#UserDivision').val()},
		datatype: 'json',
		success: function(result){
			$('#adminUser').load(renderUsers());
			$('#frmUserEdit').trigger('reset');
			$("#btnUserSave").html('Add User');},
		});
	});
	
	$('form').on('click', '.btn-UserCancel', function()
	{
		$('#frmUserEdit').trigger('reset');
		$("#btnUserSave").html('Add User');
	});
	
	$('table#UserList').on('click','.btn-useredit',function() {
		userID = $(this).closest('tr').attr('id');
		setUserDetails(userID);
		
		$("#btnUserSave").html('Update User');
						
		$('html,body').animate({
        	scrollTop: $(".user-detail").offset().top},
        'slow');			
	});
	
	$('#UserActive').on('click', function()
	{
		if($('#UserActive').is(':checked'))
			$('#UserActive').val('1')
		else
			$('#UserActive').val('0')
	});
});
/****User Management End****/

/****Archive Start****/
function renderArchive(){
	$.ajax({
		  url:  ajaxProjectUrl + "method=getArchive",
		  type:  "GET",
		  timeout: 100000, //timeout after 10 seconds
		  data:  { empID: readCookie('PTUserID'),
				   divisionID: readCookie('PTDivisionID'),
				   securityID: readCookie('PTSecurityID')},
		  dataType:  'json',
		  success:  function (result){
				
				//$("table#ArchiveList tbody").empty();
				var q = result.DATA;
				var htmlStr = "";
				var flag = 'none';
				var overDue = '';
				for (var i=0; i<result.ROWCOUNT; i++) {
					  htmlStr = htmlStr + "<tr id='" + q.PROJECT_ID[i] + "' aid='"+ q.DIVISION_ASSIGNED[i] +"'>";
					  htmlStr = htmlStr + "<td>"+ q.PRIORITY[i] + "</td><td>" + q.PROJECT_NAME[i] + "</td><td>"+ q.STATUS[i]  + "</td><td>"+ q.DIVISIONNAME[i]+ "</td><td>"+ q.ASSIGNED_TO[i] + "</td><td>"+ q.START_DATE[i] + "</td><td>" + q.ESTIMATE_END_DATE[i] + "</td><td>" + q.COMPLETED_DATE[i] + "</td><td class='arcMore'>" + q.COMMENTS[i]+ "</td></tr>";	
					}
					 if ($.fn.DataTable.isDataTable('#ArchiveList')) {		
						cTable.destroy();
						$("table#ArchiveList tbody").empty();
						$("table#ArchiveList tbody").unbind();
					 }	   	
					// Append the new rows to the body								 
					 $("table#ArchiveList tbody").append( htmlStr );	
					 $(".arcMore").shorten();							 
					 onArchiveTable();				
				 } ,
		  error: function (xhr, textStatus, thrownError){ 
				onAjaxError(xhr, textStatus, thrownError);
				}
		});
}

function onArchiveTable()
{		 	   	  							   
	cTable = $('#ArchiveList').DataTable({
		"order": [0,'asc'],
		"pageLength": gridPageLength,
		"columnDefs": [ 
			{"targets": 'no-sort', "orderable": false },
			{ "type": 'datetime-us-flex', "targets": [6,7] }
			//,{"targets":7,"visible": false, "searchable": false} 
			],
			language: {
				"lengthMenu": "Display  _MENU_  projects per page",
				"info": "Showing  _START_  to  _END_  of  _TOTAL_  projects",
				"infoFiltered": " (filtered from _MAX_ total projects)"
			}				
	}); 
}

$(function(){
	$('#btnArchive').on('click', function(){		
	projectID = $('#projectID').val();
	r = confirm('Archive this project?');
	if(r) {			  
		$.ajax({
		  url:  ajaxProjectUrl + "method=Archive",
		  type:  "GET",
		  timeout: 100000, //timeout after 10 seconds
		  data:  { PID: projectID },		
		  success: function (result){
				renderProjects();
			  },			
		  error: function (xhr, textStatus, thrownError){ 
				onAjaxError(xhr, textStatus, thrownError);
				}
			});						
		}
	});	
});

/****Archive End****/

/****Delete Start****/
function renderDeleted(){
	$.ajax({
		  url:  ajaxProjectUrl + "method=getDeleted",
		  type:  "GET",
		  timeout: 100000, //timeout after 10 seconds
		  data:  { empID: readCookie('PTUserID'),
				   divisionID: readCookie('PTDivisionID'),
				   securityID: readCookie('PTSecurityID')},
		  dataType:  'json',
		  success:  function (result){
				var q = result.DATA;
				var htmlStr = "";
				var flag = 'none';
				var overDue = '';
				for (var i=0; i<result.ROWCOUNT; i++) {
					  htmlStr = htmlStr + "<tr id='" + q.PROJECT_ID[i] + "' aid='"+ q.DIVISION_ASSIGNED[i] +"'>";
					  htmlStr = htmlStr + "<td>" + q.PROJECT_NAME[i] + "</td><td>"+ q.STATUS[i]  + "</td><td>"+ q.DIVISIONNAME[i]+ "</td><td>"+ q.ASSIGNED_TO[i] + "</td><td>"+ q.START_DATE[i] + "</td><td>" + q.ESTIMATE_END_DATE[i] + "</td><td class='delMore'>" + q.COMMENTS[i]+ "</td><td style='white-space: nowrap'><a class='btn btn-restore btn-danger'>Restore</a></td></tr>";	
					}
					 if ($.fn.DataTable.isDataTable('#DeleteList')) {		
						dTable.destroy();
						$("table#DeleteList tbody").empty();
						$("table#DeleteList tbody").unbind();
					 }	   	
					// Append the new rows to the body								 
					 $("table#DeleteList tbody").append( htmlStr );	
					 $(".delMore").shorten();							 
					 onDeleteTable();				
				 } ,
		  error: function (xhr, textStatus, thrownError){ 
				onAjaxError(xhr, textStatus, thrownError);
				}
		});
}

function onDeleteTable()
{		 	   	  							   
	dTable = $('#DeleteList').DataTable({
		"order": [0,'asc'],
		"pageLength": gridPageLength,
		"columnDefs": [ 
			{"targets": 'no-sort', "orderable": false },
			{ "type": 'datetime-us-flex', "targets": [5,6]}],
			language: {
				"lengthMenu": "Display  _MENU_  projects per page",
				"info": "Showing  _START_  to  _END_  of  _TOTAL_  projects",
				"infoFiltered": " (filtered from _MAX_ total projects)"
			}				
	}); 
	
	$('#DeleteList tbody').on('click','.btn-restore',function() {		
		projectID = $(this).closest('tr').attr('id');
		r = confirm('Restore this project? ');
		if(r) {
			dTable
				  .row( $(this).parents('tr') )
				  .remove()
				  .draw();
				  
			$.ajax({
			  url:  ajaxProjectUrl + "method=restoreProject",
			  type:  "GET",
			  timeout: 100000, //timeout after 10 seconds
			  data:  { projectID: projectID	 },		
			  success: function (result){
				  },			
			  error: function (xhr, textStatus, thrownError){ 
					onAjaxError(xhr, textStatus, thrownError);
					}
				});						
			}
			
	});	
}
/****Delete End****/

function logOut(){
	$('#welcome').empty();
	eraseCookie('PTUserID');	
	eraseCookie('PTUserName');
	eraseCookie('PTDivisionID');
	eraseCookie('PTSecurityID');
	$('.all-projects').hide();
	$('.project-detail').hide();
	$('.admin').hide();
	$('.login').show();
}

function onAjaxError(xhr, textStatus, thrownError) {
		//$.mobile.loading("hide");
		var errorMsg = '';
		if (xhr.status === 0) {
                errorMsg = 'There was a problem connecting to the internet. Please check your mobile data or WIFI connection and try again.';
            }
		else{	
				errorMsg = 'There is currently a problem with the application. Please check back soon.';
				/* call sendMail  */
				alert(xhr.status, thrownError, textStatus);
		}
		alert(errorMsg);
		//$('#dialogText').html(errorMsg); 
        //$.mobile.changePage("#ErrorDialog");
	  }	

function createCookie(name,value,days) {
    if (days) {
        var date = new Date();
        date.setTime(date.getTime()+(days*24*60*60*1000));
        var expires = "; expires="+date.toGMTString();
    }
    else var expires = "";
    document.cookie = name+"="+value+expires+"; path=/";
}

function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

function eraseCookie(name) {
    createCookie(name,"",-1);
}