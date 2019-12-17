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

#### 3. Log into Grafana

Open the localhost server at [http://grafana.lndo.site](http://grafana.lndo.site).

There are default settings applied that removes the admin login, so you should be redirected to the Grafana overview page.

### Setting up the Dashboard

#### 1. Configure the data connector.

1. Go to the [Datasources](http://grafana.lndo.site/datasources) page
2. Click **Add data source**.
3. Select MySQL
4. Enter a name (can be anything), and check "Default"
5. Enter the following connection details:
```
Host: database.fastlygrafana.internal:32769
Database: fastly
User: fastly
Password: fastly
```

6. Click "Save and Test" - confirm working datasource.

#### 2. Import dashboard

While on Dashboard home page, click "Home" menu on the left top corner and select "Import dashboard" option to upload the JSON file located at `./grafana/dashboard/fastly-dashboard.json`.

#### 3 Import CSV as table through Sequel Pro

Open Sequel Pro, connect to the database, and import the CSV. You can use the supplied `.plist` to populate your connection settings using the import option at the bottom of the left sidebar.

