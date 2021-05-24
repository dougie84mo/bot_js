const fs = require('fs');
// let assets_dir = `${__dirname}\\..\\assets`;
let data_dir = `${__dirname}\\..\\data`;
let cache_dir = `${__dirname}\\..\\cache`;
// const data_asset_file = (file_name) => `${data_dir}\\${file_name}`
const addDir = (directory) => {
    if (!fs.existsSync(directory)) {
        fs.mkdirSync(directory);
    }
}

const addFile = (file, data="{}") => {
    if (!fs.existsSync(file)) {
        fs.writeFileSync(file, data);
    }
}
const data_assets = ['products', 'profiles', 'proxies', 'payment_profiles'];
const data_files = ['checkouts', 'raffles', 'profile_lists', 'monitors', 'account_generators', 'addresses'];
const cache_files = [ 'harvests', 'raffles'];
const cache_folders = [ 'harvests', 'raffles'];


addDir(data_dir);
addDir(cache_dir);
for (let asset in data_assets) {
    addDir(`${data_dir}\\${data_assets[asset]}`);
}
for (let asset in data_files) {
    addFile(`${data_dir}\\${data_files[asset]}.json`);
}
for (let asset in cache_files) {
    addFile(`${cache_dir}\\${cache_files[asset]}.json`);
}
