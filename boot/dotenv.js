const dotenv = require('dotenv');


module.exports = () => {
	dotenv.config({ path: 'conf/app.env' });
	// забыли загрузить переменные окружения http://gitlab.mmcs.sfedu.ru/it-lab/grade/issues/629
	dotenv.load();
};
