# Fas 3 – Säkerhetsgranskning

## Verktyg

I Fas 3 granskade vi applikationen med tre säkerhetsverktyg inbyggda i GitHub:

- **Dependabot** (SCA – Software Composition Analysis): Jämför våra npm-paket mot GitHub Advisory Database, en global databas med kända sårbarheter. Varje sårbarhet har ett unikt CVE-nummer som används av utvecklare och verktyg världen över.
- **CodeQL** (SAST – Static Application Security Testing): Analyserar vår egen kod statiskt utan att köra den och letar efter farliga mönster.
- **Secret scanning**: Söker igenom repot efter hemligheter som API-nycklar eller lösenord som råkat hamna i koden.

Verktygen hittade totalt 24 fynd. Vi fördjupade oss i två.

---

## Fynd

### Sårbarhet 1 – Missing rate limiting (CodeQL, High)

CodeQL identifierade att login-routen på rad 83 i `server.js` saknar rate limiting. Det finns ingen begränsning för hur många inloggningsförsök en användare får göra. En angripare kan automatiskt skicka tusentals lösenordsförsök per minut tills rätt lösenord hittas — en så kallad brute force-attack.

**Kopplingar:**
- OWASP A07 – Identification and Authentication Failures
- Säkerhetsprincip: Fail Secure — systemet ska neka vid fel, inte fortsätta acceptera försök
- Säkerhetsprincip: Defense in Depth — rate limiting är ett extra skyddslager utöver lösenordet
- STRIDE: Spoofing

**Åtgärd:** Lägg till `express-rate-limit` på `/login` och `/register`. Efter 10 misslyckade försök på 15 minuter blockeras IP-adressen automatiskt.

---

### Sårbarhet 2 – jsonwebtoken (Dependabot, High + Moderate)

Dependabot hittade tre kända sårbarheter i paketet `jsonwebtoken` — ett High (CVE-2022-23539, severity 8.1/10) och två Moderate. Detta är ett direkt beroende som används i produktion för att skapa och verifiera JWT-tokens. Affected versions: <= 8.5.1. Patched version: 9.0.0.

JWT är hela grunden för vår autentisering. Om tokens kan förfalskas kan en angripare logga in som en annan användare. Detta är extra allvarligt eftersom appen hanterar anonyma barnhistorier — en angripare som tar över ett konto kan posta olämpligt innehåll under någon annans identitet, vilket bryter mot säkerhetskrav 5 från Fas 1.

I Fas 2 identifierades att DELETE-routen saknar autentisering. De två sårbarheterna förstärker varandra — en angripare kan förfalska ett token och radera andras inlägg utan att ha loggat in legitimt.

**Kopplingar:**
- OWASP A02 – Cryptographic Failures
- Säkerhetsprincip: Shift Left — sårbarheten hade kunnat fångas tidigare om paketversioner kontrollerats från start
- Säkerhetsprincip: Defense in Depth — om JWT brister behövs fler skyddslager, t.ex. autentisering på DELETE-routen
- STRIDE: Tampering

**Åtgärd:** Uppdatera jsonwebtoken till version 9.0.0. Dependabot kan skapa en automatisk pull request som gör det åt oss — alla tre CVE:erna åtgärdas på en gång.

---

## Positivt fynd – Secret scanning

Secret scanning hittade noll fynd. Det bekräftar att vår `JWT_SECRET` — nyckeln som signerar alla våra tokens — aldrig har råkat hamna i koden på GitHub. Om den nyckeln läckte ut skulle vem som helst kunna skapa giltiga tokens och logga in som vem som helst i appen.

---

## Prioriterade åtgärder

1. Uppdatera `jsonwebtoken` till version 9.0.0
2. Lägg till rate limiting med `express-rate-limit` på `/login` och `/register`
3. Lägg till `authenticateUser` på DELETE-routen

Notering: Många av Dependabots övriga fynd gäller `devDependencies` — paket som bara används under utveckling och inte i produktion. De är lägre prioritet.

---

## Slutsats

Verktygen bekräftade hot vi redan hade identifierat manuellt i Fas 1. Brute force var hot nummer 1 i vår hotmodellering — CodeQL bekräftade att skyddet saknas i koden. Vi identifierade autentisering som säkerhetskrav 3 — Dependabot bekräftade att paketet vi använder har kända CVE:er.

Det visar att hotmodellering och automatiserade verktyg kompletterar varandra. Verktygen ersätter inte tänkandet — men de bekräftar och preciserar var i koden problemen faktiskt finns.
