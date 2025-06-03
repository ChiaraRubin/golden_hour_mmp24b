# Golden Hour

## Kurzbeschreibung des Projekts

**Golden Hour** ist eine interaktive Webanwendung und One-Pager, bei dem Nutzer:innen eine beliebige Stadt eingeben können. Die App zeigt die geografischen Koordinaten der Stadt an und sollte den aktuellen Sonnenstand auf einem Sonnenstandsbogen visualisieren. Angezeigt werden die Zeiten des Sonnenaufgangs, Sonnenuntergangs, die aktuelle Uhrzeit sowie die Länge des Tages. Der Hintergrund passt sich der Tageszeit an und ist hell am Tag oder dunkel in der Nacht.

## Learnings und Schwierigkeiten

**Laura Jaeger:** Ich habe gelernt, wie man APIs sinnvoll verknüpft. Die grösste Herausforderung war es, den visuellen Sonnenstand korrekt darzustellen, aber durch Unterstützung der Dozierenden und KI konnten wir unsere Idee umsetzen, jedoch nicht so perfekt wie wir es gerne gehabt hätten. Wir haben alles versucht, was wir konnten, um unser UX-Design umzusetzen.

**Chiara Rubin:** Am meisten gelernt habe ich beim Verbinden der APIs über die URL. Besonders hilfreich war auch das Debugging mit “console.log”, um Fehler zu identifizieren und zu beheben. Erfolgserlebnisse hatte ich u.a. beim korrekten Ansprechen und Modifizieren von HTML-Tags mit JavaScript, z.B. beim Anpassen des Hintergrunds je nach Tageszeit mithilfe von if-else-Bedingungen. Eine grössere Herausforderung stellte die korrekte Darstellung der Sonne entlang des Sonnenbogens dar – selbst mit Unterstützung durch KI und die Dozierenden. Zwar gelang es uns, die Sonne auf dem Bogen anzuzeigen (und nicht daneben), jedoch stimmen die Winkel nicht immer exakt. In manchen Fällen befindet sich die Sonne deshalb ausserhalb des sichtbaren Bereichs. Wir haben viel Zeit investiert, mussten aber feststellen, dass die exakte Winkelberechnung unsere mathematischen Kenntnisse übersteigt.

**Anmerkung:** Die Position der Sonne wird leider nicht ganz korrekt dargestellt. Wer jedoch die Sonne auf dem Sonnenbogen sehen möchte, kann eine Stadt auswählen, in der es zurzeit Mittag oder kurz nach Mittag ist (Zeitrange zwischen 11:00 Uhr und 16:00 Uhr).

## Benutzte Ressourcen und Prompts

### APIs

- [Sunrise-Sunset API](https://sunrise-sunset.org/api) – zur Berechnung von Sonnenaufgang, Sonnenuntergang und Tageslänge
- [Nominatim (OpenStreetMap)](https://nominatim.openstreetmap.org/ui/search.html) – zur Umwandlung von Städtenamen in geografische Koordinaten
- [Geoapify Geocoding API](https://www.geoapify.com/geocoding-api) – alternative Geokodierung und Standortdaten

### Technologien & Tools

- HTML, CSS, JavaScript
- Figma für UX-Design
- Git & GitHub zur Versionierung
- ChatGPT zur Unterstützung bei Fehlern

### Verwendete Prompts (ChatGPT)

- Die Sonne wird nicht korrekt auf dem Sonnenbogen angezeigt - wahrscheinlich verschwindet sie im Bereich von “overflow: hidden”. Jedoch möchten wir unser CSS nicht verändern, da es sonst nicht mehr unserer Vorlage entspricht. Wie können wir die Sonne korrekt auf dem Bogen platzieren, dass beim Zeitpunkt des Sonnenaufgangs die Sonne ganz links unten auf dem Sonnenbogen angezeigt wird und beim Sonnenuntergang die Sonne ganz rechts unten zu sehen ist auf dem Sonnenbogen?
- Unser Code funktioniert noch nicht. Kannst du uns helfen, die Sonne so auf dem Sonnenbogen zu positionieren, wie sie aktuell steht? Hier der Code …
- Wie kann ich mit JavaScript die Backgroundcolor für den Body-Tag in HTML verändern?
- Die Zeit (Zeit des Sonnenauf- und Untergangs) wird im Moment als UTC-Zeit ausgegeben. Wie kann ich sie so anpassen, dass sie der Zeitzone der eingegebenen Stadt entspricht?
- Wie kann ich die aktuelle Uhrzeit so anpassen, damit sie mit der aktuellen Uhrzeit der eingegebenen Stadt übereinstimmt?
- Wie muss ich 10pm richtig formatieren?
- Was bedeutet das Ausrufezeichen hier? if (!sonnenstand || !sonnenstand.results) {
