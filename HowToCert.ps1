Import-Module ACMESharp
Initialize-ACMEVault
New-ACMERegistration -Contacts mailto:somebody@example.org -AcceptTos

New-ACMEIdentifier -Dns linbarbell.com -Alias dns1
Complete-ACMEChallenge dns1 -ChallengeType http-01 -Handler manual
# do the challenge here
Submit-ACMEChallenge dns1 -ChallengeType http-01
(Update-ACMEIdentifier dns1 -ChallengeType http-01).Challenges | Where-Object {$_.Type -eq "http-01"}
Update-ACMEIdentifier dns1

New-ACMEIdentifier -Dns www.linbarbell.com -Alias dns3
Complete-ACMEChallenge dns3 -ChallengeType http-01 -Handler manual
# do the challenge here
Submit-ACMEChallenge dns3 -ChallengeType http-01
(Update-ACMEIdentifier dns3 -ChallengeType http-01).Challenges | Where-Object {$_.Type -eq "http-01"}
Update-ACMEIdentifier dns3

New-ACMECertificate dns1 -Generate -AlternativeIdentifierRefs ([array]$('dns3')) -Alias cert2
Submit-ACMECertificate cert2
Get-ACMECertificate cert2 -ExportKeyPEM "C:\src\cert.key.pem"
Get-ACMECertificate cert2 -ExportCsrPEM "C:\src\cert.csr.pem"
Get-ACMECertificate cert2 -ExportCertificatePEM "C:\src\cert.crt.pem" -ExportCertificateDER "C:\src\cert.crt"
# copy paste cert.crt.pem and cert.key.pem in cpanel
