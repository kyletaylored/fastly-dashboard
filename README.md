# Grafana Dashboard on Lando
Nicer traffic reports than spreadsheets.

### Sytem Requirements
 * [Lando](https://lando.dev)
 * [Homebrew (optional)](https://brew.sh)
 * Don't forget to bring a traffic CSV file to import

## Install Dependencies

### Auto-install
Run the following script to download the repository and auto-install the dependencies.
```bash
curl -fsSL https://raw.githubusercontent.com/kyletaylored/fastly-dashboard/master/install.sh | bash
```

### Manual install

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

## Create Containers

### 1. Start Lando

If you do have it, just start Lando using the provided lando.yml.
```bash
lando start
```

At this point, a number of things are happening:

1. Grafana and MariaDB containers are being created.
2. Grafana is being proxied through `http://grafana.lndo.site`.
3. Datasource and dashboards are being provisioned and imported.

### 2. Log into Grafana

Open the localhost server at [http://grafana.lndo.site](http://grafana.lndo.site).

There are default settings applied that removes the admin login, so you should be redirected to the Grafana overview page.

## Import Data

### 1. Connect to database through Sequel Pro

Open Sequel Pro, connect to the database, and import the CSV. You can use the supplied `.plist` to populate your connection settings using the import option at the bottom of the left sidebar.

If manually connecting, use the following credentials:

```bash
Mode: TCP/IP
Host: localhost:32769
User: fastly
Pass: fastly
Data: fastly
```

### 2. Import CSV as table

1. Go to File -> Import
2. Select your CSV file (choose `Latin-DOS` encoding if you don't want it to scream.)
3. Make all field types `LONGTEXT`, give table a name, preferably in this format: `<SITE CODE>_<DATE PULL>`, i.e `example_12_08_19`.
4. Click import.