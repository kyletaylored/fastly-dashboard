# Grafana / Fastly on macOS
Nicer traffic reports than spreadsheets.

### Sytem Requirements
 * [Lando](https://lando.dev) (or at least Docker)
 * [Homebrew](https://brew.sh)
 * [Grafana](https://grafana.com/docs/grafana/latest/installation/mac/) (steps below)
 * Don't forget to bring a traffic CSV file to import

## Install Dependencies.

### Auto-install
Run the following script to download the repository and auto-install the dependencies.
```bash
curl -fsSL https://raw.githubusercontent.com/kyletaylored/fastly-dashboard/master/install.sh | bash
```

### Manual install.

#### 1. Download the repo
Download and cd into the repo.
```bash
git clone https://github.com/kyletaylored/fastly-dashboard
cd fastly-dashboard
```

#### 2. Set up Lando

If you don't have Lando, first install it through Homebrew, or [follow the online instructions](https://docs.lando.dev/basics/installation.html).
```bash
brew cask install lando
```

If you do have it, just start Lando using the provided lando.yml.
```bash
lando start
```

#### 3. Install Grafana on Mac, with plugins

Install Grafana via homebrew
```bash
brew install grafana
```

Install brew services
```bash
brew tap homebrew/services
brew services start grafana
```

Install Grafana plugins: pie-chart
```bash
grafana-cli plugins install grafana-piechart-panel
brew services restart grafana
```

#### 4. Log into Grafana

Open the localhost server at [localhost:3000](http://localhost:3000).
```
Host: localhost:3000
User: admin
Pass: admin
```

### Setting up the Dashboard

#### 1. Configure the data connector.

1. Go to the [Datasources](http://localhost:3000/datasources) page
2. Click **Add data source**.
3. Select MySQL
4. Enter a name (can be anything), and check "Default"
5. Enter the following connection details:
```
Host: localhost:32769
Database: fastly
User: fastly
Password: fastly
```

6. Click "Save and Test" - confirm working datasource.

#### 2. Import dashboard

While on Dashboard home page, click "Home" menu on the left top corner and select "Import dashboard" option to upload a JSON file.

#### 3 Import CSV as table through Sequel Pro

Open Sequel Pro, connect to the database, and import the CSV. You can use the supplied `.plist` to populate your connection settings using the import option at the bottom of the left sidebar.

