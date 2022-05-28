import requests
from optparse import OptionParser

#base_url = "http://grade.sfedu.ru/sync"
#base_url = "http://grade-dev.mmcs.sfedu.ru:3005"
#base_url = "http://localhost:3000"
base_url = "http://localhost:5010"
year = "2020-21"
semester = "2"
timeout = 30*60 # wait half an hour for each request to complete
useDismissedTeachers = "0"
useDismissedStudents = "0"
writeFiles = False

def sync_gym_attendance():
	url = base_url+"/sport_attendance"

	payload={}
	headers = {}

	response = requests.request("GET", url, headers=headers, data=payload, timeout=timeout)

	print(response.text)


def sync_teachers():
    url = base_url+"/teachers/preprocess"

    querystring = {"enableDismissed":useDismissedTeachers}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "d3fd08d1-7640-4c88-ae7d-05d86d7aedc1"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring, timeout=timeout)

    print(response.text)

def sync_plans(form = "1"):
    url = base_url+"/plans"

    querystring = {"year":year,"semester":semester,"form":form}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "6548ecb7-2656-4a0a-86ac-e7d3c0b98b50"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring, timeout=timeout)

    print(response.text)

def dump_plans(form = "1"):
    import requests

    url = base_url+"/plans/dump"

    querystring = {"year":year,"semester":semester,"form":form,"usemongo":"true","writefiles":writeFiles}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "5ab026fa-4853-475e-bd39-37ee4318cd23"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)

    print(response.text)

def sync_students():
    url = base_url + "/students"

    querystring = {"enableDismissed":useDismissedStudents}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "9ac41762-8bbc-4e85-a3ee-26340a67f91e"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring, timeout=timeout)

    print(response.text)

def sync_global_disciplines():
    url = base_url + "/globalDisciplines"

    querystring = {"year":year,"semester":semester}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "e821583d-fd39-4396-803a-b5c8ef66b2ed"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring, timeout=timeout)

def sync_muam_disciplines():
    url = base_url + "/globalDisciplines/muam"

    querystring = {"year":year,"semester":semester}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "e821583d-fd39-4396-803a-b5c8ef66b2ed"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring, timeout=timeout)

    print(response.text)

def sync_phiz_disciplines():
    url = base_url + "/globalDisciplines/phiz"

    querystring = {"year":year,"semester":semester}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "e821583d-fd39-4396-803a-b5c8ef66b2ed"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring, timeout=timeout)

    print(response.text)

def dump_global_disciplines():
    url = base_url+ "/globalDisciplines/dump"

    querystring = {"year":year,"semester":semester,"usemongo":"true","writefiles":writeFiles}

    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "89d84d58-3f63-40d4-a9ad-67dc2cb58f44"
    }

    response = requests.request("GET", url, headers=headers, params=querystring)
    print(response.text)

def dump_students():
    import requests

    url = base_url + "/students/dump"

    querystring = {"enableDismissed":useDismissedStudents,"usemongo":"true","writefiles":writeFiles}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "00ecb631-6f19-4d5d-a051-42313d16e663"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)

    print(response.text)

def dump_teachers(clear):
    import requests

    url = base_url + "/teachers/dump"

    querystring = {"enableDismissed":useDismissedTeachers,"usemongo":"true","writefiles":writeFiles, "clearOld": clear}

    payload = ""
    headers = {
        'cache-control': "no-cache",
        'Postman-Token': "1f9dd8da-5e31-4f5d-bfe3-6a12a7c410b6"
        }

    response = requests.request("GET", url, data=payload, headers=headers, params=querystring)

    print(response.text)

if __name__=="__main__":
    parser = OptionParser()
    parser.add_option("-s", "--sync", dest="sync",
                        help="sync from 1C", action="store_true")
    parser.add_option("-d", "--dump", dest="dump", action="store_true",
                      help="dump data from 1C")
    parser.add_option("-x", "--teachers", dest="teachers", action="store_true",
                          help="process teachers")
    parser.add_option("-y", "--plans", dest="plans", action="store_true",
                              help="process plans")
    parser.add_option("-z", "--students", dest="students", action="store_true",
                              help="process students")
    parser.add_option("-w", "--globals", dest="globals", action="store_true",
                              help="process global disciplines")
    parser.add_option("-u", "--muam", dest="muam", action="store_true",
                              help="process muam disciplines")
    parser.add_option("-p", "--phiz", dest="phiz", action="store_true",
                              help="process athletic disciplines")
    parser.add_option("-f", "--files", dest="files", action="store_true",
                          help="write 1c data into json files")
    parser.add_option("-m", "--semester", dest="semester_num", default=semester,
                          help="semester number")
    parser.add_option("-g", "--gym", dest="gym", action="store_true"
                              help="sync daily gym attendance")
    parser.add_option("-c", "--clear", dest="clear_old", action="store_true",
                          help="clear old info")
    parser.add_option("-a", "--year", dest="set_year", default=year, help="year to get plans from")
    (options, args) = parser.parse_args()
    semester = options.semester_num
    year = options.set_year
    if options.sync:
        if options.gym:
            sync_gym_attendance()
        if options.teachers:
            sync_teachers()
        if options.plans:
            sync_plans()    # day
            sync_plans("2") # evening
            sync_plans("3") # parttime
        if options.students:
            sync_students()
        if options.globals:
            sync_global_disciplines()
        if options.muam:
            sync_muam_disciplines()
        if options.phiz:
            sync_phiz_disciplines()
    if options.files:
        writeFiles = True
    if options.dump:
        if options.teachers:
            dump_teachers(options.clear_old)
        if options.plans:
            dump_plans()    # day
            dump_plans("2") # evening
            dump_plans("3") # parttime
        if options.students:
            dump_students()
        if options.globals:
            dump_global_disciplines()
