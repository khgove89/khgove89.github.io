<cfcomponent persistent="true" extends="base">
	
    <cfset init()/>    
    <cffunction name="init" access="private" output="no">
    	<cfset variables.ContractDSN = "CPS_ContractTracking"/>
    </cffunction>
    
	<cffunction name="contractSearch" access="remote" returntype="string" output="false"  returnformat="plain">
		<cfargument name="contractNumber" type="string" required="yes" default="">
        <cfargument name="contractSummary" type="string" required="yes" default="">
        
        <cfset local.qryContract = ""> 
		<cfif isdefined('arguments.contractNumber') and #trim(arguments.contractNumber)# neq "">
            <cfif right(arguments.contractNumber, 1) eq "*"> <!--- If the last character is a * user is performing wild card search --->
                <cfset searchcrit = "#replacenocase(arguments.contractNumber, '*', '', 'All')#%">
                
                <cfstoredproc procedure="FT_ContractSearch" datasource="#variables.ContractDSN#">
                    <cfprocparam cfsqltype="cf_sql_varchar" maxlength="26" type="in" value="#searchcrit#">
                    <cfprocparam cfsqltype="cf_sql_integer" type="in" value="2">
                    <cfprocresult maxrows="100" name="local.qryContract">
                </cfstoredproc> 
            <cfelse>
                <cfstoredproc procedure="FT_ContractSearch" datasource="#variables.ContractDSN#">
                    <cfprocparam cfsqltype="cf_sql_varchar" maxlength="26" type="in" value="#trim(arguments.contractNumber)#">
                    <cfprocparam cfsqltype="cf_sql_integer" type="in" value="1">
                    <cfprocresult maxrows="100" name="local.qryContract">
                </cfstoredproc> 
            </cfif>   
            <!---Increment Contract Num. Mobile search---> 
            <cfquery datasource="#variables.ContractDSN#">
            	UPDATE STAT_CURRENT SET MobileContractNum = MobileContractNum + 1
            </cfquery>
            
        <cfelseif isdefined('arguments.contractSummary') and #trim(arguments.contractSummary)# neq "">
            <cfstoredproc procedure="FT_ContractTextSearch" datasource="#variables.ContractDSN#">
                <cfprocparam cfsqltype="cf_sql_varchar" maxlength="50" type="in" value="#chr(34)##trim(arguments.contractSummary)##chr(34)#">
                <cfprocresult maxrows="100" name="local.qryContract">
            </cfstoredproc>
            <!---Increment Contract Text Mobile search---> 
            <cfquery datasource="#variables.ContractDSN#">
            	UPDATE STAT_CURRENT SET MobileContractText = MobileContractText + 1
            </cfquery>
        </cfif>
        
        <cfreturn serializeJson(local.qryContract,true)>
	</cffunction>
    
    <cffunction name="contractDetail" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfargument name="contractNumber" type="string" required="yes" default="">
        
        <cfstoredproc datasource="#variables.ContractDSN#" procedure="ViewContract">
          <cfprocparam cfsqltype="cf_sql_varchar" maxlength="26" type="in" value="#trim(arguments.contractNumber)#">
          <cfprocresult maxrows="1" name="qryMainRecord">
        </cfstoredproc> 
         <!---Increment Contract Mobile view---> 
            <cfquery datasource="#variables.ContractDSN#">
            	UPDATE STAT_CURRENT SET MobileContractView = MobileContractView + 1
            </cfquery>
        <cfreturn serializeJson(qryMainRecord,true)>
    </cffunction>
    
    <cffunction name="contractDocs" access="remote" returntype="string" output="false"  returnformat="plain">
    	<cfargument name="contractNumber" type="string" required="yes" default="">
        
        <cfstoredproc datasource="#variables.ContractDSN#" procedure="ViewOnlineDocs">
            <cfprocparam cfsqltype="cf_sql_varchar" maxlength="26" type="in" value="#trim(arguments.contractNumber)#">
            <cfprocresult name="qryOnlineDoc">
        </cfstoredproc> 
        
        <cfreturn serializeJson(qryOnlineDoc,true)>
    </cffunction>
    
</cfcomponent>