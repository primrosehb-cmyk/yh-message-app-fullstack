# Inlämning 1 - Planeringsfasen
# YH Message App · Mikroblogg

En webbapp som delar barns roliga händelser anonymt. 
Användare skriver korta inlägg (max 140 tecken).

# Systemet skyddar
Frontend → Backend/API → Databas

## Identifierade hot

### | Hot | Var | Konsekvens | STRIDE |
|---|-----|-----|------------|--------|
- | 1 | Brute force – gissar lösenord mot login | Backend | Konto komprometterat | S – Spoofing |
- | 2 | IDOR – inloggad manipulerar andras inlägg via ID:n | Backend | Integritetsbrott | T – Tampering |
- | 3 | Okrypterade lösenord – klartext i databasen | Databas | Alla lösenord exponerade | I – Information Disclosure |
- | 4 | Obehörigt skapande – ej inloggad når API:t | Backend | Obehörigt innehåll | E – Elevation of Privilege |
- | 5 | XSS – skadlig kod injiceras i meddelande | Frontend + Backend + Databas | Kod körs i andras webbläsare | T – Tampering |
- | 6 | Känslig barndata – barninfo exponeras | Databas | Integritetsskada | I – Information Disclosure |
- | 7 | SQL-injektion – skadlig SQL når databasen | Frontend + Backend + Databas | Dataläckage eller radering | T – Tampering |


# Säkerhetskrav

 ## | Krav | Beskrivning | Skyddar mot |
|---|------|-------------|-------------|
- 1 | Registrering | Unikt användarnamn. Lösenord hashas med bcrypt, aldrig klartext | Hot 1 & 3 |
- 2 | Accesskontroll | Användare ska endast kunna redigera och ta bort sina egna meddelanden, aldrig andras | Hot 2 |
- 3 | Autentisering | Endast inloggade användare får skapa, redigera och ta bort meddelanden. Ej inloggade får HTTP 401 | Hot 4 |
- 4 | XSS-skydd | All användarinmatning saneras innan den sparas i databasen och visas för andra användare | Hot 5 |
- 5 | Barnens anonymitet | Ingen identifierbar information om barn (namn, ålder, ort) sparas eller visas. Endast ålderskategori är tillåtet | Hot 6 |
- 6 | SQL-skydd | API:t skyddar mot SQL-injektion genom parametriserade förfrågningar | Hot 7 |
