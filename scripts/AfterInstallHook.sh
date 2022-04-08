#!/bin/bash
sudo -u ubuntu /bin/bash -l
sudo chown -R ubuntu:ubuntu /home/ubuntu/tp-customer-dashboard-frontend
chmod -R 775 /home/ubuntu/tp-customer-dashboard-frontend

set -e
cd /home/ubuntu/tp-customer-dashboard-frontend

rm -rf node_modules

export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"  # This loads nvm
[ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"  # This loads nvm bash_completion

npm install
npm run build