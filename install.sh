# Useful functions
function command_exists () {
    type "$1" &> /dev/null ;
}

function app_exists() {
    open -Ra "$1" &> /dev/null
}

# Console colors
red='\033[0;31m'
green='\033[0;32m'
green_bg='\033[42m'
yellow='\033[1;33m'
NC='\033[0m'

echo_red () { echo -e "${red}$1${NC}"; }
echo_green () { echo -e "${green}$1${NC}"; }
echo_green_bg () { echo -e "${green_bg}$1${NC}"; }
echo_yellow () { echo -e "${yellow}$1${NC}"; }

declare -a expressions=("your mother's maiden name" "the name of your first pet" "the city you were born" "your favorite teacher" "your school mascot" "the last 4 of your social security number")
selectedexpression=${expressions[$RANDOM % ${#expressions[@]} ]}

# Welcome
echo_green "Welcome to the Fastly Dashboad."
echo -e "To get started, please enter ${yellow}$selectedexpression${NC}:"
sleep 5
echo_red "Just kidding."
echo_green "Begin cloning process. Collecting sheep samples..."
echo ""

# Download the repository
git clone https://github.com/kyletaylored/fastly-dashboard

# Go to directory
cd fastly-dashboard

# Check for Lando
if ! command_exists lando; then
    echo "Lando is not installed, attempting to install..."
    brew cask install lando
else
    echo "Lando is installed."
    # Start Lando containers.
    lando start
fi

# Check for Sequel Pro
if ! app_exists "Sequel Pro.app"; then
    echo "Sequel Pro is not installed. Do you want to install it?"
    select yn in "Yes" "No"
    case $yn in
        Yes ) brew cask install sequel-pro;;
        No ) exit;;
    esac
else
    echo "Sequel Pro is installed."
fi
