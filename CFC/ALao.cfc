<cfcomponent persistent="true" output="no">

	<cfset init()/>    
    <cffunction name="init" access="private" output="no">
    	<cfset variables.PTDSN = "ProjectTracker"/>
		<cfset loadAppVar()/>  
     </cffunction>
     
     
</cfcomponent>