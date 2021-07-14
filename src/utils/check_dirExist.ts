// 检查目录是否存在

const fs = require('fs')
function check_dirExist(dir: string) {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir)
    }
}

export default check_dirExist