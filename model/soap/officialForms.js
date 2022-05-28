const soap = require('../../lib/soap');


function processFormErrors(soapFormErrors) {
	return {};
}

function processResponse(soapResponse) {
	const response = soap.getObject(soapResponse);

	const errors = response.Errors;
	if (errors) {
		throw errors;
	}

	// return soap.processArray(response.plans, 'form', processFormErrors);
	return response;
}

function processFormContent(gradeForm, examType, groupNum) {
	const content = [];

	for (const plan in gradeForm) {
		const disciplines = [];
		for (const discipline in gradeForm[plan]) {
			const recordBooks = [];
			for (const student in gradeForm[plan][discipline]['students']) {
				const nextRecordBook = gradeForm[plan][discipline]['students'][student];
				// if (nextRecordBook.bonus[0] !== null) {
				// 	nextStudent['bonusRate'] = nextRecordBook.bonus[0];
				// } else {
				// 	nextStudent['bonusRate'] = 0;
				// }
				let nextStudent = {
					recordBookId: student,
					//semesterRate: nextRecordBook.semester,
					//bonusRate: nextRecordBook.bonus[0] ? nextRecordBook.bonus[0] : 0,
					//testRate: nextRecordBook.exam[0] ? nextRecordBook.exam[0] : 0,
				};
				if (nextRecordBook.semester !== null) {
					let realGrade = nextRecordBook.semester;
					if (nextRecordBook.exam[0] === -2) {
						realGrade = 38;
					}
					nextStudent['semesterRate'] = realGrade;
				} else {
					nextStudent['semesterRate'] = '';
				}
				// semester_sign, exam_sign, retest_sign, retest1_sign
				// если экзамен не выставлен, то подпись брать из семестра
				// для зачета брать подпись retest_sign из 1-го добора и retest2_sign из 2-го
				// если экзамен (пересдачи, доборы) выставлен, то подпись семестра нужно оставить пустой
				nextStudent['semester_sign'] = nextRecordBook.semesterSign;
				if ((nextRecordBook.exam[0] !== null) || (nextRecordBook.exam[1] !== null) || (nextRecordBook.exam[2] !== null)
				    || (nextRecordBook.extra[0] !== null)|| (nextRecordBook.extra[1] !== null)) {
					nextStudent['semester_sign'] = '';
				}
				if (nextRecordBook.examSign !== null) {
					nextStudent['exam_sign'] = nextRecordBook.examSign;
				} else {
					nextStudent['exam_sign'] = nextRecordBook.extraSign !== null ? nextRecordBook.extraSign : (nextRecordBook.exam2Sign !== null ? nextRecordBook.exam2Sign : nextRecordBook.exam3Sign);
				}
				if (nextRecordBook.bonus[0] !== null) {
					nextStudent['bonusRate'] = nextRecordBook.bonus[0];
				} else {
					nextStudent['bonusRate'] = '';
				}
				if (nextRecordBook.exam[0] !== null) {
					let realGrade = nextRecordBook.exam[0];
					if (nextRecordBook.exam[0] === -1) {
						realGrade = -1;
					}
					if (nextRecordBook.exam[0] === -2) {
						realGrade = 22;
					}
					nextStudent['testRate'] = realGrade;
				} else {
					nextStudent['testRate'] = '';
				}
				let totalRate = nextRecordBook.exam[0] + nextRecordBook.semester + nextRecordBook.bonus[0];
				if (totalRate > 100) {
					nextStudent['bonusRate'] -= totalRate - 100;
				}
				if (nextRecordBook.extra[0] !== null) {
					nextStudent['satisfyAttempt1Rate'] = nextRecordBook.extra[0];
				} else {
					nextStudent['satisfyAttempt1Rate'] = '';
				}
				if (nextRecordBook.exam[1] !== null) {
					nextStudent['retestAttempt1Rate'] = nextRecordBook.exam[1];
				} else {
					nextStudent['retestAttempt1Rate'] = '';
				}
				if (examType === 'exam') {
					if ((nextRecordBook.extra[0] !== null) && (nextRecordBook.exam[1] == null) && (nextRecordBook.exam[2] == null)) {
						nextStudent['retest1_sign'] = nextRecordBook.extraSign;
					} else {
						nextStudent['retest1_sign'] = nextRecordBook.exam2Sign;
					}
				}else {
					nextStudent['retest1_sign'] = nextRecordBook.extraSign;
				}
				if (nextRecordBook.extra[1] !== null) {
					nextStudent['satisfyAttempt2Rate'] = nextRecordBook.extra[1];
				} else {
					nextStudent['satisfyAttempt2Rate'] = '';
				}
				if (nextRecordBook.exam[2] !== null) {
					nextStudent['retestAttempt2Rate'] = nextRecordBook.exam[2];
				} else {
					nextStudent['retestAttempt2Rate'] = '';
				}
				if (examType === 'exam') {
					if ((nextRecordBook.extra[0] !== null) && (nextRecordBook.exam[1] == null) && (nextRecordBook.exam[2] == null)) {
						nextStudent['retest2_sign'] = nextRecordBook.extra2Sign;
					} else {
						nextStudent['retest2_sign'] = nextRecordBook.exam3Sign;
					}
				} else {
					nextStudent['retest2_sign'] = nextRecordBook.extra2Sign;
				}
				nextStudent['dateOfShift'] = '0001-01-01T00:00:00';
				nextStudent['remove'] = nextRecordBook.remove;
				if (nextRecordBook.remove == 1) {
					nextStudent['semesterRate'] = '';
					nextStudent['testRate'] = '';
					nextStudent["bonusRate"] = 0;
					nextStudent['satisfyAttempt1Rate'] = '';
					nextStudent['retestAttempt1Rate'] = '';
					nextStudent['satisfyAttempt2Rate'] = '';
					nextStudent['retestAttempt2Rate'] = '';
				}
				recordBooks.push(nextStudent);
			}

			let disciplineControlType = 'экзамен';
			if (gradeForm[plan][discipline]['type'] === 'exam') {
				disciplineControlType = 'экзамен';
			} else if (gradeForm[plan][discipline]['type'] === 'credit') {
				disciplineControlType = 'зачет';
			} else {
				disciplineControlType = 'дифференцированный зачет';
			}
			disciplines.push({
				id: discipline,
				type: disciplineControlType,
				students: {
					student: recordBooks,
				},
			});
		}
		content.push({
			id: plan,
			group: groupNum,
			disciplines: {
				discipline: disciplines,
			},
		});
	}

	const result = {
		plan: content,
	};
	return result;
}

function arraysToJSON(key, arrays) {
	if (arrays === undefined || arrays === null) {
		return arrays;
	}
	if (arrays.constructor == Array) {
		if (key === 'students') {
			return {
				'student': arrays.map(s => arraysToJSON('student', s['student'])),
			};
			//return arrays.map(s => arraysToJSON('student', s['student']));
		} else if (key === 'student') {
			return {
				'student': arraysToJSON('recordbook', arrays)
			};
		} else {
			const dictionary = arrays.reduce((a, x) => ({
				...a,
				[Object.keys(x)[0]]: arraysToJSON(Object.keys(x)[0], x[Object.keys(x)[0]]),
			}), {});
			return dictionary;
		}
	} else if (arrays.constructor == Object) {
		return {
			[Object.keys(arrays)[0]]: arraysToJSON(Object.keys(arrays)[0], arrays[Object.keys(arrays)[0]])
		};
	} else {
		return arrays;
	}
}

module.exports = {
	async uploadForms(year, semester, timestamp, form, milestone, discipline, group) {
		const formContent = processFormContent(form.response.body, form.response.type, form.response.group_fullname);
		let parameters = {};
		if (milestone == 4) {
			parameters = {
				Parameters: {
					date: timestamp,
					year,
					semester,
					signee: form.response.author,
					plans: formContent,
					stage: null,
					disciplineID: discipline,
				},
			};
		} else {
			parameters = {
				Parameters: {
					date: timestamp,
					year,
					semester,
					signee: form.response.author,
					plans: formContent,
					stage: milestone,
					disciplineID: discipline,
				},
			};
		}
		const soapResponse = await soap.call('CreateExamList', parameters);
		//return processResponse(soapResponse);
		return soapResponse;
	},

	async uploadXML(xml, gradeJson) {
		try {
			if (xml !== null) {
				//let json = soap.getObject(soap.getRequestAsJSON(xml));
				let json = arraysToJSON('params', soap.getRequestAsJSON(xml).CreateExamList);

				let timestamp = json.Parameters.date;
				let year = json.Parameters.year;
				let semester = json.Parameters.semester;
				let stage = json.Parameters.stage;
				let signee = json.Parameters.signee;
				let discipline = json.Parameters.disciplineID;
				let group = json.Parameters.groupNum;
				console.log(timestamp);
				console.log(stage);
				console.log(semester);
				console.log(year);
				const formContent = processFormContent(gradeJson.response);
				let parameters = {};
				if (stage == 4) {
					parameters = {
						Parameters: {
							date: timestamp,
							year,
							semester,
							signee: signee,
							plans: formContent,
							stage: null,
							disciplineID: discipline,
						},
					};
				} else {
					parameters = {
						Parameters: {
							date: timestamp,
							year,
							semester,
							signee: signee,
							plans: formContent,
							stage: stage,
							disciplineID: discipline,
						},
					};
				}

				const soapRequest = await soap.getRequest('CreateExamList', parameters);
				const soapResponse = await soap.call('CreateExamList', parameters);
				console.log(soapResponse.Errors);
				return soapResponse;
			}
		} catch (err) {
			console.log(err);
		}
	},

	async getUploadFormXML(year, semester, timestamp, form, milestone, discipline, group) {
		const formContent = processFormContent(form.response.body, form.response.type, form.response.group_fullname);
		let parameters = {};
		if (milestone == 4) {
			parameters = {
				Parameters: {
					date: timestamp,
					year,
					semester,
					signee: form.response.author,
					plans: formContent,
					stage: null,
					disciplineID: discipline,
				},
			};
		} else {
			parameters = {
				Parameters: {
					date: timestamp,
					year,
					semester,
					signee: form.response.author,
					plans: formContent,
					stage: milestone,
					disciplineID: discipline,
				},
			};
		}
		const soapResponse = await soap.getRequest('CreateExamList', parameters);
		return soapResponse;
	},
};
