# Useful functions
function command_exists () {
    type "$1" &> /dev/null ;
}

# Download the repository
git clone https://github.com/kyletaylored/fastly-dashboard

# Go to directory
cd fastly-dashboard

# Update Homebrew repo
brew update

# Install Brew services
brew tap homebrew/services

# Check for Lando
if ! command_exists lando; then
    echo "Lando is not installed, attempting to install..."
    brew cask install lando
else
    echo "Lando is installed."
fi

# Check for Grafana
if ! command_exists grafana-cli; then
    echo "Grafana is not installed, attempting to install..."
    brew install grafana
    brew services start grafana
else
    echo "Grafana is installed."
fi

# Install pie chart plugin
grafana-cli plugins install grafana-piechart-panel
brew services restart grafana

# Check for goaccess
if ! command_exists goaccess; then
    echo "goaccess is not installed, attempting to install..."
    brew install goaccess
else
    echo "goaccess is installed."
fi

# Start Lando containers.
lando start