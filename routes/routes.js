const express = require('express');
const auth = require('../auth')
const router = express.Router();

const loginController = require('../controllers/loginController')
const dashboardController = require('../controllers/dashboardController')
const faceRecogController = require('../controllers/faceRecogController')
const logsController = require('../controllers/logsController')
const accountsController = require('../controllers/accountsController')
const emailController = require('../controllers/emailController')
const criminalRecController = require('../controllers/criminalRecController')
const crimeRecController = require('../controllers/crimeRecController')
const crimeTypeController = require('../controllers/crimeTypeController')
const personDetailsController = require('../controllers/personDetailsController')
const userDetailsController = require('../controllers/userDetailsController')
const settingsController = require('../controllers/settingsController')
const crimeReportController = require('../controllers/crimeReportController')

// router.use(flash());

//login Page
router.get('/', loginController.getLoginPage);
router.post('/dashboard', loginController.authenticateLogin);

//OTP
router.post('/forgotPassword',loginController.forgotPassword,emailController.sendOTPEmail)
router.post('/changePassword',loginController.changePassword)

//dashboard
router.get('/dashboard',auth, dashboardController.getDashboard);


router.get('/get_all_logs',auth, logsController.getAllLogs) //for dashboard chart
router.get('/get_crime_logs',auth, logsController.getCrimeLogs)
router.get('/get_changes_in_record',auth, logsController.getChangesinRecordLogs)


//face recognition
router.get('/detect_face', auth,faceRecogController.getForm)
router.post('/process_face_detection', auth,faceRecogController.processForm);

//Account Creation
router.post('/addUser',auth,accountsController.addUser)

//Logs Page
router.get('/view_all_logs',auth,logsController.viewAllLogs) //for logs page
router.get('/view_more_logs',auth,logsController.getMoreLogs)

//Criminal
router.get('/view_all_criminal_rec',auth,criminalRecController.viewAllCriminalRec)
router.get('/view_more_crimi_recs',auth,criminalRecController.getMoreCriminalRec)
router.get('/search_criminal_rec',auth,criminalRecController.searchCriminalRec)
router.get('/get_results_search_criminal_rec',auth,criminalRecController.searchCriminalRecResults)

router.get('/add_criminal_record',auth,criminalRecController.addCriminalRecordPage)
router.post('/process_add_criminal_rec',auth,criminalRecController.processAddCriminalRec)

router.get('/update_criminal_record',auth,criminalRecController.updCriminalRecordPage)
router.get('/get_criminal_info',auth,criminalRecController.getCriminalInfo)
router.post('/process_upd_criminal_rec',auth,criminalRecController.processUpdateCriminalRec);

router.get('/get_full_criminal_record',auth, criminalRecController.getFullCriminalRecord)

//Crime

router.get('/search_crime_rec',auth,crimeRecController.searchCrimeRec);
router.get('/get_results_search_crime_rec',auth,crimeRecController.searchCrimeRecResults);
router.get('/view_all_crime_rec',auth,crimeRecController.viewAllCrimeRec);
router.get('/view_more_crime_recs',auth,crimeRecController.getMoreCrimeRec);

router.get('/add_crime_record',auth,crimeRecController.getAddCrimeRecordPage);

router.post('/process_add_crime_rec',auth,crimeRecController.processAddCrimeRec);
router.get('/update_crime_record',auth,crimeRecController.getUpdateCrimeRecPage);
router.get('/get_crimes_of_criminal',auth,crimeRecController.getCrimesOfCriminal);
router.get('/get_crime_rec_info',auth,crimeRecController.getCrimeRecInfo);
router.post('/process_upd_crime_rec',auth,crimeRecController.processUpdateCrimeRec);

//crime Report

router.get('/crime_report',auth, crimeReportController.getCrimeReport)
router.get('/gen_crime_report',auth, crimeReportController.genCrimeReport)

//Crime Type
router.get('/add_crime_type',auth,crimeTypeController.getAddCrimeTypePage);
router.post('/process_add_crime',auth,crimeTypeController.addCrimeType);

router.get('/update_crime_type',auth,crimeTypeController.getUpdateCrimeTypePage);
router.post('/process_update_crime',auth,crimeTypeController.updateCrimeType);
router.get('/get_crime_laws',auth,crimeTypeController.getCrimeLaws)

router.get('/view_crime_type',auth,crimeTypeController.viewCrimeType)

//Person Details

router.get('/view_person_details', auth,personDetailsController.viewPersonDetail)
router.get('/search_person', auth,personDetailsController.searchPersonDetail)
router.get('/search_person_name', auth,personDetailsController.getPersonName);


//Users

router.get('/search_user',auth,userDetailsController.searchUser)
router.get('/process_search_user',auth,userDetailsController.processSearchUser)
router.get('/view_users',auth,userDetailsController.getAllUsers)
router.get('/view_more_users',auth,userDetailsController.getMoreUsers)
router.post('/add_user',auth,accountsController.addUser);
router.get('/verify',accountsController.verifyAccount)

//Settings
router.get('/my_profile',auth,settingsController.viewProfile)
router.get('/settings',auth,settingsController.viewSettings)
router.post('/changePasswordWold',auth,settingsController.changePasswordWold)
router.get('/view_my_logs',auth,settingsController.getMyLogs)

//Account
router.get('/create_account',auth,accountsController.getCreateAccPage)
router.get('/get_username',auth,accountsController.getUsername)


//logout
router.get('/logout', loginController.logout)

module.exports = router;