<cfcomponent>  
  
  <cffunction name="onApplicationStart">
  </cffunction>
  
  <cffunction name="onRequestStart">
    
    <cfif isdefined("url.init")>
      <cfset onApplicationStart()> 
    </cfif>
  
  </cffunction>

</cfcomponent>