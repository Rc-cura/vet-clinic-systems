import { StyleSheet } from "react-native";

const MyStyleSheet = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F2F2F2',
    paddingTop: 10,
  },
  logoContainer: {
    paddingLeft: 20,
    marginBottom: 20,
  },
  logoCircle: {
    width: 45,
    height: 45,
    // borderRadius: 22.5,
    // backgroundColor: '#fff',
    // borderWidth: 1,
    // borderColor: '#ddd',
    marginLeft: 7,
  },
  content: {
    flex: 1,
    alignItems: 'center', // This centers everything horizontally
    justifyContent: 'center', // This centers the whole group vertically
    paddingHorizontal: 20,
    marginBottom: 30
  },

  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
    fontStyle: 'italic',
    marginTop: 8,
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    marginTop: 25,
    marginBottom: 40, // Space between dots and the first button
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ccc',
    marginHorizontal: 4,
  },
  dotActive: {
    width: 24, // Wider dot like the design
    height: 8,
    borderRadius: 4,
    backgroundColor: '#5C6BC0',
    marginHorizontal: 4,
  },
  button: {
    backgroundColor: '#667EEA',
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 15,
    width: 370, 
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  // Add these to your existing MyStyleSheet.js
  bgImage: {
    flex: 1,
    paddingHorizontal: 20,
  },
  regHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  clinicName: { fontSize: 28, fontWeight: '900', color: '#8B1D2E' },
  clinicSub: { fontSize: 16, fontWeight: 'bold', color: '#1A3A77', letterSpacing: 1 },
  logoCircleSmall: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#fff', elevation: 5, justifyContent: 'center', alignItems: 'center' },
  
  // The Card Style
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 25,
    padding: 25,
    elevation: 15, // High shadow for floating effect
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    alignItems: 'center',
  },
  cardTitle: { fontSize: 22, fontWeight: 'bold', marginBottom: 20, color: '#000' },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: '#FAFAFA',
  },
  regButton: {
    backgroundColor: '#667EEA',
    width: '100%',
    paddingVertical: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  
  // Social Section
  socialSection: { marginTop: 30, alignItems: 'center' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  line: { flex: 1, height: 1, backgroundColor: '#DDD' },
  orText: { marginHorizontal: 10, color: '#555', fontSize: 12 },
  iconRow: { flexDirection: 'row', justifyContent: 'center', marginBottom: 25 },
  socialIcon: {
    width: 50, height: 50, borderRadius: 25, backgroundColor: '#FFF',
    justifyContent: 'center', alignItems: 'center', marginHorizontal: 10,
    elevation: 3, shadowOpacity: 0.1,
  },
  footerText: { color: '#666', fontSize: 13 },
  // Add these to your MyStyleSheet.js
  otpInstruction: {
    fontSize: 14,
    color: '#555',
    lineHeight: 20,
    marginBottom: 20,
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 20,
  },
  otpInput: {
    width: 40,
    height: 50,
    backgroundColor: '#E0E0E0',
    borderRadius: 8,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    borderWidth: 1,
    borderColor: '#CCC',
  },
  timerRow: {
    alignSelf: 'flex-start',
    marginBottom: 30,
  },
  timerText: { fontSize: 11, color: '#888' },
  resendText: { fontSize: 11, color: '#444', marginTop: 2 },
  cancelBtn: {
    width: '100%',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#EAEAEA',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#CCC'
  },
  cancelBtnText: { color: '#666', fontWeight: 'bold' },

  dashHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    paddingTop: 20, 
    paddingBottom: 10,
    alignItems: 'center' 
  },
  welcomeText: { fontSize: 22, fontWeight: 'bold', color: '#333' },
  headerIcons: { flexDirection: 'row', alignItems: 'center' },
  profileCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E0E0E0' },
  notifBtn: { marginLeft: 10 },
  
  sectionRow: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 25, marginTop: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#444',marginBottom:10 },
  badge: { backgroundColor: '#E8EFFE', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 2, marginLeft: 8 },
  badgeText: { fontSize: 13, fontWeight: 'bold', color: '#5C93E8' },

  petCardContainer: { alignItems: 'center' },
  petCard: { 
    backgroundColor: '#5C93E8', 
    width: '90%',
    borderRadius: 25, 
    padding: 25, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#5C93E8',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  petName: { color: '#FFF', fontSize: 24, fontWeight: 'bold' },
  petDetails: { color: '#FFF', fontSize: 14, marginTop: 4, opacity: 0.9 },
  petPhotoCircle: { width: 85, height: 85, borderRadius: 42.5, backgroundColor: '#E0E0E0', borderWidth: 3, borderColor: 'rgba(255,255,255,0.3)' },

  dashDotsRow: { flexDirection: 'row', marginTop: 15, marginBottom: 5 },
  dashDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#D1D1D1', marginHorizontal: 4 },
  dashDotActive: { width: 22, height: 8, borderRadius: 4, backgroundColor: '#5C93E8', marginHorizontal: 4 },

  bookBtn: { 
    backgroundColor: '#8CB6F5', 
    marginHorizontal: 20, 
    marginTop: 20,
    borderRadius: 22, 
    padding: 18, 
    flexDirection: 'row', 
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#8CB6F5',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.3,
  },
  bookIconContainer: { backgroundColor: 'rgba(255,255,255,0.2)', padding: 8, borderRadius: 12 },
  bookBtnTitle: { color: '#FFF', fontWeight: 'bold', fontSize: 18 },
  bookBtnSub: { color: '#FFF', fontSize: 12, opacity: 0.85, marginTop: 2 },

  infoCard: { 
    backgroundColor: '#FFF', 
    marginHorizontal: 20, 
    marginTop: 20, 
    borderRadius: 25, 
    padding: 22, 
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  cardHeading: { fontSize: 18, fontWeight: 'bold', marginBottom: 18, color: '#222' },
  alertItem: { 
    backgroundColor: '#FFF', 
    padding: 16, 
    borderRadius: 20, 
    marginBottom: 10, 
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1, 
    borderColor: '#F0F3F7',
    elevation: 1,
  },
  alertIcon: { marginRight: 10, fontSize: 16 },
  alertText: { fontSize: 14, color: '#555', flex: 1, lineHeight: 20 },
  
  appointmentRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  apptDate: { fontSize: 14, fontWeight: '600', color: '#444' },
  apptDetails: { fontSize: 14, color: '#777', flex: 1, marginLeft: 10 },
  statusBadge: { backgroundColor: '#E3F9F1', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  statusText: { color: '#27AE60', fontSize: 11, fontWeight: 'bold' },

  activityItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  activityIcon: { fontSize: 18, marginRight: 12 },
  activityText: { fontSize: 15, color: '#555' },

  fab: { 
    position: 'absolute', 
    right: 25, 
    bottom: 110, 
    width: 65, 
    height: 65, 
    borderRadius: 32.5, 
    backgroundColor: '#5C93E8', 
    justifyContent: 'center', 
    alignItems: 'center', 
    elevation: 8,
    shadowColor: '#5C93E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
  },

  bottomNav: { 
    position: 'absolute', 
    bottom: 0, 
    width: '100%', 
    height: 95, 
    backgroundColor: '#D1E3FF', 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    borderTopLeftRadius: 35, 
    borderTopRightRadius: 35,
    paddingBottom: 15
  },
  navItem: { alignItems: 'center', opacity: 0.6 },
  navItemActive: { 
    backgroundColor: '#5C93E8', 
    width: 60, 
    height: 60, 
    borderRadius: 20, 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: -40, // Lifted active icon
    elevation: 10,
    shadowColor: '#5C93E8',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.4,
  },
  navLabel: { fontSize: 11, fontWeight: 'bold', color: '#4468B0', marginTop: 4 },
  // Notification Header
  notifHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    padding: 20,
    backgroundColor: '#FFF' 
  },
  notifHeaderText: { fontSize: 18, fontWeight: 'bold', color: '#333' },

  // Segmented Tabs
  tabBar: { 
    flexDirection: 'row', 
    backgroundColor: '#FFF', 
    marginHorizontal: 20, 
    borderRadius: 15, 
    padding: 5,
    marginBottom: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
  },
  tabItem: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabItemActive: { backgroundColor: '#F2F2F2' },
  tabText: { fontSize: 14, color: '#888' },
  tabTextActive: { color: '#333', fontWeight: 'bold' },

  // Notification Cards
  notifCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 12,
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
  },
  notifRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  notifType: { fontWeight: 'bold', fontSize: 15, color: '#222' },
  unreadDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: 'red', marginLeft: 5, marginTop: -10 },
  notifTime: { fontSize: 12, color: '#AAA' },
  notifBody: { fontSize: 14, color: '#555', lineHeight: 20 },

  // Pet Management Header
  petHeader: { paddingHorizontal: 25, marginTop: 20 },
  petHeaderText: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  petHeaderDivider: { height: 1, backgroundColor: '#EEE', marginTop: 15, width: '100%' },

  // Top Circles
  petActionRow: { flexDirection: 'row', paddingHorizontal: 25, marginTop: 20, alignItems: 'center' },
  allPetsCircle: { 
    width: 65, height: 65, borderRadius: 32.5, 
    backgroundColor: '#D1E3FF', borderWidth: 1, borderColor: '#5C93E8',
    justifyContent: 'center', alignItems: 'center' 
  },
  allPetsText: { fontSize: 11, textAlign: 'center', fontWeight: 'bold', color: '#4468B0' },
  
  addNewContainer: { alignItems: 'center', marginLeft: 20 },
  addNewCircle: { 
    width: 60, height: 60, borderRadius: 30, 
    backgroundColor: '#D1E3FF', justifyContent: 'center', alignItems: 'center' 
  },
  addNewLabel: { fontSize: 10, color: '#555', marginTop: 5, fontWeight: '600' },

  // Empty State
  emptyStateContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 40 },
  emptyImage: { width: 250, height: 180, marginBottom: 20 },
  emptyTextMain: { fontSize: 16, textAlign: 'center', color: '#444', lineHeight: 22, fontWeight: '500' },
  
  addFirstBtn: { marginTop: 40 },
  addFirstBtnText: { color: '#4468B0', fontWeight: 'bold', fontSize: 15, letterSpacing: 0.5 },

  // Active Icon for Pet Management (Bottom Nav)
  navItemActive: { 
    backgroundColor: '#5C93E8', width: 60, height: 60, borderRadius: 30, 
    justifyContent: 'center', alignItems: 'center', marginTop: -40,
    elevation: 8, shadowColor: '#5C93E8', shadowOpacity: 0.4, shadowRadius: 10,
  },
// Empty State Appointment
  emptyAppointmentContainer: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center',
    paddingBottom: 100 
  },
  calendarImage: { width: 300, height: 220, marginBottom: 30 },
  emptyAppointmentText: { fontSize: 16, color: '#555', fontWeight: '500' },
  
  bookLink: { marginTop: 50 },
  bookLinkText: { color: '#4468B0', fontWeight: 'bold', fontSize: 16 },

  // Secondary Floating Action Button (FAB)
  fabAdd: {
    position: 'absolute',
    right: 30,
    bottom: 120,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#D1E3FF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },

  // Active Icon for Appointment (Bottom Nav)
  navItemActive: { 
    backgroundColor: '#5C93E8', 
    width: 60, 
    height: 60, 
    borderRadius: 30, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginTop: -40,
    elevation: 8,
    shadowColor: '#5C93E8',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },

  // Invoice Cards
  invoiceCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 15,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  invoiceNumber: { fontSize: 14, fontWeight: 'bold', color: '#444', marginBottom: 15, letterSpacing: 0.5 },
  invoiceDetailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  invoiceLabel: { fontSize: 11, color: '#999', marginBottom: 4 },
  invoiceValue: { fontSize: 13, fontWeight: 'bold', color: '#333' },
  invoiceDivider: { height: 1, backgroundColor: '#F0F0F0', marginBottom: 15 },
  
  invoiceActionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  invoicePrice: { fontSize: 20, fontWeight: 'bold', color: '#000' },
  
  viewBtn: { 
    borderWidth: 1, 
    borderColor: '#CCC', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    paddingVertical: 8, 
    marginRight: 8 
  },
  viewBtnText: { fontSize: 11, color: '#555', fontWeight: '600' },
  
  downloadBtn: { 
    backgroundColor: '#D1E3FF', 
    borderRadius: 10, 
    paddingHorizontal: 12, 
    paddingVertical: 8 
  },
  downloadBtnText: { fontSize: 11, color: '#4468B0', fontWeight: 'bold' },

  // Idagdag ang mga ito sa loob ng StyleSheet.create({...})

  // Header Styles
  formHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    backgroundColor: '#FFF',
  },
  formHeaderTitle: { fontSize: 18, fontWeight: 'bold', color: '#000' },
  backBtn: { padding: 5 },

  // Upload Section
  formScrollContent: { paddingHorizontal: 25, paddingBottom: 50 },
  uploadContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 30,
  },
  profileCircleBlack: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 20,
  },
  uploadOutlineBtn: {
    width:250,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 20,
    paddingHorizontal: 20,
    paddingVertical: 10,
    alignItems: 'center',
  },
  uploadBtnLabel: { fontWeight: 'bold', fontSize: 14, marginLeft:50 },

  // Form Inputs
  inputGroup: { marginTop: 5 },
  formInput: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 15,
    paddingHorizontal: 15,
    paddingVertical: 12,
    fontSize: 15,
    color: '#333',
    marginBottom: 15,
    // Subtle shadow gaya ng nasa pic
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  inlineInputs: { flexDirection: 'row', justifyContent: 'space-between' },
  textArea: { height: 100, textAlignVertical: 'top' },

  // Blue Button
  continuePrimaryBtn: {
    backgroundColor: '#5C93E8',
    borderRadius: 25,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 20,
    shadowColor: '#5C93E8',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  continueBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 17 },
  // Modal / Pop-up Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)', // Madilim na background sa likod ng pop-up
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 25,
    color: '#333',
    textAlign: 'center',
  },
  modalBackBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#E0E0E0',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalBackText: { fontWeight: 'bold', color: '#555' },
  modalViewProfileBtn: {
    width: '100%',
    paddingVertical: 12,
    borderRadius: 12,
    backgroundColor: '#5C93E8',
    alignItems: 'center',
  },
  modalViewText: { fontWeight: 'bold', color: '#FFF' },
  // Summary Page Styles
  summaryProfileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 60,
    marginBottom: 40,
  },
  summaryPetName: { fontSize: 24, fontWeight: 'bold', color: '#000' },
  summaryPetType: { fontSize: 16, color: '#555', marginTop: 5 },
  summaryCircleGray: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#E0E0E0',
  },

  // Detail Items with Bottom Border
  detailsContainer: { marginBottom: 50 },
  detailItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  detailLabel: { fontSize: 15, color: '#444' },
  detailValue: { fontSize: 15, fontWeight: '500', color: '#000' },

  // Pet Selector (Top)
  petSelectActive: {
    width: 65, height: 65, borderRadius: 33, 
    borderWidth: 1, borderColor: '#5C93E8', 
    justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  petSelectTextActive: { fontSize: 11, color: '#5C93E8', textAlign: 'center', fontWeight: 'bold' },
  petSelectCircle: { width: 65, height: 65, borderRadius: 33, backgroundColor: '#E0E0E0', justifyContent: 'center', alignItems: 'center' },
  petSelectLabel: { fontSize: 11, color: '#555', marginTop: 8, textAlign: 'center' },

  // Pet Card
  petCardMain: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 20,
    elevation: 3,
    shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 10,
  },
  petCardHeader: { flexDirection: 'row', alignItems: 'center' },
  petCardCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: '#D9D9D9' , justifyContent: 'center', 
  alignItems: 'center',},
  petCardName: { fontSize: 16, fontWeight: 'bold', color: '#000' },
  petCardSub: { fontSize: 13, color: '#777', marginTop: 4 },
  petWeightTag: { fontSize: 12, color: '#AAA', alignSelf: 'flex-start' },
  
  cardDivider: { height: 1, backgroundColor: '#F0F0F0', marginVertical: 15 },
  
  petActionRow: { flexDirection: 'row', justifyContent: 'space-around' },
  petActionBtn: { alignItems: 'center', flex: 1 },
  petActionLabel: { fontSize: 11, color: '#333', marginTop: 5, fontWeight: '500' },

// Profile Top Section
  summaryHero: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between', // Itutulak nito ang text sa kaliwa at circle sa kanan
    marginTop: 40,
    marginBottom: 40,
  },
  sumPetNameText: { fontSize: 26, fontWeight: 'bold', color: '#000' },
  sumPetSubText: { fontSize: 16, color: '#666', marginTop: 5 },
  sumBigCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#E0E0E0',
    justifyContent: 'center', 
    alignItems: 'center',      
    overflow: 'hidden', // Ensures the image doesn't "leak" out of the circle
  },

  // Detail Row Styling
  detailsListGroup: { marginTop: 10 },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Labels sa kaliwa, Values sa kanan
    alignItems: 'center',
    paddingVertical: 18,
    borderBottomWidth: 1,
    borderBottomColor: '#EEEEEE', // Manipis na linya sa ilalim
  },
  detailLabelText: { fontSize: 15, color: '#444' },
  detailValueText: { fontSize: 15, fontWeight: '500', color: '#000' },

  // Blue Button Style
  primaryBlueBtn: {
    backgroundColor: '#5C93E8',
    height: 55,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryBlueBtnText: { color: '#FFF', fontSize: 17, fontWeight: 'bold' },

  detailRowWithLine: {
    flexDirection: 'row',
    justifyContent: 'space-between', // Itutulak ang Gender sa kaliwa at Female sa kanan
    alignItems: 'center',
    paddingVertical: 15,            // Spacing sa itaas at ilalim ng text
    borderBottomWidth: 1,           // Kapal ng linya
    borderBottomColor: '#E0E0E0',    // Kulay ng linya (Light Gray)
    marginBottom: 5,                // Space bago ang susunod na row
  },
  detailLabelText: {
    fontSize: 16,
    color: '#333',
  },
  detailValueText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#000',
  },

  // Edit Photo Styles
  editPhotoContainer: {
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 20,
    alignSelf: 'center',
  },
  cameraIconOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 5,
   // backgroundColor: '#FFF',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  // Input Box Style (Para sa lahat ng forms mo)
  inputBox: {
    height: 55,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    paddingHorizontal: 15,
    fontSize: 15,
    color: '#000',
    backgroundColor: '#FFF',
    marginBottom: 15,
  },

  // Appointment Screen Header
  apptHeader: { flexDirection: 'row', justifyContent: 'space-between', padding: 25, alignItems: 'center' },
  apptHiUser: { fontSize: 18, fontWeight: 'bold' },
  apptUserCircle: { width: 35, height: 35, borderRadius: 18, backgroundColor: '#D9D9D9' },
  
  // Tab Navigation Styles
  tabContainer: { flexDirection: 'row', backgroundColor: '#F5F5F5', marginHorizontal: 20, borderRadius: 10, padding: 5, marginBottom: 20 },
  tabButton: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 8 },
  activeTabButton: { backgroundColor: '#FFF', elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 3 },
  tabText: { color: '#888', fontSize: 13 },
  activeTabText: { color: '#000', fontWeight: 'bold' },

  // Card Styles
  apptCard: { backgroundColor: '#FFF', borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 5 },
  apptCardContent: { flexDirection: 'row', alignItems: 'center' },
  apptDateText: { fontSize: 14, fontWeight: 'bold', color: '#333' },
  apptServiceRow: { flexDirection: 'row', alignItems: 'center', marginVertical: 8 },
  apptServiceName: { fontSize: 14, fontWeight: '600', marginLeft: 8 },
  apptStatusTag: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8 },
  apptStatusText: { fontSize: 11, fontWeight: '500' },
  
  // Pet Circle inside Card
  apptPetCircle: { width: 45, height: 45, borderRadius: 23, backgroundColor: '#D9D9D9' , justifyContent: 'center',
  alignItems: 'center',
  overflow: 'hidden',},
  apptPetNameText: { fontSize: 11, marginTop: 5, fontWeight: 'bold' },

  // Floating Action Button
  apptFab: { position: 'absolute', bottom: 100, right: 25, width: 55, height: 55, borderRadius: 28, backgroundColor: '#D1E3FF', justifyContent: 'center', alignItems: 'center', elevation: 5 },

  // Container na may linya sa ilalim
  apptHeaderContainer: {
    marginBottom:20,
    borderBottomWidth: 1,
    borderBottomColor: '#c4bebe', // Light gray color para sa manipis na linya
    width: '100%',
    paddingBottom: 10, // Space sa pagitan ng text at ng linya
  },

  apptHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    paddingHorizontal: 25, 
    paddingTop: 25, 
    alignItems: 'center' 
  },

  // Profile Titles
  profileMainTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 30,
    marginBottom: 20,
    color: '#000',
  },
  inputLabel: {
    fontSize: 13,
    color: '#999',
    marginBottom: 5,
    marginLeft: 5,
  },

  // Logout Button Style (Outline)
  secondaryOutlineBtn: {
    height: 55,
    borderRadius: 28,
    borderWidth: 1,
    borderColor: '#5C93E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 15,
  },
  secondaryOutlineText: {
    color: '#5C93E8',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // Logout Modal Styles
  logoutModalContainer: {
    width: '80%',
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 25,
    alignItems: 'center',
    elevation: 10,
  },
  logoutTitle: {
    fontSize: 22,
    fontWeight: '900',
    color: '#000',
    marginBottom: 10,
  },
  logoutSubTitle: {
    fontSize: 15,
    color: '#666',
    marginBottom: 25,
  },
  logoutActionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  yesBtn: {
    backgroundColor: '#1A3578', // Dark Blue
    flex: 0.45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noBtn: {
    backgroundColor: '#8B1A1A', // Dark Red
    flex: 0.45,
    height: 45,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  yesNoText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
  },

  // Success Modal for User Profile
  successModalSmall: {
    width: '85%',
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 5,
  },
  successModalText: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#000',
    marginBottom: 20,
  },
  viewProfileModalBtn: {
    backgroundColor: '#5C93E8',
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#3D73C7',
  },
  viewProfileModalText: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '600',
  },

  // Label for Select Pet
  selectPetLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  // Progress Bar Styles
  progressBarBg: {
    height: 4,
    backgroundColor: '#E0E0E0',
    borderRadius: 2,
    width: '100%',
    marginBottom: 20,
  },
  progressBarActive: {
    height: 4,
    backgroundColor: '#5C93E8', // Blue progress
    borderRadius: 2,
    width: '30%', // Step 1 of 3 (halimbawa)
  },

  // Grid Styles (image_4ec397.png)
  gridItem: {
    flex: 1,
    aspectRatio: 1, // Gagawin itong saktong square
    margin: 10,
    backgroundColor: '#FFF',
    borderRadius: 15,
    // Shadows para magmukhang card
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    overflow: 'hidden',
  },
  gridImagePlaceholder: {
    flex: 1,
    backgroundColor: '#D9D9D9', // Gray placeholder
  },

  // Service Card Style
  serviceCard: {
    width: '60%', // Mas makitid gaya ng nasa image
    backgroundColor: '#FFF',
    borderRadius: 15,
    paddingVertical: 25,
    paddingHorizontal: 15,
    alignItems: 'center',
    marginBottom: 20,
    // Shadows
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  serviceCardText: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },

  // Disclaimer Style
  disclaimerText: {
    fontSize: 11,
    color: '#666',
    textAlign: 'center',
    marginVertical: 20,
    paddingHorizontal: 20,
    fontStyle: 'italic',
  },

  // Button Text (Kung wala pa ito sa sheet mo)
  primaryBlueBtnText: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: 'bold',
  },

  // Dropdown Style
  dropdownBox: {
    height: 50,
    borderWidth: 1,
    borderColor: '#DDD',
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    backgroundColor: '#FFF',
  },

  // Calendar Card Style (image_4f4e1c.png)
  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    elevation: 5,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 10,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  calendarGridPlaceholder: {
    height: 200, // Space para sa mga dates
    backgroundColor: '#FAFAFA',
    borderRadius: 10,
    marginBottom: 15,
  },

  // Time Section
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
  },
  timePill: {
    backgroundColor: '#F0F0F0',
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
  },

  calendarCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 10, // Binawasan para sa library component
    elevation: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    marginTop: 10,
  },
  timePickerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#EEE',
    paddingTop: 15,
    paddingHorizontal: 10,
    marginTop: 10,
    paddingBottom: 10,
  },
  timePill: {
    backgroundColor: '#F0F5FF', // Light blue tint
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#5C93E8',
  },

  dropdown: {
    height: 50,
    borderColor: '#E0E0E0',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 15,
    backgroundColor: '#F9F9F9',
  },
  placeholderStyle: {
    fontSize: 14,
    color: '#999',
  },
  selectedTextStyle: {
    fontSize: 16,
    color: '#333',
    fontWeight: 'bold',
  },

  summaryTitle: { fontSize: 18, fontWeight: 'bold', marginVertical: 10 },
  progressBarFull: { height: 4, backgroundColor: '#5C93E8', borderRadius: 2, marginBottom: 20 },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    // Shadow for iOS/Android
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
  },
  iconPlaceholderCircle: { width: 45, height: 45, borderRadius: 22.5, backgroundColor: '#E0E0E0', marginRight: 15 },
  iconPlaceholderSquare: { width: 45, height: 45, borderRadius: 10, backgroundColor: '#E0E0E0', marginRight: 15 },
  cardTitleText: { fontSize: 16, fontWeight: 'bold' },
  cardSubText: { fontSize: 12, color: '#666' },
  noteLabel: { fontSize: 14, fontWeight: 'bold', marginTop: 10, marginBottom: 5 },
  noteInput: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    borderColor: '#E0E0E0',
    borderWidth: 1,
    marginBottom: 5,
  },
  // Modal Styles
  policyBox: { width: '85%', backgroundColor: '#FFF', borderRadius: 20, padding: 25 },
  modalTitleLarge: { fontSize: 22, fontWeight: 'bold', marginBottom: 15 },
  modalBodyText: { fontSize: 14, color: '#666', marginBottom: 20, lineHeight: 20 },
  modalCancelBtn: { backgroundColor: '#E0E0E0', padding: 12, borderRadius: 10, alignItems: 'center', marginBottom: 10 },
  modalUnderstandBtn: { backgroundColor: '#5C93E8', padding: 12, borderRadius: 10, alignItems: 'center' },
  successBox: { width: '80%', backgroundColor: '#FFF', borderRadius: 15, padding: 25 },
  successBodyText: { fontSize: 16, marginBottom: 20 },
  successActionBtn: { backgroundColor: '#5C93E8', alignSelf: 'flex-end', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8 },

  detailsMainCard: {
    backgroundColor: '#FFF',
    padding: 25,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  detailsDateText: { fontSize: 20, fontWeight: 'bold' },
  detailsTimeText: { fontSize: 16, color: '#666', marginVertical: 5 },
  detailsStatusBadge: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    marginTop: 10
  },
  detailsStatusText: { fontWeight: '600', fontSize: 14 },
  cancelGhostBtn: {
    marginTop: 10,
    alignItems: 'center',
    padding: 15,
    
  },
  cancelGhostText: { color: '#5C93E8', fontWeight: '500' },
  findingsBox: {
    backgroundColor: '#F9F9F9',
    padding: 15,
    borderRadius: 10,
    minHeight: 80,
    borderWidth: 1,
    borderColor: '#EEE'
  },

  detailsMainCard: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#F0F0F0',
    elevation: 2,
  },
  detailsDateText: { fontSize: 18, fontWeight: 'bold' },
  detailsTimeText: { fontSize: 15, color: '#333', marginTop: 4 },
  detailsStatusBadge: {
    paddingVertical: 10,
    paddingHorizontal: 40,
    borderRadius: 12,
    marginTop: 15,
    marginBottom: 15,
  },
  detailsStatusText: { fontWeight: 'bold', fontSize: 14 },
  requestedDateLabel: { fontSize: 11, color: '#999' },
  noteDisplayBox: {
    backgroundColor: '#FFF',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F0F0F0'
  },
  noteTextSmall: { fontSize: 12, color: '#666', lineHeight: 18 },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#5C93E8',
    padding: 15,
    borderRadius: 28,
    alignItems: 'center',
    marginTop: 12,
  },
  outlineBtnText: { color: '#5C93E8', fontWeight: 'bold', fontSize: 16 },
  ghostCancelBtn: {
    padding: 15,
    alignItems: 'center',
    marginTop: 12,
    backgroundColor:'#d6e2f4',
    borderRadius: 28
  },
  ghostCancelText: { color: '#5C93E8', fontSize: 14 },
  // Icon holders
  iconPlaceholderSquare: { 
    width: 45, height: 45, borderRadius: 10, 
    backgroundColor: '#FFF', borderAround: 1, borderColor: '#EEE',
    justifyContent: 'center', alignItems: 'center', marginRight: 15 
  },
  secondaryBlueBtn: {
    backgroundColor: '#D1E3FF', // Light blue background base sa mockup
    padding: 15,
    borderRadius: 15,
    alignItems: 'center',
    marginTop: 12,
  },
  secondaryBlueBtnText: {
    color: '#5C93E8', // Darker blue text para readable
    fontWeight: 'bold',
    fontSize: 16,
  },

  findingsDisplayBox: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    padding: 15,
    height: 100,
    textAlignVertical: 'top',
    borderColor: '#F0F0F0',
    borderWidth: 1,
    marginTop: 5,
    color: '#999'
  },
  modalHalfBtn: {
    width: '48%',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  serviceCard: {
  // ... existing styles
  borderWidth: 1,
  borderColor: '#EEE', // Default color kapag hindi pa napili
},

serviceCard: {
  backgroundColor: '#FFF',
  width: 160,          // Base sa square-ish look sa image
  height: 160,
  borderRadius: 20,
  justifyContent: 'center',
  alignItems: 'center',
  marginBottom: 20,
  padding: 15,
  // Shadow para sa iOS
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.1,
  shadowRadius: 10,
  // Shadow para sa Android
  elevation: 5,
  borderWidth: 1,
  borderColor: '#F0F0F0',
},
serviceCardText: {
  fontSize: 14,
  fontWeight: '600',
  textAlign: 'center',
  color: '#333',
},
primaryBlueBtn: {
  backgroundColor: '#5C93E8',
  paddingVertical: 15,
  borderRadius: 30,    // Rounded sides base sa images
  alignItems: 'center',
  width: '100%',
},
primaryBlueBtnText: {
  color: '#FFF',
  fontSize: 18,
  fontWeight: 'bold',
},
billingModalBox: {
    backgroundColor: '#FFF',
    width: '85%',
    borderRadius: 20,
    padding: 25,
    elevation: 10,
  },
  billingModalTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
    textTransform: 'uppercase',
  },
  billingItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
  billingItemName: { fontSize: 13, fontWeight: 'bold' },
  billingItemQty: { fontSize: 11, color: '#666' },
  billingItemPrice: { fontSize: 13, fontWeight: 'bold' },
  billingTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
  },
  billingTotalLabel: { fontSize: 18, fontWeight: 'bold' },
  billingTotalValue: { fontSize: 18, fontWeight: 'bold' },

})

export default MyStyleSheet;