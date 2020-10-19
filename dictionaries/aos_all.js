import aos1 from './aos_1.js'
import war1 from './warhammer_1.js'
import war2 from './warhammer_2.js'
import war3 from './warhammer_3.js'
import war4 from './warhammer_4.js'


let combined = Object.assign({}, aos1, war1, war2, war3, war4);

export default combined;