// 根据日期创建文件目录
import { formatDate } from './formatDate'
function create_dirName(): string {
    const dir_name = formatDate(new Date(), 'yyyy-MM-dd')
    return dir_name
}

export default create_dirName