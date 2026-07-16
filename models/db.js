const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, '..', 'db.json');

function readDB() {
    try {
        const data = fs.readFileSync(DB_PATH, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading database:", err);
        return { loai: [], menu_dichvu: [], dattiec: [], chitietdattiec: [], thanhtoan: [], chitietthanhtoan: [] };
    }
}

function writeDB(data) {
    try {
        fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 2), 'utf8');
        return true;
    } catch (err) {
        console.error("Error writing database:", err);
        return false;
    }
}

module.exports = {
    readDB,
    writeDB
};
