# DiceThrone Hub

Aplikacja webowa zbudowana w Next.js.

## Uruchomienie na innym komputerze

Wymagania: Node.js 20.9 lub nowszy oraz Git.

1. Sklonuj repozytorium:

	```bash
	git clone <adres-repozytorium>
	cd dicethrone-hub
	```

2. Zainstaluj zależności na podstawie pliku blokady:

	```bash
	npm ci
	```

3. Uruchom serwer developerski:

	```bash
	npm run dev
	```

4. Otwórz [http://localhost:3000](http://localhost:3000).

## Przydatne polecenia

- `npm run dev` — uruchamia aplikację lokalnie.
- `npm run build` — tworzy wersję produkcyjną.
- `npm run start` — uruchamia zbudowaną wersję produkcyjną.
- `npm run lint` — sprawdza kod ESLintem.

Nie dodawaj do repozytorium folderów `node_modules` ani `.next`; zależności odtworzysz przez `npm ci`.
