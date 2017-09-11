hugo # generates files to /public

# copy /public to website
Add-Type -Path "WinSCPnet.dll"
$source = "c:\src\linbarbell\public\*"
$destination = "/public_html/"
$ftp = Get-Content ftp.txt

$sessionOptions = New-Object WinSCP.SessionOptions
$sessionOptions.ParseUrl($ftp)
$session = New-Object WinSCP.Session
$session.Open($sessionOptions)
$session.PutFiles($source, $destination).Check()
$session.Dispose()