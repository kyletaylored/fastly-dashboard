# Grafana / Fastly on macOS
Nicer traffic reports than spreadsheets.

### Sytem Requirements
 * Lando (or at least Docker)
 * homebrew
 * grafana (steps below)
 * Don't forget to bring a traffic CSV file to import

## Setup

1. Install Grafana on Mac, with plugins.

##### Install Grafana via homebrew
```
brew update
brew install grafana
```
##### Install brew services
```
brew tap homebrew/services
brew services start grafana
```
##### Install Grafana plugins: pie-chart
```
grafana-cli plugins install grafana-piechart-panel
brew services restart grafana
```

2. Log into Grafana. 

```
Host: 127.0.0.1:3000
User: admin
Pass: admin
```

3. Import dashboard

While on Dashboard home page, click "Home" menu on the left top corner and select "Import dashboard" option to upload a JSON file.

4. Set up Lando

```
lando start
lando mysql --table=SITEID < file.csv
```

5. Update table

Without creating a new Datasource connection every time, you should store the results in a unique table, and copy it over to a table called `fastly`.
