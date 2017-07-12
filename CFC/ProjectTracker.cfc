<cfcomponent persistent="true" output="no">

	<cfset init()/>    
    <cffunction name="init" access="private" output="no">
    	<cfset variables.PTDSN = "ProjectTracker"/>
		<cfset loadAppVar()/>  
     </cffunction>
    
    <cffunction name="userLogin" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfargument name="userid" type="string" required="yes"/>
        <cfargument name="password" type="string" required="yes"/>
        <cfparam name="loginVal" default="false">
        <cftry> 
           <!---<cfldap action="QUERY"          
                   name="auth"          
                   attributes="samAccountName"          
                   start="DC=cityclerk,DC=local"          
                   scope="SUBTREE"          
                   maxrows="1"          
                   server="14clerkdc1.cityclerk.local"          
                   username="cityclerk\#arguments.userid#"          
                   password="#arguments.password#">--->
            <cfset loginVal= true>
            <!---Allow admin, exec., div. chief and asst. div. chief to login in--->
            <cfquery name="qryUser" datasource="#variables.PTDSN#">
            	Select EmpID, full_name, DivisionID, SecurityID
                From Users
                Where EmpID = <cfqueryparam value="#arguments.userid#" cfsqltype="cf_sql_varchar"> 
                AND SecurityID IN (1,2,3,4)
                AND Status = 1
            </cfquery> 
            <cfreturn serializeJson(qryUser,true)>
            <!---<cfif qryUser.recordcount> 
            	<cfset qryUser.loginVal = loginVal>
            	    
            <cfelse>
            	<cfset loginVal = false>
            </cfif>  --->            
        <cfcatch>
           <cfset loginVal = false>           
        </cfcatch>    
        </cftry>
        <cfreturn serializeJson(loginVal,true)>
    </cffunction>    
   
	<cffunction name="getProjects" access="remote" returntype="string" output="false"  returnformat="plain">
        <cfargument name="empID" type="string" required="yes"/>
        <cfargument name="divisionID" type="string" required="yes"/>
        <cfargument name="securityID" type="numeric" required="yes"/>
        
        <cfquery name="qryProjects" datasource="#variables.PTDSN#">
        	select p.project_id, p.project_name, p.description, ps.status, p.start_date as startdt, CONVERT(VARCHAR(10), p.start_date,101) start_date, p.estimate_end_date as enddt, 
            ISNULL(CONVERT(VARCHAR(10), p.estimate_end_date,101),'') estimate_end_date, <cfif arguments.securityID eq 2>p.dept_priority<cfelse>p.division_priority</cfif> as priority, 
            isnull(d.DivisionName,'') as divisionname, isnull(ds.full_name,'Unassigned') as Assigned_To, p.Division_Assigned, p.division, isnull(p.comments, '') as comments, isnull(u.follow,0) follow
            from project p left join Project_Status ps on (p.Status = ps.PStatusID)
            left join Division d on (p.division = d.DivisionID)
            left join Users ds on (p.staff_assigned = ds.EmpID)
            <!---left join DivisionStaff ds on (p.staff_assigned = ds.empID)--->
            left join 
				(select distinct project_id, empid as follow
				 from UserWatchList  where EmpID =  <cfqueryparam value="#arguments.empID#" cfsqltype="cf_sql_varchar"/>) u ON (u.project_id = p.Project_ID)
            where p.archive != 1 AND p.deleted != 1
            <cfif arguments.securityID gt 2> and (p.div_Creator = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or p.division_Assigned = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or p.division = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer">)</cfif>
        </cfquery>
        
        <cfreturn serializeJson(qryProjects,true)>
    </cffunction>
    	
    <cffunction name="projectDetail" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfargument name="projectID" type="numeric" required="yes"/>
        
        <cfquery name="qryProjectDetail" datasource="#variables.PTDSN#">
        	select project_id, project_name, description, metrics, status, CONVERT(VARCHAR(10), start_date,101) start_date, CONVERT(VARCHAR(10), estimate_end_date,101) estimate_end_date, CONVERT(VARCHAR(10), 		
            completed_date,101) completed_date, dept_priority, division_priority, division_assigned, isnull(staff_assigned,0) as staff_assigned, division, strategic_area, mayor_priority, council_file, isnull(comments, '') as comments
            from project
            where project_id = <cfqueryparam value="#arguments.projectID#" cfsqltype="cf_sql_integer"/>
        </cfquery>
        
        <cfreturn serializeJson(qryProjectDetail,true)>
    </cffunction>
    
    <cffunction name="projectUpdate" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfargument name="projectID" type="string" required="yes" default="New"/>
        <cfargument name="projectName" type="string" required="yes"/>
		<cfargument name="description" type="string" required="yes"/>
        <cfargument name="metric" type="string" required="yes"/>
        <cfargument name="status" type="numeric" required="yes"/>
        <cfargument name="deptPriority" type="string" required="yes"/>
        <cfargument name="divPriority" type="string" required="yes"/>
        <cfargument name="division" type="numeric" required="yes"/>
        <cfargument name="divCreator" type="numeric" required="yes"/>
        <cfargument name="divisionAssigned" type="numeric" required="no" default="0"/>
        <cfargument name="staffAssigned" type="string" required="yes"/>
        <cfargument name="strategicArea" type="string" required="yes"/>
        <cfargument name="mayorPriority" type="string" required="yes"/>
        <cfargument name="councilFile" type="string" required="yes"/>
        <cfargument name="startDate" type="string" required="no"/>
        <cfargument name="estimateEndDate" type="string" required="no"/>
        <cfargument name="completedDate" type="string" required="no" default="NULL"/>
        <cfargument name="comments" type="string" required="no" default=""/>
        <cfif arguments.status eq 5>
        	<cfset arguments.deptPriority = 99>
            <cfset arguments.divPriority = 99>
            <cfif !isDate(arguments.completedDate)>
        		<cfset dtNow = Now() />
            	<cfset arguments.completedDate = CreateDate( Year( dtNow ), Month( dtNow ), Day( dtNow ) ) />
            </cfif>
        </cfif>        
        <cfif isnumeric(arguments.projectID)>
            <cfquery name="qryProjectUpdate" datasource="#variables.PTDSN#">
                Update Project 
                SET Project_Name = <cfqueryparam value="#arguments.projectName#" cfsqltype="cf_sql_varchar"/>,
                	Description = <cfqueryparam value="#arguments.description#" cfsqltype="cf_sql_varchar"/>,
                    Status = <cfqueryparam value="#arguments.status#" cfsqltype="cf_sql_integer"/>,
                    Dept_Priority = <cfqueryparam value="#arguments.deptPriority#" cfsqltype="cf_sql_varchar"/>,
                    Division_Priority = <cfqueryparam value="#arguments.divPriority#" cfsqltype="cf_sql_varchar"/>,
                    Strategic_Area = <cfqueryparam value="#arguments.strategicArea#" cfsqltype="cf_sql_varchar"/>,
                    Mayor_Priority = <cfqueryparam value="#arguments.mayorPriority#" cfsqltype="cf_sql_varchar"/>,
                    Council_File = <cfqueryparam value="#arguments.councilFile#" cfsqltype="cf_sql_varchar"/>,
                    Division_Assigned = <cfqueryparam value="#arguments.divisionAssigned#" cfsqltype="cf_sql_integer"/>,
                    Staff_Assigned = <cfqueryparam value="#arguments.staffAssigned#" cfsqltype="cf_sql_varchar"/>,
                    Division = <cfqueryparam value="#arguments.division#" cfsqltype="cf_sql_integer"/>,
                    Comments = <cfqueryparam value="#arguments.comments#" cfsqltype="cf_sql_varchar"/>,
                    Start_Date = <cfif isDate(arguments.startDate)><cfqueryparam value="#arguments.startDate#" cfsqltype="cf_sql_date"/><cfelse>NULL</cfif>,
                    Estimate_End_Date = <cfif isDate(arguments.estimateEndDate)><cfqueryparam value="#arguments.estimateEndDate#" cfsqltype="cf_sql_date"/><cfelse>NULL</cfif>,
                    Completed_Date = <cfif isDate(arguments.completedDate)><cfqueryparam value="#arguments.completedDate#" cfsqltype="cf_sql_date"/><cfelse>NULL</cfif>
                WHERE project_id = <cfqueryparam value="#arguments.projectID#" cfsqltype="cf_sql_integer"/>
            </cfquery>        
        <cfelse>
        	 <cfquery name="qryProjectAdd" datasource="#variables.PTDSN#">
                INSERT INTO PROJECT
                (Project_Name, Description, Status, Dept_Priority, Division_Priority, Strategic_Area, Mayor_Priority, Council_File, 
                 Division_Assigned, Staff_Assigned, Division, Div_Creator,Comments, Start_Date, Estimate_End_Date, Completed_Date)
                VALUES
                (<cfqueryparam value="#arguments.projectName#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.description#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.status#" cfsqltype="cf_sql_integer"/>,
                 <cfqueryparam value="#arguments.deptPriority#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.divPriority#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.strategicArea#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.mayorPriority#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.councilFile#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.divisionAssigned#" cfsqltype="cf_sql_integer"/>,
                 <cfqueryparam value="#arguments.staffAssigned#" cfsqltype="cf_sql_varchar"/>,
                 <cfqueryparam value="#arguments.division#" cfsqltype="cf_sql_integer"/>,
                 <cfqueryparam value="#arguments.divCreator#" cfsqltype="cf_sql_integer"/>,
                 <cfqueryparam value="#arguments.comments#" cfsqltype="cf_sql_varchar"/>,
                 <cfif isDate(arguments.startDate)><cfqueryparam value="#arguments.startDate#" cfsqltype="cf_sql_date"/><cfelse>NULL</cfif>,
                 <cfif isDate(arguments.estimateEndDate)><cfqueryparam value="#arguments.estimateEndDate#" cfsqltype="cf_sql_date"/><cfelse>NULL</cfif>,
                 <cfif isDate(arguments.completedDate)><cfqueryparam value="#arguments.completedDate#" cfsqltype="cf_sql_date"/><cfelse>NULL</cfif>)   
              </cfquery>        
        </cfif>        
        
        <cfreturn true>
    </cffunction>
    
     <cffunction name="deleteProject" access="remote" returntype="void" output="false">
    	<cfargument name="projectID" type="numeric" required="yes"/>
        
        <cfquery datasource="#variables.PTDSN#">
        	UPDATE Project
            SET Deleted = 1
            where project_id = <cfqueryparam value="#arguments.projectID#" cfsqltype="cf_sql_integer"/>
        </cfquery>
    </cffunction>
    
    <cffunction name="getActionItem" access="remote" returntype="string" output="false"  returnformat="plain">
        
        <cfquery name="qryAI" datasource="#variables.PTDSN#">
        	Select ActionItem From Panel
        </cfquery>
        <cfreturn serializeJson(qryAI,true)>
    </cffunction>
    
    <cffunction name="updateActionItem" access="remote" returntype="void" output="false">
    	<cfargument name="actionItem" type="string" required="yes"/>
        
        <cfquery datasource="#variables.PTDSN#">
        	Update Panel
      		Set ActionItem =<cfqueryparam value="#arguments.actionItem#" cfsqltype="cf_sql_varchar"/>
        </cfquery>
    </cffunction>
    
    <cffunction name="getStrategicPlan" access="remote" returntype="string" output="false"  returnformat="plain">
        
        <cfquery name="qrySP" datasource="#variables.PTDSN#">
        	Select StrategicPlan From Panel
        </cfquery>
        <cfreturn serializeJson(qrySP,true)>
    </cffunction>
    
    <cffunction name="updateStrategicPlan" access="remote" returntype="void" output="false">
    	<cfargument name="plan" type="string" required="yes"/>
        
        <cfquery datasource="#variables.PTDSN#">
        	Update Panel
      		Set StrategicPlan =<cfqueryparam value="#arguments.plan#" cfsqltype="cf_sql_varchar"/>
        </cfquery>
    </cffunction>
    
    <cffunction name="getMayorMetrics" access="remote" returntype="string" output="false"  returnformat="plain">
        
        <cfquery name="qryMM" datasource="#variables.PTDSN#">
        	Select MayorMetrics From Panel
        </cfquery>
        <cfreturn serializeJson(qryMM,true)>
    </cffunction>
    
    <cffunction name="updateMayorMetrics" access="remote" returntype="void" output="false">
    	<cfargument name="metrics" type="string" required="yes"/>
        
        <cfquery datasource="#variables.PTDSN#">
        	Update Panel
      		Set MayorMetrics =<cfqueryparam value="#arguments.metrics#" cfsqltype="cf_sql_varchar"/>
        </cfquery>
    </cffunction>
    
    <cffunction name="addWatch" access="remote" returntype="void" output="false">
    	<cfargument name="empID" type="string" required="yes"/>
    	<cfargument name="projectID" type="numeric" required="yes"/>
        
        <cfquery datasource="#variables.PTDSN#">
        	Insert Into UserWatchList(EmpID, Project_ID) values (<cfqueryparam value="#arguments.empID#" cfsqltype="cf_sql_varchar"/>,<cfqueryparam value="#arguments.projectID#" cfsqltype="cf_sql_integer"/>)
        </cfquery>
    </cffunction>
    
    <cffunction name="removeWatch" access="remote" returntype="void" output="false">
    	<cfargument name="empID" type="string" required="yes"/>
    	<cfargument name="projectID" type="numeric" required="yes"/>
        
        <cfquery datasource="#variables.PTDSN#">
        	Delete From UserWatchList
            WHERE empID = <cfqueryparam value="#arguments.empID#" cfsqltype="cf_sql_varchar"/>
            AND project_ID = <cfqueryparam value="#arguments.projectID#" cfsqltype="cf_sql_integer"/>
        </cfquery>
    </cffunction>
       
    <cffunction name="getStatusCount" access="remote" returntype="string" output="false"  returnformat="plain">
        <cfargument name="divisionID" type="string" required="yes"/>
        <cfargument name="securityID" type="numeric" required="yes"/>			
			
    	<cfquery name="qryStatusCount" datasource="#variables.PTDSN#">
        	SELECT PS.PStatusID, PS.Status, PS.ColorCode,  Count(P.Status) as StatusCount
            FROM Project P left join Project_Status PS on (P.Status = PS.PStatusID)
			left join Division d on (p.division = d.DivisionID)			
			WHERE PS.Status is not null
			AND P.deleted != 1
			<cfif arguments.securityID gt 2> and (P.div_Creator = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or P.division_Assigned = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or P.division = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer">)</cfif>
            Group By PS.Status, PS.PStatusID, PS.ColorCode
            Order By PS.PStatusID
        </cfquery>
        <cfreturn serializeJson(qryStatusCount,true)>
    </cffunction>  
    
    <cffunction name="getDivision" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfquery name="qryDivision" datasource="#variables.PTDSN#">
			select divisionid, divisionname
            from division
            order by divisionid
        </cfquery>
        <cfset myResult="">
        <cfset myResult = myResult & "<option value='0'></option>">
        <cfloop query="qryDivision">
			<cfset myResult = myResult & "<option value='" & divisionid & "'>" & divisionname & "</option>">
        </cfloop>
		<cfreturn myResult>
    </cffunction>  
    
    <cffunction name="getStatus" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfquery name="qryStatus" datasource="#variables.PTDSN#">
			select pstatusid, status
            from project_status
            order by pstatusid asc
        </cfquery>
        <cfset myResult="">
        <cfset myResult = myResult & "<option value='0'></option>">
        <cfloop query="qryStatus">
			<cfset myResult = myResult & "<option value='" & pstatusid & "'>" & status & "</option>">
        </cfloop>
		<cfreturn myResult>
    </cffunction>  
    
    <cffunction name="getSection" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfquery name="qrySection" datasource="#variables.PTDSN#">
			select sectionid, sectionname
            from section
            order by sectionid asc
        </cfquery>
        <cfset myResult="">
        <cfset myResult = myResult & "<option value='0'></option>">
        <cfloop query="qrySection">
			<cfset myResult = myResult & "<option value='" & sectionid & "'>" & sectionname & "</option>">
        </cfloop>
		<cfreturn myResult>
    </cffunction>  
    
    <cffunction name="getStaff" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfargument name="divisionID" type="numeric" required="yes"/>
    	<cfquery name="qrySection" datasource="#variables.PTDSN#">
			select empid, full_name as name
			from users
            where divisionID = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"/>
            and status = 1
            order by full_name asc
        </cfquery>
        <cfset myResult="">
        <cfset myResult = myResult & "<option value='0'>Unassigned</option>">
        <cfloop query="qrySection">
			<cfset myResult = myResult & "<option value='" & empid & "'>" & name & "</option>">
        </cfloop>
		<cfreturn myResult>
    </cffunction>  
    
   <!---Staff Management Start--->   
   <cffunction name="SMGetStaff" access="remote" returntype="string" output="false" returnformat="plain">
     	<cfargument name="UserDivision" required="true" type="numeric">
        	<cfquery name="SMGetStaff" datasource="#variables.PTDSN#">
            	 SELECT DivisionStaff.EmpID, DivisionStaff.Name, DivisionStaff.StaffID, Division.DivisionName, Section.SectionName
                 FROM DivisionStaff
                 LEFT JOIN Division ON DivisionStaff.DivisionID = Division.DivisionID
                 LEFT JOIN Section ON DivisionStaff.SectionID = Section.SectionID
                 WHERE DivisionStaff.DivisionID = #UserDivision# 
                 ORDER BY DivisionStaff.EmpID
            </cfquery>
        <cfreturn serializeJson(SMGetStaff,true)>
     </cffunction>
     
     <cffunction name="SMDelStaff" access="remote" returntype="void" output="false">
     	<cfargument name="EID" required="true" type="numeric"/>
        	<cfquery datasource="#variables.PTDSN#">
            	DELETE from DivisionStaff
				WHERE EmpID = #EID#
            </cfquery>
     </cffunction>
     
     <cffunction name="SMGetSection" access="remote" returntype="query">
     	<cfargument name="UserDivision" required="true" type="numeric">
        	<cfquery name="getSection" datasource="#variables.PTDSN#">
            	SELECT SectionID, SectionName
                FROM Section
                WHERE DivisionID = #UserDivision#
                </cfquery>
            <cfreturn getSection>
    </cffunction>
    
    <cffunction name="getStaffDetails" access="remote" returntype="query">
     	<cfargument name="StaffID" required="true" type="numeric"/>
        	<cfquery name="getStaffDetails" datasource="#variables.PTDSN#">
            	SELECT StaffID, EmpID, SectionID, Name
                FROM DivisionStaff
                WHERE StaffID = #StaffID#
                </cfquery>
        <cfreturn getStaffDetails>
    </cffunction>
        
	<cffunction name="StaffUpdate" access="remote" returntype="string" output="false">
    	<cfargument name="StaffID" required="true" type="string"/>
    	<cfargument name="SectionID" required="true" type="numeric"/>
        <cfargument name="DivisionID" required="true" type="numeric"/>
        <cfargument name="EID" required="true" type="numeric"/>
        <cfargument name="EmployeeName" required="true" type="string"/>
       
        <cfif isnumeric(arguments.StaffID)>
            <cfquery name="SUpdate" datasource="#variables.PTDSN#">
                UPDATE DivisionStaff
                SET EmpID = #EID#,
                    Name = '#EmployeeName#',
                    DivisionID = #DivisionID#,
                    SectionID = #SectionID#
                WHERE StaffID = #StaffID#
            </cfquery>
        <cfelse>
        	<cfquery name="SAdd" datasource="#variables.PTDSN#">
            	INSERT INTO DivisionStaff (EmpID, Name, SectionID, DivisionID)
                VALUES (#EID#, '#EmployeeName#', #SectionID#, #DivisionID#)
            </cfquery>
        </cfif>
    </cffunction>
   <!---Staff Management End--->
   
   <!---User Management Start--->
   <cffunction name="UAGetDivision" access="remote" returntype="query">
     	<cfquery name="getDivision" datasource="#variables.PTDSN#">
            SELECT DivisionID, DivisionName
            FROM Division
        </cfquery>
        <cfreturn getDivision>
    </cffunction>
    
    <cffunction name="UAGetSecurity" access="remote" returntype="query">
    	<cfargument name="SecurityID" required="yes" type="numeric"/>
     	<cfquery name="getSecurity" datasource="#variables.PTDSN#">
            SELECT SecurityID, Description
            FROM SecurityLevel
            WHERE SecurityID >= <cfqueryparam value="#arguments.SecurityID#" cfsqltype="cf_sql_integer"/>
        </cfquery>
        <cfreturn getSecurity>
    </cffunction>
     
     <cffunction name="UserUpdate" access="remote" returntype="string" output="false">
    	<cfargument name="Status" required="true" type="numeric"/>
    	<cfargument name="SecurityID" required="true" type="numeric"/>
        <cfargument name="DivisionID" required="true" type="numeric"/>
        <cfargument name="EID" required="true" type="string"/>
        <cfargument name="Name" required="true" type="string"/>
        <cfargument name="UID" required="true" type="string"/>
       
        <cfif isnumeric(arguments.UID)>
            <cfquery name="UUpdate" datasource="#variables.PTDSN#">
                UPDATE Users
                SET EmpID = <cfqueryparam value="#EID#" cfsqltype="cf_sql_varchar"/>,
                    full_name = <cfqueryparam value="#Name#" cfsqltype="cf_sql_varchar"/>,
                    DivisionID = <cfqueryparam value="#DivisionID#" cfsqltype="cf_sql_integer"/>,
                    SecurityID = <cfqueryparam value="#SecurityID#" cfsqltype="cf_sql_integer"/>,
                    Status = <cfqueryparam value="#Status#" cfsqltype="cf_sql_integer"/>
                WHERE UserID = <cfqueryparam value="#UID#" cfsqltype="cf_sql_varchar"/>
            </cfquery>
        <cfelse>
        	<cfquery name="UAdd" datasource="#variables.PTDSN#">
            	INSERT INTO Users (EmpID, full_name, DivisionID, SecurityID, Status)
                VALUES (<cfqueryparam value="#EID#" cfsqltype="cf_sql_varchar"/>, 
                	<cfqueryparam value="#Name#" cfsqltype="cf_sql_varchar"/>, 
                    <cfqueryparam value="#DivisionID#" cfsqltype="cf_sql_integer"/>, 
                    <cfqueryparam value="#SecurityID#" cfsqltype="cf_sql_integer"/>, 
                    <cfqueryparam value="#Status#" cfsqltype="cf_sql_integer"/>)
            </cfquery>
        </cfif>
    </cffunction>
    
    <cffunction name="UADelStaff" access="remote" returntype="void" output="false">
     	<cfargument name="UID" required="true" type="string"/>
        	<cfquery datasource="#variables.PTDSN#">
            	DELETE from Users
				WHERE UserID = <cfqueryparam value="#UID#" cfsqltype="cf_sql_varchar"/>
            </cfquery>
     </cffunction>
     
     <cffunction name="getUserDetails" access="remote" returntype="query">
     	<cfargument name="UID" required="true" type="string"/>
        	<cfquery name="getUserDetails" datasource="#variables.PTDSN#">
            	SELECT *
                FROM Users
                WHERE UserID = <cfqueryparam value="#UID#" cfsqltype="cf_sql_varchar"/>
            </cfquery>
        <cfreturn getUserDetails>
    </cffunction>
    
    <cffunction name="UAGetUsers" access="remote" returntype="string" output="false" returnformat="plain">
     	<cfargument name="UserDivision" required="true" type="numeric">
        <cfargument name="SecurityID" required="true" type="numeric">
        <cfif arguments.UserDivision eq 6>
        	<cfquery name="UAGetUsers" datasource="#variables.PTDSN#">
            	SELECT Users.UserID, Users.EmpID, Users.full_name, Users.Login, Users.Status, Division.DivisionName, SecurityLevel.Description
				FROM Users
                LEFT JOIN Division ON Users.DivisionID = Division.DivisionID
                LEFT JOIN SecurityLevel ON Users.SecurityID = SecurityLevel.SecurityID
                <!--- Uncomment to not show your own username self on User Table
				EXCEPT
                SELECT Users.EmpID, Users.full_name, Users.Status, Division.DivisionName, SecurityLevel.Description
                FROM Users
                LEFT JOIN Division ON Users.DivisionID = Division.DivisionID
                LEFT JOIN SecurityLevel ON Users.SecurityID = SecurityLevel.SecurityID
                WHERE Users.EmpID = #EID# --->
                WHERE Users.EmpID != '0'
                ORDER BY Users.EmpID ASC
            </cfquery>
        <cfelse>
        	<cfquery name="UAGetUsers" datasource="#variables.PTDSN#">
            	SELECT Users.UserID, Users.EmpID, Users.full_name, Users.Login, Users.Status, Division.DivisionName, SecurityLevel.Description
				FROM Users
                LEFT JOIN Division ON Users.DivisionID = Division.DivisionID
                LEFT JOIN SecurityLevel ON Users.SecurityID = SecurityLevel.SecurityID
                WHERE Users.DivisionID = <cfqueryparam value="#arguments.UserDivision#" cfsqltype="cf_sql_integer"/>
                AND Users.SecurityID >= <cfqueryparam value="#arguments.SecurityID#" cfsqltype="cf_sql_integer"/>
                <!--- Uncomment to not show your own username self on User Table<br>
				EXCEPT
                SELECT Users.EmpID, Users.full_name, Users.Status, Division.DivisionName, SecurityLevel.Description
                FROM Users
                LEFT JOIN Division ON Users.DivisionID = Division.DivisionID
                LEFT JOIN SecurityLevel ON Users.SecurityID = SecurityLevel.SecurityID
                WHERE Users.EmpID = #EID# --->
                ORDER BY Users.EmpID ASC
            </cfquery>
        </cfif>
        <cfreturn serializeJson(UAGetUsers,true)>
     </cffunction>
     <!---User Management End--->
     
     <!---Archive Start--->
    <cffunction name="getArchive" access="remote" returntype="string" output="false"  returnformat="plain">
        <cfargument name="empID" type="string" required="yes"/>
        <cfargument name="divisionID" type="string" required="yes"/>
        <cfargument name="securityID" type="numeric" required="yes"/>
    
        <cfquery name="qryArchive" datasource="#variables.PTDSN#">
            select p.project_id, p.project_name, p.description, ps.status, p.start_date as startdt, CONVERT(VARCHAR(10), p.start_date,101) start_date, p.estimate_end_date as enddt, 
            ISNULL(CONVERT(VARCHAR(10), p.estimate_end_date,101),'') estimate_end_date,p.completed_date as compdt, 
            ISNULL(CONVERT(VARCHAR(10), p.completed_date,101),'') completed_date, <cfif arguments.securityID eq 2>p.dept_priority<cfelse>p.division_priority</cfif> as priority, 
            isnull(d.DivisionName,'') as divisionname, isnull(ds.full_name,'Unassigned') as Assigned_To, p.Division_Assigned, p.division, isnull(p.comments, '') as comments, isnull(u.follow,0) follow
            from project p left join Project_Status ps on (p.Status = ps.PStatusID)
            left join Division d on (p.division = d.DivisionID)
            left join Users ds on (p.staff_assigned = ds.EmpID)
            <!---left join DivisionStaff ds on (p.staff_assigned = ds.empID)--->
            left join 
            (select distinct project_id, empid as follow
            from UserWatchList  where EmpID =  <cfqueryparam value="#arguments.empID#" cfsqltype="cf_sql_varchar"/>) u ON (u.project_id = p.Project_ID)
            where p.archive = 1 AND p.deleted != 1
        <cfif arguments.securityID gt 2> and (p.div_Creator = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or p.division_Assigned = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or p.division = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer">)</cfif>
        </cfquery>
        
        <cfreturn serializeJson(qryArchive,true)>
    </cffunction>
    
    <cffunction name="Archive" access="remote" returntype="void" output="false">
    	<cfargument name="PID" type="numeric" required="yes">
            <cfquery name="Archive" datasource="#variables.PTDSN#">
                UPDATE Project
                SET Archive = 1
                WHERE Project_ID = #PID#
            </cfquery>
    </cffunction>
	<!---Archive End--->
    
     <!---Delete Start--->
    <cffunction name="getDeleted" access="remote" returntype="string" output="false"  returnformat="plain">
        <cfargument name="empID" type="string" required="yes"/>
        <cfargument name="divisionID" type="string" required="yes"/>
        <cfargument name="securityID" type="numeric" required="yes"/>
    
        <cfquery name="qryDelete" datasource="#variables.PTDSN#">
            select p.project_id, p.project_name, p.description, ps.status, p.start_date as startdt, CONVERT(VARCHAR(10), p.start_date,101) start_date, p.estimate_end_date as enddt, 
            ISNULL(CONVERT(VARCHAR(10), p.estimate_end_date,101),'') estimate_end_date,p.completed_date as compdt, 
            ISNULL(CONVERT(VARCHAR(10), p.completed_date,101),'') completed_date, <cfif arguments.securityID eq 2>p.dept_priority<cfelse>p.division_priority</cfif> as priority, 
            isnull(d.DivisionName,'') as divisionname, isnull(ds.full_name,'Unassigned') as Assigned_To, p.Division_Assigned, p.division, isnull(p.comments, '') as comments, isnull(u.follow,0) follow
            from project p left join Project_Status ps on (p.Status = ps.PStatusID)
            left join Division d on (p.division = d.DivisionID)
            left join Users ds on (p.staff_assigned = ds.EmpID)
            <!---left join DivisionStaff ds on (p.staff_assigned = ds.empID)--->
            left join 
            (select distinct project_id, empid as follow
            from UserWatchList  where EmpID =  <cfqueryparam value="#arguments.empID#" cfsqltype="cf_sql_varchar"/>) u ON (u.project_id = p.Project_ID)
            where p.archive != 1 AND p.deleted = 1
        <cfif arguments.securityID gt 2> and (p.div_Creator = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or p.division_Assigned = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer"> or p.division = <cfqueryparam value="#arguments.divisionID#" cfsqltype="cf_sql_integer">)</cfif>
        </cfquery>
        
        <cfreturn serializeJson(qryDelete,true)>
    </cffunction>
    
    <cffunction name="restoreProject" access="remote" returntype="void" output="false">
    	<cfargument name="projectID" type="numeric" required="yes"/>
        
        <cfquery datasource="#variables.PTDSN#">
        	UPDATE Project
            SET Deleted = 0
            where project_id = <cfqueryparam value="#arguments.projectID#" cfsqltype="cf_sql_integer"/>
        </cfquery>
    </cffunction>
    <!---Delete End--->
    
	<cffunction name="loadAppVar" access="private" returntype="void">

	</cffunction>
</cfcomponent>