<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>AD Login</title>
</head>

<body>
<cftry>
<cfldap action="QUERY"          
                   name="auth"          
                   attributes="samAccountName"          
                   start="DC=cityclerk,DC=local"          
                   scope="SUBTREE"          
                   maxrows="1"          
                   server="14clerkdc1.cityclerk.local"          
                   username="cityclerk\administrator"          
                   password="auctorita14">
            <cfset loginVal= true>
<cfcatch>
	<cfdump var="#catch#"/>
</cfcatch>
</cftry>           
</body>
</html>